from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import require_central_admin
from app.db.models.project import Project
from app.db.models.parcel import Parcel
from app.db.models.legal import LegalCase
from app.db.models.alert import RiskAlert
from app.db.models.inspection import FieldInspection, InspectionTask
from app.db.models.audit import AuditLog
from app.db.models.notice import PublicNotice
from app.services.audit_service import log_action

router = APIRouter(prefix="/admin/central", tags=["Central Administration (National Control Room)"])

@router.get("/profile")
def get_central_profile(current_user = Depends(require_central_admin)):
    return {
        "name": current_user.name or "National Land Acquisition Administrator",
        "designation": "Central Administrator & Competent Authority",
        "department": "Department of Land Resources (DoLR)",
        "organization": "Ministry of Rural Development, Government of India",
        "email": current_user.email,
        "office": "Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001",
        "jurisdiction": "All India (National Level)",
        "role": "CENTRAL_ADMIN",
        "account_status": "Active",
        "officer_id": current_user.officer_id or "ADM-001",
        "last_login": "2026-03-12 18:45 UTC"
    }

@router.get("/dashboard")
def get_central_dashboard(
    current_user = Depends(require_central_admin),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).all()
    total_req = sum(p.land_required for p in projects)
    total_acq = sum(p.land_acquired for p in projects)
    progress = round((total_acq / max(total_req, 1.0)) * 100.0, 1)
    states = list(set(p.state for p in projects))
    districts = list(set(p.district for p in projects))

    high_risk_projects = sum(1 for p in projects if (p.risk_level or "").upper() == "HIGH")
    critical_projects = sum(1 for p in projects if (p.risk_level or "").upper() == "CRITICAL")
    legal_count = db.query(LegalCase).count()
    overdue_tasks = db.query(InspectionTask).filter(InspectionTask.status == "OVERDUE").count()
    pending_inspections = db.query(InspectionTask).filter(InspectionTask.status.in_(["PENDING", "IN_PROGRESS"])).count()
    pending_comp = db.query(Parcel).filter(Parcel.compensation_status.in_(["PENDING", "DISPUTED"])).count()
    pending_rr = db.query(Parcel).filter(Parcel.possession_status == "PENDING").count()

    # Build states_summary
    states_summary = []
    state_map_dash = {}
    for p in projects:
        st = p.state
        if st not in state_map_dash:
            state_map_dash[st] = {"state": st, "projects_count": 0, "land_required_ha": 0.0, "land_acquired_ha": 0.0}
        state_map_dash[st]["projects_count"] += 1
        state_map_dash[st]["land_required_ha"] += p.land_required
        state_map_dash[st]["land_acquired_ha"] += p.land_acquired
    for st, sm in state_map_dash.items():
        states_summary.append({
            "state": st,
            "projects_count": sm["projects_count"],
            "land_required_ha": round(sm["land_required_ha"], 2),
            "land_acquired_ha": round(sm["land_acquired_ha"], 2),
            "progress_pct": round((sm["land_acquired_ha"] / max(sm["land_required_ha"], 1.0)) * 100.0, 1)
        })

    return {
        "portal": "N-LAMS Central Administration Control Room",
        "total_states": len(states),
        "total_districts": len(districts),
        "total_active_projects": len(projects),
        "total_land_required_ha": round(total_req, 2),
        "total_land_acquired_ha": round(total_acq, 2),
        "national_progress_pct": progress,
        "affected_families": sum(p.affected_families for p in projects),
        "pending_compensation_parcels": pending_comp,
        "pending_rr_parcels": pending_rr,
        "legal_cases": legal_count,
        "high_risk_projects": high_risk_projects,
        "critical_projects": critical_projects,
        "overdue_activities": overdue_tasks,
        "pending_field_inspections": pending_inspections,
        "states_summary": states_summary,
        "risk_summary": {
            "CRITICAL": critical_projects,
            "HIGH": high_risk_projects,
            "MEDIUM": sum(1 for p in projects if (p.risk_level or "").upper() == "MEDIUM"),
            "LOW": sum(1 for p in projects if (p.risk_level or "").upper() == "LOW")
        }
    }

@router.get("/states")
def get_central_states(
    current_user = Depends(require_central_admin),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).all()
    state_map = {}
    for p in projects:
        st = p.state
        if st not in state_map:
            state_map[st] = {
                "state": st,
                "projects_count": 0,
                "land_required_ha": 0.0,
                "land_acquired_ha": 0.0,
                "affected_families": 0,
                "districts": set(),
                "high_risk": 0,
                "critical": 0
            }
        state_map[st]["projects_count"] += 1
        state_map[st]["land_required_ha"] += p.land_required
        state_map[st]["land_acquired_ha"] += p.land_acquired
        state_map[st]["affected_families"] += p.affected_families
        state_map[st]["districts"].add(p.district)
        lvl = (p.risk_level or "").upper()
        if lvl == "HIGH":
            state_map[st]["high_risk"] += 1
        elif lvl == "CRITICAL":
            state_map[st]["critical"] += 1

    result = []
    for st, v in state_map.items():
        req = v["land_required_ha"]
        acq = v["land_acquired_ha"]
        pct = round((acq / max(req, 1.0)) * 100.0, 1)
        result.append({
            "state": st,
            "projects_count": v["projects_count"],
            "districts_count": len(v["districts"]),
            "land_required_ha": round(req, 2),
            "land_acquired_ha": round(acq, 2),
            "progress_pct": pct,
            "affected_families": v["affected_families"],
            "high_risk": v["high_risk"],
            "critical": v["critical"],
            "note": "DEMO / SYNTHETIC DATA"
        })
    result.sort(key=lambda x: x["projects_count"], reverse=True)
    return result

@router.get("/states/{state_name}")
def get_central_state_detail(
    state_name: str,
    current_user = Depends(require_central_admin),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(Project.state.ilike(state_name)).all()
    if not projects:
        raise HTTPException(status_code=404, detail=f"State '{state_name}' not found")

    districts = list(set(p.district for p in projects))
    req = sum(p.land_required for p in projects)
    acq = sum(p.land_acquired for p in projects)

    return {
        "state": state_name.title(),
        "state_name": state_name.title(),
        "state_officer": f"State Land Acquisition Officer ({state_name.title()})",
        "number_of_districts": len(districts),
        "number_of_projects": len(projects),
        "land_required_ha": round(req, 2),
        "land_acquired_ha": round(acq, 2),
        "acquisition_progress_pct": round((acq / max(req, 1.0)) * 100.0, 1),
        "affected_families": sum(p.affected_families for p in projects),
        "high_risk_projects": sum(1 for p in projects if (p.risk_level or "").upper() == "HIGH"),
        "critical_projects": sum(1 for p in projects if (p.risk_level or "").upper() == "CRITICAL"),
        "projects": [
            {
                "id": p.id,
                "project_code": p.project_code,
                "name": p.name,
                "district": p.district,
                "current_stage": p.current_stage,
                "risk_level": p.risk_level,
                "progress_pct": round((p.land_acquired / max(p.land_required, 1.0)) * 100.0, 1)
            } for p in projects
        ]
    }

@router.get("/audit")
def get_central_audit_logs(
    limit: int = Query(100),
    current_user = Depends(require_central_admin),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

@router.post("/publish")
def toggle_content_publication(
    entity_type: str = Body(..., embed=True),
    entity_id: str = Body(..., embed=True),
    is_public: bool = Body(..., embed=True),
    current_user = Depends(require_central_admin),
    db: Session = Depends(get_db)
):
    if entity_type.upper() == "PROJECT":
        target = db.query(Project).filter(Project.id == entity_id).first()
    elif entity_type.upper() == "NOTICE":
        target = db.query(PublicNotice).filter(PublicNotice.id == entity_id).first()
    elif entity_type.upper() == "PARCEL":
        target = db.query(Parcel).filter(Parcel.id == entity_id).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid entity_type. Must be PROJECT, NOTICE, or PARCEL.")

    if not target:
        raise HTTPException(status_code=404, detail="Entity not found")

    target.is_public = is_public
    db.commit()

    log_action(
        db, user=current_user.email, role="CENTRAL_ADMIN",
        action="UPDATE_PUBLIC_VISIBILITY", entity=entity_type.upper(),
        entity_id=entity_id, new_value=f"is_public={is_public}"
    )
    return {"success": True, "entity_type": entity_type, "entity_id": entity_id, "is_public": is_public}
