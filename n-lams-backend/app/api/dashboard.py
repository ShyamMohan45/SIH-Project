from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.project import Project
from app.db.models.parcel import Parcel
from app.db.models.legal import LegalCase
from app.db.models.alert import RiskAlert
from app.db.models.inspection import FieldInspection, InspectionTask
from app.schemas.dashboard import DashboardSummaryOut

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(
    state: Optional[str] = Query("ALL"),
    district: Optional[str] = Query("ALL"),
    db: Session = Depends(get_db)
):
    p_query = db.query(Project)
    if state and state != "ALL":
        p_query = p_query.filter(Project.state == state)
    if district and district != "ALL":
        p_query = p_query.filter(Project.district == district)
    projects = p_query.all()

    active_projects = len(projects)
    total_req = sum(p.land_required for p in projects)
    total_acq = sum(p.land_acquired for p in projects)
    progress = round((total_acq / max(total_req, 1.0)) * 100.0, 1)
    affected = sum(p.affected_families for p in projects)
    displaced = sum(p.displaced_families for p in projects)

    # Risk distribution
    risk_dist = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    high_risk_count = 0
    for p in projects:
        lvl = (p.risk_level or "LOW").upper()
        risk_dist[lvl] = risk_dist.get(lvl, 0) + 1
        if lvl in ("HIGH", "CRITICAL"):
            high_risk_count += 1

    # Counts
    legal_count = db.query(LegalCase).count()
    overdue_tasks = db.query(InspectionTask).filter(InspectionTask.status == "OVERDUE").count()
    pending_comp = db.query(Parcel).filter(Parcel.compensation_status == "PENDING").count()
    pending_rr = db.query(Parcel).filter(Parcel.possession_status == "PENDING").count()

    # Alerts
    alerts = db.query(RiskAlert).order_by(RiskAlert.created_at.desc()).limit(5).all()
    recent_alerts = [
        {
            "id": a.id,
            "project_id": a.project_id,
            "title": a.title,
            "message": a.message,
            "severity": a.severity,
            "delay_days": a.delay_days,
            "status": a.status,
            "created_at": a.created_at.strftime("%Y-%m-%d %H:%M") if a.created_at else "2026-03-12"
        } for a in alerts
    ]

    # Recent inspections
    inspections = db.query(FieldInspection).order_by(FieldInspection.started_at.desc()).limit(5).all()
    recent_inspections = [
        {
            "id": i.id,
            "inspection_code": i.inspection_code,
            "project_id": i.project_id,
            "parcel_id": i.parcel_id,
            "officer_id": i.officer_id,
            "officer_name": i.officer_name or i.officer_id,
            "status": i.status,
            "gps_verified": i.gps_verified,
            "boundary_status": i.boundary_status,
            "timestamp": i.started_at.strftime("%Y-%m-%d %H:%M") if i.started_at else "2026-03-12"
        } for i in inspections
    ]

    # Projects needing attention
    attention = [
        {
            "id": p.id,
            "project_code": p.project_code,
            "name": p.name,
            "state": p.state,
            "district": p.district,
            "risk_level": p.risk_level,
            "risk_score": p.risk_score,
            "current_stage": p.current_stage
        } for p in projects if (p.risk_level or "").upper() in ("HIGH", "CRITICAL")
    ]

    kpis_data = {
        "total_projects": active_projects,
        "land_required_ha": round(total_req, 2),
        "land_acquired_ha": round(total_acq, 2),
        "acquisition_pct": progress,
        "affected_families": affected,
        "displaced_families": displaced,
        "pending_compensation_cr": round(pending_comp * 12.5, 1),
        "pending_rr_families": pending_rr,
        "legal_cases": legal_count,
        "high_risk_projects": high_risk_count,
        "overdue_activities": overdue_tasks
    }

    return {
        # Section 43 exact schema:
        "active_projects": active_projects,
        "total_land_required": round(total_req, 2),
        "total_land_acquired": round(total_acq, 2),
        "acquisition_progress": progress,
        "affected_families": affected,
        "pending_compensation": pending_comp,
        "pending_rr": pending_rr,
        "legal_cases": legal_count,
        "high_risk_projects": high_risk_count,
        "overdue_activities": overdue_tasks,
        "risk_distribution": risk_dist,
        "recent_alerts": recent_alerts,
        "recent_field_inspections": recent_inspections,
        "projects_needing_attention": attention,
        # Frontend UI aliases:
        "kpis": kpis_data,
        "live_alerts": recent_alerts,
        "recent_field_activity": recent_inspections
    }
