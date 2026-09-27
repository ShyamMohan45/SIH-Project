from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class RecommendationOut(BaseModel):
    id: str
    project_id: str
    parcel_id: Optional[str] = None
    risk_id: Optional[str] = None
    recommendation: str
    reason: str
    priority: str
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationActionRequest(BaseModel):
    action: str  # ACCEPT, DISMISS, IN_PROGRESS, COMPLETE
    officer_id: Optional[str] = None
    notes: Optional[str] = None
