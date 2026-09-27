from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class TaskOut(BaseModel):
    id: str
    inspection_code: str
    project_id: str
    parcel_id: str
    khasra_number: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    area_ha: float = 0.0
    assigned_officer_id: str
    priority: str = "HIGH"
    reason: Optional[str] = None
    assigned_date: Optional[str] = None
    due_date: Optional[str] = None
    completed_date: Optional[str] = None
    status: str = "PENDING"

    class Config:
        from_attributes = True

class InspectionStartRequest(BaseModel):
    task_id: Optional[str] = None
    project_id: str
    parcel_id: str
    officer_id: str
    officer_name: Optional[str] = None

class GPSRequest(BaseModel):
    inspection_id: str
    officer_id: str
    latitude: float
    longitude: float
    accuracy: Optional[float] = 5.0
    is_demo: Optional[bool] = False

class ChecklistRequest(BaseModel):
    inspection_id: str
    boundary_visible: bool = True
    survey_marker_available: bool = True
    land_use_verified: bool = True
    area_consistent: bool = True
    notice_received: bool = True
    owner_verified: bool = True
    compensation_discussed: bool = True
    possession_checked: bool = True
    affected_family_verified: bool = True
    rr_checked: bool = True
    survey_number_checked: bool = True
    field_evidence_captured: bool = True

class IssueCreateRequest(BaseModel):
    inspection_id: str
    issue_type: str
    severity: str = "HIGH"
    description: str

class InspectionSubmitRequest(BaseModel):
    inspection_id: str
    task_id: Optional[str] = None
    project_id: str
    parcel_id: str
    officer_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    gps_accuracy: Optional[float] = 5.0
    khasra_expected: Optional[str] = None
    khasra_observed: Optional[str] = None
    boundary_status: Optional[str] = "MATCH"
    land_use_recorded: Optional[str] = "Agricultural"
    land_use_observed: Optional[str] = "Agricultural"
    crop_type: Optional[str] = None
    structure_present: Optional[bool] = False
    structure_type: Optional[str] = None
    structure_count: Optional[int] = 0
    encroachment_status: Optional[str] = "NO"
    occupancy_status: Optional[str] = "OWNER_CULTIVATED"
    person_present: Optional[str] = None
    compensation_status: Optional[str] = "AWAITING_AWARD"
    compensation_issue: Optional[str] = "None"
    objection_status: Optional[str] = "NONE"
    dispute_type: Optional[str] = None
    rr_required: Optional[bool] = False
    rr_status: Optional[str] = "NOT_APPLICABLE"
    rr_issue: Optional[str] = None
    remarks: Optional[str] = None
    checklist: Optional[Dict[str, bool]] = None
    issues: Optional[List[Dict[str, str]]] = None

class InspectionOut(BaseModel):
    id: str
    inspection_code: str
    task_id: Optional[str] = None
    project_id: str
    parcel_id: str
    officer_id: str
    officer_name: Optional[str] = None
    status: str
    gps_verified: bool = False
    distance_meters: float = 0.0
    khasra_matched: bool = True
    boundary_status: str
    land_use_matched: bool = True
    encroachment_status: str
    compensation_issue: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
