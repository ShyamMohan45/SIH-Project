from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.compensation import CompensationRecord

router = APIRouter(prefix="/compensation", tags=["Compensation"])

@router.get("")
def get_compensation_records(project_id: str = Query(None), db: Session = Depends(get_db)):
    q = db.query(CompensationRecord)
    if project_id and project_id != "ALL":
        q = q.filter(CompensationRecord.project_id == project_id)
    return q.all()
