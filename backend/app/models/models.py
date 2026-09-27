from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)  # CENTRAL_ADMIN, STATE_OFFICER, DISTRICT_OFFICER, FIELD_OFFICER, VIEWER
    department = Column(String)
    state = Column(String)
    district = Column(String)
    hashed_password = Column(String, default="pbkdf2_sha256$default")
    created_at = Column(DateTime, default=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    project_code = Column(String, index=True)
    name = Column(String, nullable=False)
    project_type = Column(String, nullable=False)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False)
    land_required = Column(Float, nullable=False)
    land_acquired = Column(Float, default=0.0)
    affected_families = Column(Integer, default=0)
    displaced_families = Column(Integer, default=0)
    start_date = Column(String)
    target_date = Column(String)
    actual_completion_date = Column(String, nullable=True)
    current_stage = Column(String, default="Proposal")
    status = Column(String, default="IN_PROGRESS")  # IN_PROGRESS, DELAYED, COMPLETED, CRITICAL
    compensation_assessed_cr = Column(Float, default=0.0)
    compensation_disbursed_cr = Column(Float, default=0.0)
    rr_completed_families = Column(Integer, default=0)
    possession_ha = Column(Float, default=0.0)
    legal_cases = Column(Integer, default=0)
    risk_level = Column(String, default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Float, default=15.0)
    predicted_delay_days = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    survey_number = Column(String, index=True)
    khasra_number = Column(String, index=True)
    village = Column(String)
    taluka = Column(String)
    district = Column(String)
    state = Column(String)
    area_ha = Column(Float)
    land_type = Column(String)
    owner_name = Column(String)
    owner_count = Column(Integer, default=1)
    acquisition_status = Column(String, default="Under Process")  # Acquired, Under Process, Disputed
    compensation_status = Column(String, default="Pending")  # Paid, Pending, Verification, Disputed
    compensation_assessed = Column(Float, default=0.0)
    compensation_paid = Column(Float, default=0.0)
    legal_status = Column(String, default="Clear")  # Clear, Disputed, High Court Stay
    legal_case_no = Column(String, default="None")
    possession_status = Column(String, default="Not Taken")  # Taken, In Progress, Not Taken
    risk_level = Column(String, default="Low")  # Low, Medium, High, Critical
    ai_risk_score = Column(Float, default=15.0)
    field_verified = Column(Boolean, default=False)
    field_verified_date = Column(String, nullable=True)
    field_officer = Column(String, nullable=True)
    gps_lat = Column(Float, nullable=True)
    gps_lng = Column(Float, nullable=True)
    geometry = Column(JSON, nullable=True)  # GeoJSON geometry representation

class WorkflowStage(Base):
    __tablename__ = "workflow_stages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    stage_number = Column(Integer)
    stage_name = Column(String)
    responsible_dept = Column(String)
    planned_start = Column(String)
    planned_end = Column(String)
    actual_start = Column(String, nullable=True)
    actual_end = Column(String, nullable=True)
    status = Column(String, default="PENDING")  # COMPLETED, IN_PROGRESS, PENDING, DELAYED
    delay_days = Column(Integer, default=0)
    remarks = Column(Text, nullable=True)

class CompensationRecord(Base):
    __tablename__ = "compensation_records"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    parcel_id = Column(String, index=True)
    beneficiary_name = Column(String)
    bank_account_masked = Column(String)
    assessed_inr = Column(Float)
    approved_inr = Column(Float)
    disbursed_inr = Column(Float)
    status = Column(String, default="Pending")  # Paid, Pending, Verification, Disputed
    pfms_ref = Column(String, nullable=True)
    disbursed_date = Column(String, nullable=True)

class RRRecord(Base):
    __tablename__ = "rr_records"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    family_id = Column(String, index=True)
    head_of_family = Column(String)
    is_displaced = Column(Boolean, default=False)
    housing_allotment = Column(String, default="Pending")  # Allotted, In Construction, Pending
    livelihood_grant_status = Column(String, default="Pending")  # Disbursed, Approved, Pending
    status = Column(String, default="IN_PROGRESS")  # COMPLETED, IN_PROGRESS, PENDING

class LegalCase(Base):
    __tablename__ = "legal_cases"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    parcel_id = Column(String, index=True)
    claimant_name = Column(String)
    case_type = Column(String)  # Compensation Rate Dispute, Ownership Conflict, Common Land
    filed_date = Column(String)
    court_forum = Column(String)  # District Collectorate, High Court, Land Tribunal
    current_status = Column(String, default="Open")  # Open, Under Review, Resolved, Escalated
    next_hearing_date = Column(String)
    responsible_officer = Column(String)
    risk_impact = Column(String, default="High")

class DocumentRecord(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    document_type = Column(String)  # DPR, Land Schedule, Survey Map, Notification, Award, R&R Plan
    file_name = Column(String)
    storage_path = Column(String)
    version = Column(String, default="v1")
    uploaded_by = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    checksum = Column(String)
    status = Column(String, default="Verified")

class RiskAlert(Base):
    __tablename__ = "risk_alerts"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    title = Column(String)
    severity = Column(String)  # CRITICAL, HIGH, MEDIUM, LOW
    message = Column(Text)
    delay_days = Column(Integer, default=0)
    status = Column(String, default="ACTIVE")  # ACTIVE, ACKNOWLEDGED, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user = Column(String)
    role = Column(String)
    action = Column(String)
    entity = Column(String)
    entity_id = Column(String)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class InspectionTask(Base):
    __tablename__ = "inspection_tasks"

    id = Column(String, primary_key=True)
    task_code = Column(String, unique=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True)
    khasra_number = Column(String, index=True)
    village = Column(String)
    district = Column(String)
    area_ha = Column(Float)
    officer_id = Column(String, index=True)
    assigned_date = Column(String)
    due_date = Column(String)
    completed_date = Column(String, nullable=True)
    priority = Column(String, default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    reason = Column(String)
    status = Column(String, default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED, OVERDUE
    created_at = Column(DateTime, default=datetime.utcnow)

class FieldInspection(Base):
    __tablename__ = "field_inspections"

    id = Column(String, primary_key=True)
    inspection_code = Column(String, unique=True, index=True)
    task_id = Column(String, ForeignKey("inspection_tasks.id"), index=True, nullable=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True)
    officer_id = Column(String, index=True)
    officer_name = Column(String)
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    
    # GPS Verification
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    gps_accuracy = Column(Float, nullable=True)
    gps_verified = Column(Boolean, default=False)
    gps_mode = Column(String, default="REAL")  # REAL, DEMO_SIMULATED
    distance_from_parcel_m = Column(Float, nullable=True)
    location_matched = Column(Boolean, default=False)

    # Khasra Verification
    khasra_expected = Column(String)
    khasra_observed = Column(String, nullable=True)
    khasra_matched = Column(Boolean, default=True)

    # Boundary Verification
    boundary_status = Column(String, default="Matched")  # Matched, Mismatch, Uncertain
    boundary_remarks = Column(Text, nullable=True)

    # Land & Structure
    land_use = Column(String, default="Agricultural")
    land_use_recorded = Column(String, default="Agricultural")
    land_use_observed = Column(String, default="Agricultural")
    land_use_matched = Column(Boolean, default=True)
    land_condition = Column(String, default="Good")  # Good, Moderate, Poor
    crop_type = Column(String, nullable=True)
    structure_present = Column(String, default="No")  # No, Yes
    structure_type = Column(String, nullable=True)
    structure_count = Column(Integer, default=0)
    encroachment_status = Column(String, default="No")  # No, Yes, Uncertain
    encroachment_type = Column(String, nullable=True)
    encroachment_severity = Column(String, nullable=True)
    encroachment_description = Column(Text, nullable=True)

    # Occupancy & Compensation & Dispute & R&R
    occupancy_status = Column(String, default="Owner Present")  # Verified, Not Verified, Disputed
    occupant_name = Column(String, nullable=True)
    occupant_type = Column(String, default="Owner")  # Owner, Cultivator, Tenant, Other
    occupant_relation = Column(String, nullable=True)
    compensation_status = Column(String, default="Pending")
    compensation_confirmed = Column(String, default="Yes")  # Yes, No, Not Available
    compensation_issue = Column(String, nullable=True)
    compensation_remarks = Column(Text, nullable=True)
    objection_status = Column(String, default="No")  # No, Yes
    dispute_type = Column(String, nullable=True)
    dispute_severity = Column(String, nullable=True)
    dispute_description = Column(Text, nullable=True)
    rr_status = Column(String, default="Pending")  # Completed, In Progress, Pending, Issue Reported
    rr_required = Column(String, default="Yes")
    rr_verified = Column(String, default="Yes")
    rr_issue = Column(String, nullable=True)
    
    # Checklist & Remarks
    checklist_data = Column(JSON, nullable=True)
    remarks = Column(Text, nullable=True)
    officer_confirmed = Column(Boolean, default=False)
    status = Column(String, default="Submitted for Review")  # Submitted for Review, Approved, Needs Clarification
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class InspectionPhoto(Base):
    __tablename__ = "inspection_photos"

    id = Column(String, primary_key=True)
    inspection_id = Column(String, ForeignKey("field_inspections.id"), index=True)
    parcel_id = Column(String, index=True)
    project_id = Column(String, index=True)
    category = Column(String)  # Parcel Boundary, Survey/Khasra Marker, Crop/Land Condition, Structure, Encroachment, Owner/Occupancy Evidence, Other
    file_url = Column(String)
    file_name = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    timestamp = Column(String)
    uploaded_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class InspectionIssue(Base):
    __tablename__ = "inspection_issues"

    id = Column(String, primary_key=True)
    inspection_id = Column(String, ForeignKey("field_inspections.id"), index=True)
    project_id = Column(String, index=True)
    parcel_id = Column(String, index=True)
    issue_type = Column(String)  # Boundary mismatch, Survey number mismatch, Encroachment, Owner dispute, Compensation issue, Access issue, Land-use mismatch, Document mismatch, Legal issue, Other
    severity = Column(String, default="High")  # Low, Medium, High, Critical
    description = Column(Text)
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class FieldGPSLog(Base):
    __tablename__ = "field_gps_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    officer_id = Column(String, index=True)
    inspection_id = Column(String, nullable=True)
    latitude = Column(Float)
    longitude = Column(Float)
    accuracy_m = Column(Float)
    is_simulated = Column(Boolean, default=False)
    logged_at = Column(DateTime, default=datetime.utcnow)

