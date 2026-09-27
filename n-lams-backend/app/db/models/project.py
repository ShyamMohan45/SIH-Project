from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean
from app.db.database import Base
from app.db.spatial_types import PostGISGeometry

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    project_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    project_type = Column(String, nullable=False)  # Highway, Railway, Metro, Port, Industrial Corridor
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    land_required = Column(Float, default=0.0)  # In Hectares
    land_acquired = Column(Float, default=0.0)
    affected_families = Column(Integer, default=0)
    displaced_families = Column(Integer, default=0)
    status = Column(String, default="IN_PROGRESS")  # IN_PROGRESS, COMPLETED, DELAYED, STALLED
    start_date = Column(String, nullable=True)
    target_date = Column(String, nullable=True)
    actual_completion_date = Column(String, nullable=True)
    current_stage = Column(String, default="Proposal")
    risk_level = Column(String, default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Float, default=15.0)
    corridor_geometry = Column(PostGISGeometry, nullable=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

