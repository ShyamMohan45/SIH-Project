from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class DashboardSummaryOut(BaseModel):
    # Prompt section 43 schema
    active_projects: int
    total_land_required: float
    total_land_acquired: float
    acquisition_progress: float
    affected_families: int
    pending_compensation: int
    pending_rr: int
    legal_cases: int
    high_risk_projects: int
    overdue_activities: int
    risk_distribution: Dict[str, int]
    recent_alerts: List[Dict[str, Any]]
    recent_field_inspections: List[Dict[str, Any]]
    projects_needing_attention: List[Dict[str, Any]]

    # Frontend UI compatibility aliases
    kpis: Optional[Dict[str, Any]] = None
    live_alerts: Optional[List[Dict[str, Any]]] = None
    recent_field_activity: Optional[List[Dict[str, Any]]] = None

    class Config:
        extra = "allow"
