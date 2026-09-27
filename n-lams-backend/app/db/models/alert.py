from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from app.db.database import Base

class RiskAlert(Base):
    __tablename__ = "risk_alerts"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=False)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True, nullable=True)
    inspection_id = Column(String, ForeignKey("field_inspections.id"), index=True, nullable=True)
    severity = Column(String, default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    delay_days = Column(Integer, default=0)
    assigned_to = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")  # ACTIVE, ACKNOWLEDGED, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
