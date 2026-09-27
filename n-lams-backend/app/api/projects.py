import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.project import Project
from app.db.models.parcel import Parcel
from app.db.models.alert import RiskAlert
from app.db.models.inspection import FieldInspection
from app.schemas.project import ProjectOut, ProjectCreate, ProjectUpdate
from app.schemas.workflow import WorkflowStageOut
from app.schemas.parcel import ParcelOut
from app.schemas.alert import AlertOut
from app.services.project_service import get_projects, get_project_by_id, get_project_workflow
from app.services.audit_service import log_action

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectOut])
def list_projects(
    skip: int = 0,
    limit: int = 100,
    state: Optional[str] = Query("ALL"),
    district: Optional[str] = Query("ALL"),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return get_projects(db, skip=skip, limit=limit, state=state, district=district, search=search, status_filter=status)

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("", response_model=ProjectOut)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    proj_id = data.id or f"PRJ-{uuid.uuid4().hex[:6].upper()}"
    new_proj = Project(
        id=proj_id,
        project_code=data.project_code,
        name=data.name,
        project_type=data.project_type,
        state=data.state,
        district=data.district,
        land_required=data.land_required,
        land_acquired=data.land_acquired,
        affected_families=data.affected_families,
        displaced_families=data.displaced_families,
        status=data.status,
        start_date=data.start_date,
        target_date=data.target_date,
        current_stage=data.current_stage
    )
    db.add(new_proj)
    db.commit()
    db.refresh(new_proj)
    log_action(db, user="SYSTEM", role="ADMIN", action="CREATE_PROJECT", entity="PROJECT", entity_id=new_proj.id)
    return new_proj

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(project_id: str, data: ProjectUpdate, db: Session = Depends(get_db)):
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, val in data.dict(exclude_unset=True).items():
        setattr(project, field, val)
    db.commit()
    db.refresh(project)
    log_action(db, user="SYSTEM", role="ADMIN", action="UPDATE_PROJECT", entity="PROJECT", entity_id=project.id)
    return project

@router.get("/{project_id}/workflow", response_model=List[WorkflowStageOut])
def get_workflow(project_id: str, db: Session = Depends(get_db)):
    return get_project_workflow(db, project_id)

@router.get("/{project_id}/parcels", response_model=List[ParcelOut])
def get_project_parcels(project_id: str, db: Session = Depends(get_db)):
    return db.query(Parcel).filter(Parcel.project_id == project_id).all()

@router.get("/{project_id}/alerts", response_model=List[AlertOut])
def get_project_alerts(project_id: str, db: Session = Depends(get_db)):
    return db.query(RiskAlert).filter(RiskAlert.project_id == project_id).order_by(RiskAlert.created_at.desc()).all()

@router.get("/{project_id}/inspections")
def get_project_inspections(project_id: str, db: Session = Depends(get_db)):
    return db.query(FieldInspection).filter(FieldInspection.project_id == project_id).all()
