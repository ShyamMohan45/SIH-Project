import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.alert import RiskAlert

def create_alert(
    db: Session,
    project_id: str,
    title: str,
    message: str,
    severity: str = "HIGH",
    parcel_id: Optional[str] = None,
    inspection_id: Optional[str] = None,
    delay_days: int = 0,
    assigned_to: Optional[str] = None
) -> RiskAlert:
    alert = RiskAlert(
        id=f"ALT-{uuid.uuid4().hex[:8].upper()}",
        project_id=project_id,
        parcel_id=parcel_id,
        inspection_id=inspection_id,
        severity=severity,
        title=title,
        message=message,
        delay_days=delay_days,
        assigned_to=assigned_to or "District Land Officer",
        status="ACTIVE",
        created_at=datetime.utcnow()
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

def get_alerts(
    db: Session,
    project_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    limit: int = 50
) -> List[RiskAlert]:
    query = db.query(RiskAlert)
    if project_id and project_id.upper() != "ALL":
        query = query.filter(RiskAlert.project_id == project_id)
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(RiskAlert.status == status_filter)
    return query.order_by(RiskAlert.created_at.desc()).limit(limit).all()

def resolve_alert(db: Session, alert_id: str, resolved_by: Optional[str] = None) -> Optional[RiskAlert]:
    alert = db.query(RiskAlert).filter(RiskAlert.id == alert_id).first()
    if alert:
        alert.status = "RESOLVED"
        alert.resolved_at = datetime.utcnow()
        db.commit()
        db.refresh(alert)
    return alert
