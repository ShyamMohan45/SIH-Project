from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel

class RiskPredictRequest(BaseModel):
    project_id: Optional[str] = None
    parcel_id: Optional[str] = None
    land_area: Optional[float] = 100.0
    parcel_count: Optional[int] = 50
    affected_families: Optional[int] = 200
    legal_dispute_count: Optional[int] = 2
    dispute_ratio: Optional[float] = 0.04
    approval_delay: Optional[int] = 15
    notification_delay: Optional[int] = 20
    compensation_completion: Optional[float] = 65.0
    rr_completion: Optional[float] = 50.0
    possession_completion: Optional[float] = 40.0
    pending_documents: Optional[int] = 3
    stakeholder_response_time: Optional[int] = 12
    current_stage: Optional[str] = "Award"
    documentation_score: Optional[float] = 85.0
    # Field inspection ground features
    field_verification_completed: Optional[bool] = False
    gps_verified: Optional[bool] = True
    boundary_mismatch: Optional[bool] = False
    khasra_mismatch: Optional[bool] = False
    encroachment_detected: Optional[bool] = False
    owner_dispute: Optional[bool] = False
    compensation_issue: Optional[bool] = False
    legal_issue: Optional[bool] = False
    land_use_mismatch: Optional[bool] = False
    rr_issue: Optional[bool] = False
    inspection_delay: Optional[int] = 0

class RiskExplanationOut(BaseModel):
    feature: str
    importance: float
    contribution: float
    description: str

class RiskPredictResponse(BaseModel):
    prediction: str  # DELAYED / ON_TRACK
    risk_probability: float
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    model_version: str = "2.0.0-rf-synthetic"
    top_factors: List[RiskExplanationOut] = []
    created_at: datetime
