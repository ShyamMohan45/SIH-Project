from datetime import datetime, date
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.models.project import Project
from app.db.models.workflow import WorkflowStage
from app.db.models.parcel import Parcel
from app.db.models.alert import RiskAlert
from app.schemas.project import ProjectCreate, ProjectUpdate

def parse_date(date_str: Optional[str]) -> Optional[date]:
    if not date_str:
        return None
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_str.strip(), fmt).date()
        except ValueError:
            pass
    return None

def calculate_stage_delays(stages: List[WorkflowStage]) -> List[WorkflowStage]:
    today = date.today()
    for s in stages:
        planned_end_dt = parse_date(s.planned_end)
        if not planned_end_dt:
            s.delay_days = 0
            continue

        if s.status == "COMPLETED":
            actual_end_dt = parse_date(s.actual_end) or today
            delta = (actual_end_dt - planned_end_dt).days
            s.delay_days = max(0, delta)
        elif s.status in ("IN_PROGRESS", "DELAYED", "PENDING"):
            if today > planned_end_dt:
                delta = (today - planned_end_dt).days
                s.delay_days = max(0, delta)
                s.status = "DELAYED"
            else:
                s.delay_days = 0
    return stages

def get_projects(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    state: Optional[str] = None,
    district: Optional[str] = None,
    search: Optional[str] = None,
    status_filter: Optional[str] = None
) -> List[Project]:
    query = db.query(Project)
    if state and state.upper() != "ALL":
        query = query.filter(Project.state == state)
    if district and district.upper() != "ALL":
        query = query.filter(Project.district == district)
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(Project.status == status_filter)
    if search:
        s = f"%{search}%"
        query = query.filter(or_(
            Project.name.ilike(s),
            Project.project_code.ilike(s),
            Project.district.ilike(s),
            Project.state.ilike(s)
        ))
    return query.offset(skip).limit(limit).all()

def get_project_by_id(db: Session, project_id: str) -> Optional[Project]:
    return db.query(Project).filter(
        (Project.id == project_id) | (Project.project_code == project_id)
    ).first()

def get_project_workflow(db: Session, project_id: str) -> List[WorkflowStage]:
    stages = db.query(WorkflowStage).filter(WorkflowStage.project_id == project_id).order_by(WorkflowStage.stage_order).all()
    return calculate_stage_delays(stages)
