from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from app.db.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=False)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True, nullable=True)
    risk_id = Column(String, ForeignKey("risk_predictions.id"), nullable=True)
    recommendation = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    priority = Column(String, default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    assigned_to = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    status = Column(String, default="OPEN")  # OPEN, IN_PROGRESS, COMPLETED, DISMISSED
    created_at = Column(DateTime, default=datetime.utcnow)
