from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class ProjectBase(BaseModel):
    project_code: str
    name: str
    project_type: str
    state: str
    district: str
    land_required: float = 0.0
    land_acquired: float = 0.0
    affected_families: int = 0
    displaced_families: int = 0
    status: str = "IN_PROGRESS"
    start_date: Optional[str] = None
    target_date: Optional[str] = None
    current_stage: str = "Proposal"

class ProjectCreate(ProjectBase):
    id: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    land_acquired: Optional[float] = None
    status: Optional[str] = None
    current_stage: Optional[str] = None
    target_date: Optional[str] = None
    risk_level: Optional[str] = None

class ProjectOut(ProjectBase):
    id: str
    risk_level: str = "LOW"
    risk_score: float = 15.0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
