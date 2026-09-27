from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from app.db.database import Base

class DocumentRecord(Base):
    __tablename__ = "document_records"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True, nullable=True)
    document_type = Column(String, nullable=False)  # GAZETTE_NOTIFICATION, SIA_REPORT, KHASRA_MAP, SECTION_11, SECTION_19, AWARD_STATEMENT
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size_kb = Column(Integer, default=100)
    is_public = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
