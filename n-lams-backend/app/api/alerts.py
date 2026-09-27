import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.alert import AlertOut, AlertResolveRequest
from app.services.alert_service import get_alerts, resolve_alert, create_alert

router = APIRouter(prefix="/alerts", tags=["Alert Engine"])

@router.get("", response_model=List[AlertOut])
def list_alerts(
    project_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return get_alerts(db, project_id=project_id, status_filter=status, limit=limit)

@router.post("/{alert_id}/resolve", response_model=AlertOut)
def api_resolve_alert(alert_id: str, body: AlertResolveRequest = None, db: Session = Depends(get_db)):
    alert = resolve_alert(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
