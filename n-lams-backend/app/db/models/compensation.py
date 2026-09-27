from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from app.db.database import Base

class CompensationRecord(Base):
    __tablename__ = "compensation_records"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True)
    beneficiary_name = Column(String, nullable=False)
    award_amount = Column(Float, default=0.0)
    disbursed_amount = Column(Float, default=0.0)
    status = Column(String, default="PENDING")  # PENDING, DETERMINED, APPROVED, DISBURSED, ESCROWED, DISPUTED
    payment_mode = Column(String, default="DBT / RTGS")
    issue_reported = Column(String, nullable=True)
    disbursement_date = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
