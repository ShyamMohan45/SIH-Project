from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from app.db.database import Base

class WorkflowStage(Base):
    __tablename__ = "workflow_stages"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=False)
    stage = Column(String, nullable=False)  # Proposal, Scrutiny, Approval, Notification, Objection, Award, Compensation, R&R, Possession, Closure
    stage_order = Column(Integer, default=1)
    planned_start = Column(String, nullable=True)
    planned_end = Column(String, nullable=True)
    actual_start = Column(String, nullable=True)
    actual_end = Column(String, nullable=True)
    status = Column(String, default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED, DELAYED
    delay_days = Column(Integer, default=0)
    responsible_officer = Column(String, nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
