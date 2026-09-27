from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.legal import LegalCase

router = APIRouter(prefix="/legal", tags=["Legal Cell"])

@router.get("")
def get_legal_cases(project_id: str = Query(None), db: Session = Depends(get_db)):
    q = db.query(LegalCase)
    if project_id and project_id != "ALL":
        q = q.filter(LegalCase.project_id == project_id)
    return q.all()
