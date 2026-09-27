from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.project import Project
from app.db.models.parcel import Parcel
from app.db.models.notice import PublicNotice
from app.db.models.workflow import WorkflowStage
from app.services.gis_service import get_geojson_parcels

router = APIRouter(prefix="/public", tags=["Public Transparency Portal (No Login Required)"])

@router.get("/summary")
def get_public_summary(db: Session = Depends(get_db)):
    projects = db.query(Project).filter(Project.is_public == True).all()
    total_req = sum(p.land_required for p in projects)
    total_acq = sum(p.land_acquired for p in projects)
    progress = round((total_acq / max(total_req, 1.0)) * 100.0, 1)
    states = list(set(p.state for p in projects))
    notices_count = db.query(PublicNotice).filter(PublicNotice.is_public == True).count()

    return {
        "status": "success",
        "portal": "N-LAMS Public Transparency Portal",
        "transparency_portal": "N-LAMS Public Transparency Portal",
        "jurisdiction": "All India (Publicly Disclosed Projects)",
        "published_projects": len(projects),
        "total_projects": len(projects),
        "active_projects": len(projects),
        "participating_states": len(states),
        "total_land_required_ha": round(total_req, 2),
        "total_land_acquired_ha": round(total_acq, 2),
        "national_progress_pct": progress,
        "affected_families_count": sum(p.affected_families for p in projects),
        "public_notices_count": notices_count,
        "disclaimer": "Information published here is intended for citizen awareness and transparency under the Digital India Land Records Modernisation Programme (DILRMP). All private landowner data, financial credentials, and internal operational logs are restricted."
    }

@router.get("/states")
def get_public_states(db: Session = Depends(get_db)):
    projects = db.query(Project).filter(Project.is_public == True).all()
    state_map = {}
    for p in projects:
        st = p.state
        if st not in state_map:
            state_map[st] = {
                "state": st,
                "projects_count": 0,
                "land_required_ha": 0.0,
                "land_acquired_ha": 0.0,
                "districts": set()
            }
        state_map[st]["projects_count"] += 1
        state_map[st]["land_required_ha"] += p.land_required
        state_map[st]["land_acquired_ha"] += p.land_acquired
        state_map[st]["districts"].add(p.district)

    result = []
    for st, v in state_map.items():
        req = v["land_required_ha"]
        acq = v["land_acquired_ha"]
        pct = round((acq / max(req, 1.0)) * 100.0, 1)
        result.append({
            "state": st,
            "projects_count": v["projects_count"],
            "districts_count": len(v["districts"]),
            "land_required_ha": round(req, 2),
            "land_acquired_ha": round(acq, 2),
            "progress_pct": pct
        })
    result.sort(key=lambda x: x["projects_count"], reverse=True)
    return result

@router.get("/states/{state_name}")
def get_public_state_detail(state_name: str, db: Session = Depends(get_db)):
    projects = db.query(Project).filter(
        Project.state.ilike(state_name),
        Project.is_public == True
    ).all()
    if not projects:
        raise HTTPException(status_code=404, detail=f"No public data available for state '{state_name}'")

    notices = db.query(PublicNotice).filter(
        PublicNotice.state.ilike(state_name),
        PublicNotice.is_public == True
    ).all()

    req = sum(p.land_required for p in projects)
    acq = sum(p.land_acquired for p in projects)
    pct = round((acq / max(req, 1.0)) * 100.0, 1)

    return {
        "state": state_name.title(),
        "projects_count": len(projects),
        "land_required_ha": round(req, 2),
        "land_acquired_ha": round(acq, 2),
        "progress_pct": pct,
        "projects": [
            {
                "id": p.id,
                "project_code": p.project_code,
                "name": p.name,
                "project_type": p.project_type,
                "district": p.district,
                "status": p.status,
                "progress_pct": round((p.land_acquired / max(p.land_required, 1.0)) * 100.0, 1)
            } for p in projects
        ],
        "public_notices": [
            {
                "id": n.id,
                "title": n.title,
                "notice_type": n.notice_type,
                "issue_date": n.issue_date,
                "summary": n.summary
            } for n in notices
        ]
    }

@router.get("/projects")
def get_public_projects(
    state: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(Project).filter(Project.is_public == True)
    if state and state.upper() != "ALL":
        q = q.filter(Project.state.ilike(state))
    if search:
        s = f"%{search}%"
        q = q.filter(Project.name.ilike(s) | Project.district.ilike(s) | Project.project_code.ilike(s))

    projects = q.all()
    return [
        {
            "id": p.id,
            "project_code": p.project_code,
            "name": p.name,
            "project_type": p.project_type,
            "state": p.state,
            "district": p.district,
            "land_required_ha": p.land_required,
            "land_acquired_ha": p.land_acquired,
            "progress_pct": round((p.land_acquired / max(p.land_required, 1.0)) * 100.0, 1),
            "status": p.status,
            "current_stage": p.current_stage,
            "target_date": p.target_date,
            "last_updated": p.updated_at.strftime("%Y-%m-%d") if p.updated_at else "2026-03-12"
        } for p in projects
    ]

@router.get("/projects/{project_id}")
def get_public_project_detail(project_id: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(
        (Project.id == project_id) | (Project.project_code == project_id),
        Project.is_public == True
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found or not approved for public disclosure")

    # Public milestones from workflow stages
    stages = db.query(WorkflowStage).filter(WorkflowStage.project_id == p.id).order_by(WorkflowStage.stage_order).all()
    public_stages = [
        {
            "stage": s.stage,
            "stage_order": s.stage_order,
            "planned_date": s.planned_end,
            "status": s.status
        } for s in stages
    ]

    # Public notices
    notices = db.query(PublicNotice).filter(
        PublicNotice.project_id == p.id,
        PublicNotice.is_public == True
    ).order_by(PublicNotice.issue_date.desc()).all()

    # Redacted public parcels list (No PII, No Aadhaar, No Bank Details, No Contact Numbers)
    raw_parcels = db.query(Parcel).filter(Parcel.project_id == p.id, Parcel.is_public == True).all()
    public_parcels = [
        {
            "id": parc.id,
            "khasra_number": parc.survey_number,
            "survey_number": parc.survey_number,
            "village": parc.village,
            "district": parc.district,
            "area": parc.area,
            "compensation_status": parc.compensation_status,
            "possession_status": parc.possession_status,
            "statutory_risk": parc.risk_level
        } for parc in raw_parcels
    ]

    proj_info = {
        "id": p.id,
        "project_code": p.project_code,
        "name": p.name,
        "project_type": p.project_type,
        "state": p.state,
        "district": p.district,
        "land_required_ha": p.land_required,
        "land_acquired_ha": p.land_acquired,
        "progress_pct": round((p.land_acquired / max(p.land_required, 1.0)) * 100.0, 1),
        "status": p.status,
        "current_stage": p.current_stage,
        "start_date": p.start_date,
        "target_date": p.target_date,
        "milestones": public_stages,
        "public_notices": [
            {
                "id": n.id,
                "title": n.title,
                "notice_type": n.notice_type,
                "issue_date": n.issue_date,
                "summary": n.summary,
                "file_path": n.file_path
            } for n in notices
        ]
    }

    return {
        **proj_info,
        "project": proj_info,
        "parcels": public_parcels
    }

@router.get("/notices")
def get_public_notices(
    state: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(PublicNotice).filter(PublicNotice.is_public == True)
    if state and state.upper() != "ALL":
        q = q.filter(PublicNotice.state.ilike(state))
    return q.order_by(PublicNotice.issue_date.desc()).all()

@router.get("/reports")
def get_public_reports(db: Session = Depends(get_db)):
    return [
        {
            "id": "PUB-REP-001",
            "title": "National Highway & Expressway Land Acquisition Progress Report (Q1 2026)",
            "published_by": "Ministry of Rural Development (DoLR) & MoRTH",
            "date": "2026-03-01",
            "file_size": "2.4 MB",
            "category": "National Summary"
        },
        {
            "id": "PUB-REP-002",
            "title": "Gujarat Corridor RFCTLARR Fair Compensation & Direct Benefit Transfer Audit",
            "published_by": "Revenue Department, Government of Gujarat",
            "date": "2026-02-15",
            "file_size": "1.8 MB",
            "category": "State Audit"
        },
        {
            "id": "PUB-REP-003",
            "title": "Social Impact Assessment (SIA) Public Disclosures - Western Alignment",
            "published_by": "National Infrastructure Monitoring Authority",
            "date": "2026-01-20",
            "file_size": "3.1 MB",
            "category": "SIA Transparency"
        }
    ]

@router.get("/map")
def get_public_map(
    project_id: Optional[str] = Query("NH-GJ-2026-001"),
    db: Session = Depends(get_db)
):
    # Only return public geometry
    return get_geojson_parcels(db, project_id=project_id)
