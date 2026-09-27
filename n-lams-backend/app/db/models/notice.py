from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from app.db.database import Base

class PublicNotice(Base):
    __tablename__ = "public_notices"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=True)
    title = Column(String, nullable=False)
    notice_type = Column(String, default="ACQUISITION_NOTICE")  # ACQUISITION_NOTICE, PUBLIC_HEARING, AWARD_NOTICE, RR_NOTICE, UPDATE
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    issue_date = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    file_path = Column(String, nullable=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
