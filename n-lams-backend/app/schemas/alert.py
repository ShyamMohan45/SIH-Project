from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class AlertOut(BaseModel):
    id: str
    project_id: str
    parcel_id: Optional[str] = None
    inspection_id: Optional[str] = None
    severity: str
    title: str
    message: str
    delay_days: int = 0
    assigned_to: Optional[str] = None
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AlertResolveRequest(BaseModel):
    resolved_by: Optional[str] = None
    remarks: Optional[str] = None
