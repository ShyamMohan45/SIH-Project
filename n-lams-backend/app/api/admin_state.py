from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import require_state_admin, verify_state_access
from app.db.models.project import Project
from app.db.models.parcel import Parcel
from app.db.models.legal import LegalCase
from app.db.models.alert import RiskAlert
from app.db.models.inspection import FieldInspection, InspectionTask
from app.services.audit_service import log_action

router = APIRouter(prefix="/admin/state", tags=["State Administration (State Operations Room)"])

@router.get("/profile")
def get_state_profile(current_user = Depends(require_state_admin)):
    state_name = current_user.state or "Gujarat"
    return {
        "name": current_user.name or f"{state_name} State Land Acquisition Administrator",
        "designation": "State Land Acquisition Officer & SLAO Coordinator",
        "department": "Department of Revenue & Land Acquisition Administration",
        "state": state_name,
        "office": f"Sachivalaya Complex, Gandhinagar, {state_name} 382010" if state_name.lower() == "gujarat" else f"State Secretariat, {state_name}",
        "official_email": current_user.email,
        "role": "STATE_ADMIN",
        "jurisdiction": state_name,
        "account_status": "Active",
        "officer_id": current_user.officer_id or "SO-GJ-01",
        "last_login": "2026-03-12 19:10 UTC"
    }

@router.get("/dashboard")
def get_state_dashboard(
    state_name: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    current_user = Depends(require_state_admin),
    db: Session = Depends(get_db)
):
    target_state = state_name or state or current_user.state or "Gujarat"
    verify_state_access(current_user, target_state)

    projects = db.query(Project).filter(Project.state.ilike(target_state)).all()
    total_req = sum(p.land_required for p in projects)
    total_acq = sum(p.land_acquired for p in projects)
    progress = round((total_acq / max(total_req, 1.0)) * 100.0, 1)

    # Build unique districts and districts_summary
    dist_set = set()
    district_map = {}
    for p in projects:
        for d in [x.strip() for x in (p.district or "").split(",") if x.strip()]:
            dist_set.add(d)
            if d not in district_map:
                district_map[d] = {
                    "district": d,
                    "district_name": d,
                    "projects_count": 0,
                    "land_required_ha": 0.0,
                    "land_acquired_ha": 0.0
                }
            district_map[d]["projects_count"] += 1
            district_map[d]["land_required_ha"] += p.land_required
            district_map[d]["land_acquired_ha"] += p.land_acquired

    districts_summary = list(district_map.values())

    high_risk = sum(1 for p in projects if (p.risk_level or "").upper() == "HIGH")
    critical = sum(1 for p in projects if (p.risk_level or "").upper() == "CRITICAL")

    proj_ids = [p.id for p in projects]
    legal_count = db.query(LegalCase).filter(LegalCase.project_id.in_(proj_ids)).count() if proj_ids else 0
    pending_tasks = db.query(InspectionTask).filter(InspectionTask.project_id.in_(proj_ids), InspectionTask.status.in_(["PENDING", "IN_PROGRESS"])).count() if proj_ids else 0
    pending_comp = db.query(Parcel).filter(Parcel.project_id.in_(proj_ids), Parcel.compensation_status == "PENDING").count() if proj_ids else 0
    pending_rr = db.query(Parcel).filter(Parcel.project_id.in_(proj_ids), Parcel.possession_status == "PENDING").count() if proj_ids else 0

    return {
        "state": target_state,
        "total_districts": len(dist_set),
        "total_projects": len(projects),
        "land_required_ha": round(total_req, 2),
        "land_acquired_ha": round(total_acq, 2),
        "progress_pct": progress,
        "affected_families": sum(p.affected_families for p in projects),
        "pending_compensation": pending_comp,
        "pending_rr": pending_rr,
        "legal_cases": legal_count,
        "high_risk_projects": high_risk,
        "critical_projects": critical,
        "overdue_activities": db.query(InspectionTask).filter(InspectionTask.project_id.in_(proj_ids), InspectionTask.status == "OVERDUE").count() if proj_ids else 0,
        "pending_field_inspections": pending_tasks,
        "districts_summary": districts_summary
    }

@router.get("/districts")
def get_state_districts(
    state_name: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    current_user = Depends(require_state_admin),
    db: Session = Depends(get_db)
):
    target_state = state_name or state or current_user.state or "Gujarat"
    verify_state_access(current_user, target_state)

    projects = db.query(Project).filter(Project.state.ilike(target_state)).all()

    district_map = {}
    for p in projects:
        for d in [x.strip() for x in (p.district or "").split(",") if x.strip()]:
            if d not in district_map:
                district_map[d] = {
                    "district": d,
                    "district_name": d,
                    "state": target_state,
                    "projects_count": 0,
                    "land_required_ha": 0.0,
                    "land_acquired_ha": 0.0,
                    "high_risk": 0,
                    "critical": 0,
                    "project_ids": []
                }
            district_map[d]["projects_count"] += 1
            district_map[d]["land_required_ha"] += p.land_required
            district_map[d]["land_acquired_ha"] += p.land_acquired
            district_map[d]["project_ids"].append(p.id)
            if (p.risk_level or "").upper() == "HIGH":
                district_map[d]["high_risk"] += 1
            elif (p.risk_level or "").upper() == "CRITICAL":
                district_map[d]["critical"] += 1

    result = []
    for d, v in district_map.items():
        req = v["land_required_ha"]
        acq = v["land_acquired_ha"]
        pct = round((acq / max(req, 1.0)) * 100.0, 1)
        p_ids = v["project_ids"]
        leg = db.query(LegalCase).filter(LegalCase.project_id.in_(p_ids)).count() if p_ids else 0
        ins = db.query(FieldInspection).filter(FieldInspection.project_id.in_(p_ids)).count() if p_ids else 0
        comp = db.query(Parcel).filter(Parcel.project_id.in_(p_ids), Parcel.compensation_status == "PENDING").count() if p_ids else 0

        result.append({
            "district": d,
            "district_name": d,
            "state": target_state,
            "projects_count": v["projects_count"],
            "land_required_ha": round(req, 2),
            "land_acquired_ha": round(acq, 2),
            "progress_pct": pct,
            "high_risk": v["high_risk"],
            "critical": v["critical"],
            "legal_cases": leg,
            "field_inspections": ins,
            "pending_compensation": comp
        })
    return result

@router.get("/districts/{district_name}")
def get_state_district_detail(
    district_name: str,
    state_name: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    current_user = Depends(require_state_admin),
    db: Session = Depends(get_db)
):
    target_state = state_name or state or current_user.state or "Gujarat"
    verify_state_access(current_user, target_state)

    projects = db.query(Project).filter(
        Project.state.ilike(target_state),
        Project.district.ilike(f"%{district_name}%")
    ).all()
    if not projects:
        raise HTTPException(status_code=404, detail=f"District '{district_name}' in state '{target_state}' not found")

    p_ids = [p.id for p in projects]
    parcels = db.query(Parcel).filter(Parcel.project_id.in_(p_ids)).all()
    inspections = db.query(FieldInspection).filter(FieldInspection.project_id.in_(p_ids)).all()
    alerts = db.query(RiskAlert).filter(RiskAlert.project_id.in_(p_ids)).all()

    req = sum(p.land_required for p in projects)
    acq = sum(p.land_acquired for p in projects)

    return {
        "district": district_name,
        "district_name": district_name,
        "state": target_state,
        "projects_count": len(projects),
        "land_required_ha": round(req, 2),
        "land_acquired_ha": round(acq, 2),
        "progress_pct": round((acq / max(req, 1.0)) * 100.0, 1),
        "parcels_count": len(parcels),
        "field_inspections_count": len(inspections),
        "active_alerts_count": len(alerts),
        "projects": [
            {
                "id": p.id,
                "project_code": p.project_code,
                "name": p.name,
                "current_stage": p.current_stage,
                "risk_level": p.risk_level,
                "progress_pct": round((p.land_acquired / max(p.land_required, 1.0)) * 100.0, 1)
            } for p in projects
        ]
    }

@router.get("/projects")
def get_state_projects(
    state_name: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    current_user = Depends(require_state_admin),
    db: Session = Depends(get_db)
):
    target_state = state_name or state or current_user.state or "Gujarat"
    verify_state_access(current_user, target_state)

    q = db.query(Project).filter(Project.state.ilike(target_state))
    if district and district.upper() != "ALL":
        q = q.filter(Project.district.ilike(f"%{district}%"))

    projects = q.all()
    return [
        {
            "id": p.id,
            "project_code": p.project_code,
            "name": p.name,
            "district": p.district,
            "state": p.state,
            "land_required_ha": p.land_required,
            "land_acquired_ha": p.land_acquired,
            "progress_pct": round((p.land_acquired / max(p.land_required, 1.0)) * 100.0, 1),
            "current_stage": p.current_stage,
            "risk_level": p.risk_level,
            "risk_score": p.risk_score,
            "status": p.status
        } for p in projects
    ]

@router.get("/inspections")
def get_state_inspections(
    state_name: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    current_user = Depends(require_state_admin),
    db: Session = Depends(get_db)
):
    target_state = state_name or state or current_user.state or "Gujarat"
    verify_state_access(current_user, target_state)

    proj_ids = [p.id for p in db.query(Project.id).filter(Project.state.ilike(target_state)).all()]
    if not proj_ids:
        return []
    return db.query(FieldInspection).filter(FieldInspection.project_id.in_(proj_ids)).order_by(FieldInspection.started_at.desc()).all()

@router.get("/alerts")
def get_state_alerts(
    state_name: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    current_user = Depends(require_state_admin),
    db: Session = Depends(get_db)
):
    target_state = state_name or state or current_user.state or "Gujarat"
    verify_state_access(current_user, target_state)

    proj_ids = [p.id for p in db.query(Project.id).filter(Project.state.ilike(target_state)).all()]
    if not proj_ids:
        return []
    return db.query(RiskAlert).filter(RiskAlert.project_id.in_(proj_ids)).order_by(RiskAlert.created_at.desc()).all()
