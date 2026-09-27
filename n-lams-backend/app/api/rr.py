from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.rr import RRRecord

router = APIRouter(prefix="/rr", tags=["R&R Resettlement"])

@router.get("")
def get_rr_records(project_id: str = Query(None), db: Session = Depends(get_db)):
    q = db.query(RRRecord)
    if project_id and project_id != "ALL":
        q = q.filter(RRRecord.project_id == project_id)
    return q.all()
