from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class WorkflowStageOut(BaseModel):
    id: str
    project_id: str
    stage: str
    stage_order: int
    planned_start: Optional[str] = None
    planned_end: Optional[str] = None
    actual_start: Optional[str] = None
    actual_end: Optional[str] = None
    status: str
    delay_days: int = 0
    responsible_officer: Optional[str] = None
    remarks: Optional[str] = None

    class Config:
        from_attributes = True

class WorkflowStageUpdate(BaseModel):
    status: Optional[str] = None
    actual_start: Optional[str] = None
    actual_end: Optional[str] = None
    remarks: Optional[str] = None
