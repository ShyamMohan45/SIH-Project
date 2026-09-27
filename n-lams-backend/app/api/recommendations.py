from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.recommendation import Recommendation
from app.schemas.recommendation import RecommendationOut, RecommendationActionRequest
from app.services.recommendation_service import get_recommendations
from app.services.audit_service import log_action

router = APIRouter(prefix="/recommendations", tags=["Recommendation Engine"])

@router.get("", response_model=List[RecommendationOut])
def list_recommendations(
    project_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return get_recommendations(db, project_id=project_id, status_filter=status, limit=limit)

@router.post("/{rec_id}/action", response_model=RecommendationOut)
def take_recommendation_action(
    rec_id: str,
    action_data: RecommendationActionRequest,
    db: Session = Depends(get_db)
):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    old_status = rec.status
    if action_data.action == "DISMISS":
        rec.status = "DISMISSED"
    elif action_data.action in ("ACCEPT", "IN_PROGRESS"):
        rec.status = "IN_PROGRESS"
    elif action_data.action == "COMPLETE":
        rec.status = "COMPLETED"

    db.commit()
    db.refresh(rec)

    log_action(
        db, user=action_data.officer_id or "OFFICER", role="OFFICER",
        action=f"RECOMMENDATION_{action_data.action}", entity="RECOMMENDATION",
        entity_id=rec.id, old_value=old_status, new_value=rec.status
    )
    return rec
