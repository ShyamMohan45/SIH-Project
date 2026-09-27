from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.project import Project
from app.db.models.parcel import Parcel
from app.db.models.compensation import CompensationRecord
from app.db.models.legal import LegalCase
from app.db.models.rr import RRRecord
from app.db.models.inspection import FieldInspection
from app.db.models.risk import RiskPrediction

router = APIRouter(prefix="/reports", tags=["Statutory Reports"])

@router.get("/projects")
def report_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.get("/delays")
def report_delays(db: Session = Depends(get_db)):
    from app.services.project_service import calculate_stage_delays
    from app.db.models.workflow import WorkflowStage
    stages = db.query(WorkflowStage).all()
    return calculate_stage_delays(stages)

@router.get("/compensation")
def report_compensation(db: Session = Depends(get_db)):
    return db.query(CompensationRecord).all()

@router.get("/legal")
def report_legal(db: Session = Depends(get_db)):
    return db.query(LegalCase).all()

@router.get("/rr")
def report_rr(db: Session = Depends(get_db)):
    return db.query(RRRecord).all()

@router.get("/field-inspections")
def report_field_inspections(db: Session = Depends(get_db)):
    return db.query(FieldInspection).all()

@router.get("/risk")
def report_risk(db: Session = Depends(get_db)):
    return db.query(RiskPrediction).order_by(RiskPrediction.created_at.desc()).limit(100).all()
