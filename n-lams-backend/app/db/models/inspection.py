from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class InspectionTask(Base):
    __tablename__ = "inspection_tasks"

    id = Column(String, primary_key=True, index=True)
    inspection_code = Column(String, unique=True, index=True, nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=False)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True, nullable=False)
    khasra_number = Column(String, index=True, nullable=True)
    village = Column(String, nullable=True)
    district = Column(String, nullable=True)
    area_ha = Column(Float, default=0.0)
    assigned_officer_id = Column(String, index=True, nullable=False)
    priority = Column(String, default="HIGH")  # LOW, MEDIUM, HIGH, CRITICAL
    reason = Column(String, nullable=True)
    assigned_date = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    completed_date = Column(String, nullable=True)
    status = Column(String, default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED, OVERDUE, RETURNED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FieldInspection(Base):
    __tablename__ = "field_inspections"

    id = Column(String, primary_key=True, index=True)
    inspection_code = Column(String, unique=True, index=True, nullable=False)
    task_id = Column(String, ForeignKey("inspection_tasks.id"), index=True, nullable=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=False)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True, nullable=False)
    officer_id = Column(String, index=True, nullable=False)
    officer_name = Column(String, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    
    # GPS Verification
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    gps_accuracy = Column(Float, nullable=True)
    gps_verified = Column(Boolean, default=False)
    distance_meters = Column(Float, default=0.0)

    # Khasra Verification
    khasra_expected = Column(String, nullable=True)
    khasra_observed = Column(String, nullable=True)
    khasra_matched = Column(Boolean, default=True)

    # Boundary Verification
    boundary_status = Column(String, default="MATCH")  # MATCH, MISMATCH, UNCERTAIN
    boundary_notes = Column(Text, nullable=True)

    # Land Use
    land_use_recorded = Column(String, nullable=True)
    land_use_observed = Column(String, nullable=True)
    land_use_matched = Column(Boolean, default=True)
    crop_type = Column(String, nullable=True)

    # Structure & Encroachment
    structure_present = Column(Boolean, default=False)
    structure_type = Column(String, nullable=True)
    structure_count = Column(Integer, default=0)
    encroachment_status = Column(String, default="NO")  # NO, YES, UNCERTAIN

    # Occupancy
    occupancy_status = Column(String, default="OWNER_CULTIVATED")
    person_present = Column(String, nullable=True)

    # Compensation & Legal
    compensation_status = Column(String, default="AWAITING_AWARD")
    compensation_issue = Column(String, nullable=True)
    objection_status = Column(String, default="NONE")
    dispute_type = Column(String, nullable=True)

    # R&R
    rr_required = Column(Boolean, default=False)
    rr_status = Column(String, default="NOT_APPLICABLE")
    rr_type = Column(String, nullable=True)
    rr_issue = Column(String, nullable=True)

    remarks = Column(Text, nullable=True)
    status = Column(String, default="SUBMITTED")  # DRAFT, IN_PROGRESS, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, RETURNED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Database relationship: FieldInspection -> InspectionIssue
    issues = relationship("InspectionIssue", backref="inspection", foreign_keys="InspectionIssue.inspection_id", lazy="select")

class InspectionChecklist(Base):
    __tablename__ = "inspection_checklists"

    id = Column(String, primary_key=True, index=True)
    inspection_id = Column(String, ForeignKey("field_inspections.id"), index=True, nullable=False)
    boundary_visible = Column(Boolean, default=True)
    survey_marker_available = Column(Boolean, default=True)
    land_use_verified = Column(Boolean, default=True)
    area_consistent = Column(Boolean, default=True)
    notice_received = Column(Boolean, default=True)
    owner_verified = Column(Boolean, default=True)
    compensation_discussed = Column(Boolean, default=True)
    possession_checked = Column(Boolean, default=True)
    affected_family_verified = Column(Boolean, default=True)
    rr_checked = Column(Boolean, default=True)
    survey_number_checked = Column(Boolean, default=True)
    field_evidence_captured = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class InspectionPhoto(Base):
    __tablename__ = "inspection_photos"

    id = Column(String, primary_key=True, index=True)
    photo_id = Column(String, unique=True, index=True, nullable=True)
    inspection_id = Column(String, ForeignKey("field_inspections.id"), index=True, nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=True)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True, nullable=True)
    category = Column(String, nullable=False)  # SURVEY_MARKER, BOUNDARY, LAND_CROP, STRUCTURE, ENCROACHMENT, COMPENSATION, OTHER
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    gps_available = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    uploaded_by = Column(String, nullable=True)

class InspectionIssue(Base):
    __tablename__ = "inspection_issues"

    id = Column(String, primary_key=True, index=True)
    inspection_id = Column(String, ForeignKey("field_inspections.id"), index=True, nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=True)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True, nullable=True)
    issue_type = Column(String, nullable=False)  # KHASRA_MISMATCH, BOUNDARY_MISMATCH, ENCROACHMENT, OWNER_DISPUTE, COMPENSATION_ISSUE, LAND_USE_MISMATCH, RR_ISSUE
    severity = Column(String, default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    description = Column(Text, nullable=False)
    status = Column(String, default="OPEN")  # OPEN, INVESTIGATING, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)

class FieldGPSLog(Base):
    __tablename__ = "field_gps_logs"

    id = Column(String, primary_key=True, index=True)
    inspection_id = Column(String, ForeignKey("field_inspections.id"), index=True, nullable=False)
    officer_id = Column(String, index=True, nullable=False)
    parcel_id = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=True)
    distance_meters = Column(Float, default=0.0)
    gps_verified = Column(Boolean, default=True)
    is_demo = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

