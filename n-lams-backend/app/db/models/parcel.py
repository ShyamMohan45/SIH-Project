from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.db.spatial_types import PostGISGeometry

class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=False)
    survey_number = Column(String, index=True, nullable=False)  # Khasra / Survey Number
    village = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    state = Column(String, default="Gujarat", nullable=False)
    area = Column(Float, default=0.0)  # in Hectares
    owner_count = Column(Integer, default=1)
    primary_owner = Column(String, nullable=True)
    acquisition_status = Column(String, default="PENDING")  # PENDING, NOTIFIED, ACQUIRED, DISPUTED
    compensation_status = Column(String, default="PENDING")  # PENDING, DETERMINED, PAID, ESCROWED
    legal_status = Column(String, default="CLEAR")  # CLEAR, STAYED, DISPUTED, LITIGATION
    possession_status = Column(String, default="PENDING")  # PENDING, PARTIAL, COMPLETED
    field_verification_status = Column(String, default="PENDING")  # PENDING, IN_PROGRESS, VERIFIED, MISMATCH
    risk_level = Column(String, default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    geometry = Column(PostGISGeometry, nullable=True)
    is_public = Column(Boolean, default=True)  # GeoJSON Polygon / MultiPolygon
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Database relationship: Parcel -> FieldInspection
    inspections = relationship("FieldInspection", backref="parcel", foreign_keys="FieldInspection.parcel_id", lazy="select")

