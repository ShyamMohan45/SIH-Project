import uuid
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.recommendation import Recommendation

def create_recommendation(
    db: Session,
    project_id: str,
    recommendation: str,
    reason: str,
    priority: str = "HIGH",
    parcel_id: Optional[str] = None,
    risk_id: Optional[str] = None,
    assigned_to: Optional[str] = None,
    days_to_due: int = 14
) -> Recommendation:
    due_date = (datetime.utcnow() + timedelta(days=days_to_due)).strftime("%Y-%m-%d")
    rec = Recommendation(
        id=f"REC-{uuid.uuid4().hex[:8].upper()}",
        project_id=project_id,
        parcel_id=parcel_id,
        risk_id=risk_id,
        recommendation=recommendation,
        reason=reason,
        priority=priority,
        assigned_to=assigned_to or "SLAO / Competent Authority",
        due_date=due_date,
        status="OPEN",
        created_at=datetime.utcnow()
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

def get_recommendations(
    db: Session,
    project_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    limit: int = 50
) -> List[Recommendation]:
    query = db.query(Recommendation)
    if project_id and project_id.upper() != "ALL":
        query = query.filter(Recommendation.project_id == project_id)
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(Recommendation.status == status_filter)
    return query.order_by(Recommendation.created_at.desc()).limit(limit).all()
