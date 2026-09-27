from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from app.db.database import Base

class RRRecord(Base):
    __tablename__ = "rr_records"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    family_head = Column(String, nullable=False)
    entitlement_type = Column(String, default="HOUSING")  # HOUSING, CASH_GRANT, EMPLOYMENT, RESETTLEMENT
    status = Column(String, default="SURVEYED")  # SURVEYED, SANCTIONED, ALLOTTED, COMPLETED
    resettlement_site = Column(String, nullable=True)
    issue_flagged = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
