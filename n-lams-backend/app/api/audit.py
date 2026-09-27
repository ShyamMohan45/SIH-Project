from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.audit import AuditLog
from app.schemas.audit import AuditLogOut

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("/logs", response_model=List[AuditLogOut])
def get_audit_logs(limit: int = Query(50), db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
