from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.db.models.audit import AuditLog

def log_action(
    db: Session,
    user: str,
    role: str,
    action: str,
    entity: str,
    entity_id: str,
    old_value: Optional[str] = None,
    new_value: Optional[str] = None
) -> AuditLog:
    log_entry = AuditLog(
        user=user,
        role=role,
        action=action,
        entity=entity,
        entity_id=str(entity_id),
        old_value=str(old_value) if old_value else None,
        new_value=str(new_value) if new_value else None,
        timestamp=datetime.utcnow()
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
