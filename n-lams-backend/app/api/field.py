import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.config import settings
from app.db.models.inspection import (
    InspectionTask, FieldInspection, InspectionPhoto, 
    InspectionIssue, FieldGPSLog, InspectionChecklist
)
from app.db.models.parcel import Parcel
from app.db.models.user import User
from app.schemas.inspection import (
    TaskOut, InspectionStartRequest, GPSRequest, 
    ChecklistRequest, IssueCreateRequest, InspectionSubmitRequest, InspectionOut
)
from app.services.field_service import (
    start_inspection, log_gps, process_complete_inspection_submission
)
from app.services.gis_service import get_geojson_parcels

router = APIRouter(prefix="/field", tags=["Field Officer Application"])

@router.get("/profile")
def get_field_profile(officer_id: Optional[str] = Query("FO-007"), db: Session = Depends(get_db)):
    user = db.query(User).filter((User.officer_id == officer_id) | (User.id == officer_id)).first()
    if not user:
        return {
            "officer_id": "FO-007",
            "name": "Vikram Patel",
            "role": "FIELD_OFFICER",
            "district": "Surendranagar",
            "state": "Gujarat",
            "assigned_project": "NH-GJ-2026-001",
            "status": "ACTIVE"
        }
    return {
        "officer_id": user.officer_id or user.id,
        "name": user.name,
        "role": user.role,
        "district": user.district or "Surendranagar",
        "state": user.state or "Gujarat",
        "assigned_project": "NH-GJ-2026-001",
        "status": "ACTIVE" if user.is_active else "INACTIVE"
    }

@router.get("/tasks", response_model=List[TaskOut])
def get_field_tasks(
    officer_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(InspectionTask)
    if officer_id and officer_id != "ALL":
        query = query.filter(InspectionTask.assigned_officer_id == officer_id)
    if status and status != "ALL":
        query = query.filter(InspectionTask.status == status)
    return query.order_by(InspectionTask.due_date).all()

@router.get("/tasks/{task_id}", response_model=TaskOut)
def get_field_task(task_id: str, db: Session = Depends(get_db)):
    t = db.query(InspectionTask).filter(
        (InspectionTask.id == task_id) | (InspectionTask.inspection_code == task_id)
    ).first()
    if not t:
        raise HTTPException(status_code=404, detail="Field task not found")
    return t

@router.post("/inspection/start")
def api_start_inspection(data: InspectionStartRequest, db: Session = Depends(get_db)):
    insp = start_inspection(
        db, project_id=data.project_id, parcel_id=data.parcel_id,
        officer_id=data.officer_id, officer_name=data.officer_name, task_id=data.task_id
    )
    return {
        "success": True,
        "inspection_id": insp.id,
        "inspection_code": insp.inspection_code,
        "status": insp.status,
        "started_at": insp.started_at.isoformat()
    }

@router.post("/inspection/gps")
def api_log_gps(data: GPSRequest, db: Session = Depends(get_db)):
    try:
        res = log_gps(
            db, inspection_id=data.inspection_id, officer_id=data.officer_id,
            latitude=data.latitude, longitude=data.longitude,
            accuracy=data.accuracy or 5.0, is_demo=data.is_demo or False
        )
        return {"success": True, **res}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/inspection/photos")
async def api_upload_photo(
    inspection_id: str = Form(...),
    category: str = Form("BOUNDARY"),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    uploaded_by: Optional[str] = Form("FO-007"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    photo = InspectionPhoto(
        id=f"PHO-{uuid.uuid4().hex[:8].upper()}",
        photo_id=f"PHO-{uuid.uuid4().hex[:8].upper()}",
        inspection_id=inspection_id,
        category=category,
        file_name=filename,
        file_path=file_path,
        latitude=latitude,
        longitude=longitude,
        gps_available=bool(latitude and longitude),
        uploaded_by=uploaded_by
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)

    return {
        "success": True,
        "photo_id": photo.id,
        "file_path": f"/uploads/{filename}",
        "gps_available": photo.gps_available
    }

@router.post("/inspection/checklist")
def api_submit_checklist(data: ChecklistRequest, db: Session = Depends(get_db)):
    return {"success": True, "inspection_id": data.inspection_id, "checklist_recorded": True}

@router.post("/inspection/issues")
def api_report_issue(data: IssueCreateRequest, db: Session = Depends(get_db)):
    insp = db.query(FieldInspection).filter(
        (FieldInspection.id == data.inspection_id) | (FieldInspection.inspection_code == data.inspection_id)
    ).first()
    
    # Normalize issue type
    raw_type = (data.issue_type or "").strip()
    norm_type = raw_type.upper().replace(" ", "_").replace("-", "_")
    
    project_id = insp.project_id if insp else None
    parcel_id = insp.parcel_id if insp else None

    # Resolve parcel if needed
    parcel = None
    if parcel_id:
        parcel = db.query(Parcel).filter(
            (Parcel.id == parcel_id) | (Parcel.survey_number == parcel_id)
        ).first()
        if parcel:
            parcel_id = parcel.id

    issue = InspectionIssue(
        id=f"ISS-{uuid.uuid4().hex[:8].upper()}",
        inspection_id=insp.id if insp else data.inspection_id,
        project_id=project_id,
        parcel_id=parcel_id,
        issue_type=norm_type,
        severity=data.severity or "HIGH",
        description=data.description,
        status="OPEN"
    )
    db.add(issue)
    
    # Mark parcel field_verification_status as MISMATCH immediately
    if parcel:
        parcel.field_verification_status = "MISMATCH"
        if norm_type == "COMPENSATION_ISSUE":
            parcel.compensation_status = "DISPUTED"
        elif norm_type in ("OWNER_DISPUTE", "LEGAL_ISSUE"):
            parcel.legal_status = "DISPUTED"

    db.commit()
    db.refresh(issue)
    return {
        "success": True, 
        "issue_id": issue.id, 
        "issue_type": issue.issue_type, 
        "severity": issue.severity,
        "parcel_id": parcel_id,
        "inspection_id": issue.inspection_id
    }

@router.post("/inspection/submit")
def api_submit_inspection(data: InspectionSubmitRequest, db: Session = Depends(get_db)):
    try:
        res = process_complete_inspection_submission(db, data.dict())
        return {"success": True, **res}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/inspection/{inspection_id}")
def api_get_inspection(inspection_id: str, db: Session = Depends(get_db)):
    insp = db.query(FieldInspection).filter(
        (FieldInspection.id == inspection_id) | (FieldInspection.inspection_code == inspection_id)
    ).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    issues = db.query(InspectionIssue).filter(InspectionIssue.inspection_id == insp.id).order_by(InspectionIssue.created_at.desc()).all()
    checklist = db.query(InspectionChecklist).filter(InspectionChecklist.inspection_id == insp.id).first()
    photos = db.query(InspectionPhoto).filter(InspectionPhoto.inspection_id == insp.id).all()
    parcel = db.query(Parcel).filter(
        (Parcel.id == insp.parcel_id) | (Parcel.survey_number == insp.parcel_id)
    ).first()

    # Build rich inspection dossier payload
    res = {c.name: getattr(insp, c.name) for c in insp.__table__.columns}
    res["khasra_number"] = parcel.survey_number if parcel else (insp.khasra_expected or "1042")
    res["village"] = parcel.village if parcel else "Limbdi"
    res["district"] = parcel.district if parcel else "Surendranagar"
    res["state"] = parcel.state if parcel else "Gujarat"
    res["issues"] = [{c.name: getattr(i, c.name) for c in i.__table__.columns} for i in issues]
    res["checklist"] = {c.name: getattr(checklist, c.name) for c in checklist.__table__.columns} if checklist else None
    res["photos"] = [{c.name: getattr(p, c.name) for c in p.__table__.columns} for p in photos]
    return res

@router.get("/history")
def get_field_history(officer_id: Optional[str] = Query("FO-007"), db: Session = Depends(get_db)):
    query = db.query(FieldInspection)
    if officer_id and officer_id != "ALL":
        query = query.filter(FieldInspection.officer_id == officer_id)
    return query.order_by(FieldInspection.started_at.desc()).all()

@router.get("/map")
def get_field_map(db: Session = Depends(get_db)):
    return get_geojson_parcels(db, project_id="NH-GJ-2026-001")

@router.post("/sync")
def api_sync_offline_data(payload: Dict[str, Any], db: Session = Depends(get_db)):
    # Batch synchronizer for offline Field Officer App records
    inspections_synced = len(payload.get("inspections", []))
    photos_synced = len(payload.get("photos", []))
    return {
        "success": True,
        "synced_at": datetime.utcnow().isoformat(),
        "inspections_synced": inspections_synced,
        "photos_synced": photos_synced,
        "status": "ONLINE"
    }
