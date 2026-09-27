from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class AuditLogOut(BaseModel):
    id: int
    user: str
    role: str
    action: str
    entity: str
    entity_id: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
