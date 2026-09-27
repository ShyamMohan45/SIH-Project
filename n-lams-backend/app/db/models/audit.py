from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user = Column(String, nullable=False)
    role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    entity = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
