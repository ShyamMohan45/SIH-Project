from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from app.db.database import Base

class LegalCase(Base):
    __tablename__ = "legal_cases"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True)
    court_name = Column(String, nullable=False)
    case_number = Column(String, nullable=False)
    dispute_category = Column(String, default="OWNERSHIP")  # OWNERSHIP, COMPENSATION_ENHANCEMENT, ACQUISITION_VALIDITY
    stay_granted = Column(Boolean, default=False)
    status = Column(String, default="PENDING")  # PENDING, ADMITTED, HEARD, DISPOSED
    next_hearing_date = Column(String, nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
