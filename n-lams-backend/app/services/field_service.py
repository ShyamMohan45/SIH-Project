import os
import uuid
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.db.models.inspection import (
    InspectionTask, FieldInspection, InspectionPhoto, 
    InspectionIssue, FieldGPSLog, InspectionChecklist
)
from app.db.models.parcel import Parcel
from app.db.models.project import Project
from app.services.audit_service import log_action
from app.services.alert_service import create_alert
from app.services.recommendation_service import create_recommendation
from app.services.risk_service import calculate_and_save_project_risk
from app.utils.geo_utils import verify_point_in_or_near_polygon

def start_inspection(
    db: Session,
    project_id: str,
    parcel_id: str,
    officer_id: str,
    officer_name: Optional[str] = None,
    task_id: Optional[str] = None
) -> FieldInspection:
    insp_code = f"INS-{uuid.uuid4().hex[:6].upper()}"
    inspection = FieldInspection(
        id=f"INSP-{uuid.uuid4().hex[:8].upper()}",
        inspection_code=insp_code,
        task_id=task_id,
        project_id=project_id,
        parcel_id=parcel_id,
        officer_id=officer_id,
        officer_name=officer_name or officer_id,
        started_at=datetime.utcnow(),
        status="IN_PROGRESS"
    )
    db.add(inspection)

    if task_id:
        task = db.query(InspectionTask).filter(InspectionTask.id == task_id).first()
        if task:
            task.status = "IN_PROGRESS"

    db.commit()
    db.refresh(inspection)

    log_action(
        db, user=officer_id, role="FIELD_OFFICER", action="START_INSPECTION",
        entity="FIELD_INSPECTION", entity_id=inspection.id, new_value=insp_code
    )
    return inspection

def log_gps(
    db: Session,
    inspection_id: str,
    officer_id: str,
    latitude: float,
    longitude: float,
    accuracy: float = 5.0,
    is_demo: bool = False
) -> Dict[str, Any]:
    inspection = db.query(FieldInspection).filter(FieldInspection.id == inspection_id).first()
    if not inspection:
        raise ValueError("Inspection not found")

    parcel = db.query(Parcel).filter(Parcel.id == inspection.parcel_id).first()
    dist = 0.0
    if parcel and parcel.geometry:
        try:
            from sqlalchemy import text
            geom_str = json.dumps(parcel.geometry) if isinstance(parcel.geometry, dict) else str(parcel.geometry)
            res = db.execute(
                text("SELECT ST_Distance_Parcel(:geom, :lat, :lon)"),
                {"geom": geom_str, "lat": latitude, "lon": longitude}
            ).scalar()
            if res is not None:
                dist = round(float(res), 2)
            else:
                _, dist = verify_point_in_or_near_polygon(latitude, longitude, parcel.geometry)
        except Exception:
            _, dist = verify_point_in_or_near_polygon(latitude, longitude, parcel.geometry)

    # Threshold verification: <= 50m tolerance for GPS drift
    verified = bool(dist <= 50.0)
    status_label = "GPS VERIFIED" if verified else "GPS OUTSIDE ASSIGNED PARCEL"

    gps_log = FieldGPSLog(
        id=f"GPS-{uuid.uuid4().hex[:8].upper()}",
        inspection_id=inspection_id,
        officer_id=officer_id,
        parcel_id=inspection.parcel_id,
        latitude=latitude,
        longitude=longitude,
        accuracy=accuracy,
        distance_meters=dist,
        gps_verified=verified,
        is_demo=is_demo,
        timestamp=datetime.utcnow()
    )
    db.add(gps_log)

    inspection.latitude = latitude
    inspection.longitude = longitude
    inspection.gps_accuracy = accuracy
    inspection.gps_verified = verified
    inspection.distance_meters = dist
    db.commit()

    return {
        "gps_verified": verified,
        "distance_meters": dist,
        "gps_accuracy": accuracy,
        "accuracy": accuracy,
        "status": status_label,
        "is_demo": is_demo,
        "demo_label": "DEMO / SIMULATED LOCATION" if is_demo else None,
        "assigned_parcel_id": inspection.parcel_id,
        "assigned_khasra": parcel.survey_number if parcel else None
    }

def process_complete_inspection_submission(
    db: Session,
    submission_data: Dict[str, Any]
) -> Dict[str, Any]:
    inspection_id = submission_data["inspection_id"]
    inspection = db.query(FieldInspection).filter(FieldInspection.id == inspection_id).first()
    if not inspection:
        raise ValueError("Inspection not found")

    project_id = submission_data.get("project_id") or inspection.project_id
    parcel_id = submission_data.get("parcel_id") or inspection.parcel_id
    officer_id = submission_data.get("officer_id") or inspection.officer_id

    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    expected_khasra = parcel.survey_number if parcel else "1042"
    observed_khasra = submission_data.get("khasra_observed") or expected_khasra

    khasra_matched = (str(expected_khasra).strip() == str(observed_khasra).strip())
    boundary_status = submission_data.get("boundary_status", "MATCH").upper()
    encroachment_status = submission_data.get("encroachment_status", "NO").upper()
    dispute_type = submission_data.get("dispute_type", "NONE")
    comp_issue = submission_data.get("compensation_issue", "None")

    # Update inspection fields
    inspection.submitted_at = datetime.utcnow()
    inspection.status = "SUBMITTED"
    inspection.khasra_expected = expected_khasra
    inspection.khasra_observed = observed_khasra
    inspection.khasra_matched = khasra_matched
    inspection.boundary_status = boundary_status
    inspection.land_use_recorded = submission_data.get("land_use_recorded", "Agricultural")
    inspection.land_use_observed = submission_data.get("land_use_observed", "Agricultural")
    inspection.land_use_matched = (inspection.land_use_recorded == inspection.land_use_observed)
    inspection.crop_type = submission_data.get("crop_type")
    inspection.structure_present = bool(submission_data.get("structure_present", False))
    inspection.structure_type = submission_data.get("structure_type")
    inspection.structure_count = int(submission_data.get("structure_count", 0))
    inspection.encroachment_status = encroachment_status
    inspection.occupancy_status = submission_data.get("occupancy_status", "OWNER_CULTIVATED")
    inspection.compensation_status = submission_data.get("compensation_status", "AWAITING_AWARD")
    inspection.compensation_issue = comp_issue
    inspection.objection_status = submission_data.get("objection_status", "NONE")
    inspection.dispute_type = dispute_type
    inspection.rr_required = bool(submission_data.get("rr_required", False))
    inspection.rr_issue = submission_data.get("rr_issue")
    inspection.remarks = submission_data.get("remarks")

    # 1. Checklist
    checklist_data = submission_data.get("checklist") or {}
    checklist = InspectionChecklist(
        id=f"CHK-{uuid.uuid4().hex[:8].upper()}",
        inspection_id=inspection.id,
        boundary_visible=checklist_data.get("boundary_visible", True),
        survey_marker_available=checklist_data.get("survey_marker_available", True),
        land_use_verified=checklist_data.get("land_use_verified", True),
        area_consistent=checklist_data.get("area_consistent", True),
        notice_received=checklist_data.get("notice_received", True),
        owner_verified=checklist_data.get("owner_verified", True),
        compensation_discussed=checklist_data.get("compensation_discussed", True),
        possession_checked=checklist_data.get("possession_checked", True),
        affected_family_verified=checklist_data.get("affected_family_verified", True),
        rr_checked=checklist_data.get("rr_checked", True),
        survey_number_checked=checklist_data.get("survey_number_checked", True),
        field_evidence_captured=checklist_data.get("field_evidence_captured", True)
    )
    db.add(checklist)

    # 2. Issues Engine - auto generate flagged issues
    detected_issues = []
    if not khasra_matched:
        detected_issues.append(("KHASRA_MISMATCH", "HIGH", f"Khasra mismatch detected: expected {expected_khasra}, observed {observed_khasra}."))
    if boundary_status in ("MISMATCH", "NO"):
        detected_issues.append(("BOUNDARY_MISMATCH", "HIGH", f"Boundary mismatch reported on parcel {expected_khasra}. Cadastral realignment required."))
    if encroachment_status == "YES":
        detected_issues.append(("ENCROACHMENT", "HIGH", f"Unauthorized structure/encroachment detected on parcel {expected_khasra}."))
    if dispute_type and dispute_type not in ("NONE", "None", ""):
        detected_issues.append(("OWNER_DISPUTE", "HIGH", f"Dispute flagged by occupant: {dispute_type}."))
    if not inspection.land_use_matched:
        detected_issues.append(("LAND_USE_MISMATCH", "HIGH", f"Land use mismatch: recorded as {inspection.land_use_recorded}, observed as {inspection.land_use_observed}."))
    if comp_issue and comp_issue not in ("None", "No issue", "NONE", ""):
        detected_issues.append(("COMPENSATION_ISSUE", "HIGH", f"Compensation issue raised: {comp_issue}."))
    if inspection.objection_status and str(inspection.objection_status).upper() in ("OBJECTION_FILED", "LEGAL_NOTICE", "DISPUTED", "HIGH_COURT_STAY", "YES"):
        detected_issues.append(("LEGAL_ISSUE", "HIGH", f"Legal objection filed: {inspection.objection_status}."))
    if inspection.rr_issue and str(inspection.rr_issue).strip() not in ("None", "NONE", ""):
        detected_issues.append(("RR_ISSUE", "HIGH", f"R&R issue detected: {inspection.rr_issue}."))

    created_issue_objects = []
    for itype, isev, idesc in detected_issues:
        iss = InspectionIssue(
            id=f"ISS-{uuid.uuid4().hex[:8].upper()}",
            inspection_id=inspection.id,
            project_id=project_id,
            parcel_id=parcel_id,
            issue_type=itype,
            severity=isev,
            description=idesc,
            status="OPEN"
        )
        db.add(iss)
        created_issue_objects.append(iss)

    # Also add manually submitted issues if any
    for mi in submission_data.get("issues") or []:
        raw_type = mi.get("issue_type", "OTHER")
        norm_type = str(raw_type).strip().upper().replace(" ", "_").replace("-", "_")
        iss = InspectionIssue(
            id=f"ISS-{uuid.uuid4().hex[:8].upper()}",
            inspection_id=inspection.id,
            project_id=project_id,
            parcel_id=parcel_id,
            issue_type=norm_type,
            severity=mi.get("severity", "HIGH"),
            description=mi.get("description", "Field issue reported"),
            status="OPEN"
        )
        db.add(iss)
        created_issue_objects.append(iss)

    # 3. Update Parcel status
    if parcel:
        parcel.field_verification_status = "MISMATCH" if created_issue_objects else "VERIFIED"
        if comp_issue and comp_issue not in ("None", "No issue", "NONE", ""):
            parcel.compensation_status = "DISPUTED"
        if dispute_type and dispute_type not in ("NONE", "None", ""):
            parcel.legal_status = "DISPUTED"

    # 4. Update Inspection Task
    task_id = submission_data.get("task_id") or inspection.task_id
    if task_id:
        task = db.query(InspectionTask).filter(InspectionTask.id == task_id).first()
        if task:
            task.status = "COMPLETED"
            task.completed_date = datetime.utcnow().strftime("%Y-%m-%d")

    # 5. Audit Log
    log_action(
        db, user=officer_id, role="FIELD_OFFICER", action="SUBMIT_INSPECTION",
        entity="FIELD_INSPECTION", entity_id=inspection.id,
        new_value=f"Status: SUBMITTED, Issues flagged: {len(created_issue_objects)}"
    )

    # 6. Recalculate AI Risk (Closed-Loop)
    field_risk_inputs = {
        "field_verification_completed": True,
        "gps_verified": inspection.gps_verified,
        "boundary_mismatch": (boundary_status in ("MISMATCH", "NO")),
        "khasra_mismatch": (not khasra_matched),
        "encroachment_detected": (encroachment_status == "YES"),
        "owner_dispute": bool(dispute_type and dispute_type not in ("NONE", "None", "")),
        "compensation_issue": bool(comp_issue and comp_issue not in ("None", "No issue", "NONE", "")),
        "legal_issue": (parcel.legal_status != "CLEAR" if parcel else False),
        "land_use_mismatch": (not inspection.land_use_matched),
        "rr_issue": bool(inspection.rr_issue)
    }

    risk_result = calculate_and_save_project_risk(
        db, project_id=project_id, parcel_id=parcel_id,
        field_override_features=field_risk_inputs
    )

    # Update parcel risk level
    if parcel:
        parcel.risk_level = risk_result.get("risk_level", "HIGH" if detected_issues else "LOW")

    # 7. Alert Engine
    alerts_created = []
    if detected_issues:
        top_issue_desc = detected_issues[0][2]
        alert = create_alert(
            db, project_id=project_id,
            title=f"HIGH PRIORITY FIELD ISSUE - Khasra {expected_khasra}",
            message=f"{top_issue_desc} Reported by Field Officer {officer_id}.",
            severity="HIGH",
            parcel_id=parcel_id,
            inspection_id=inspection.id
        )
        alerts_created.append(alert.id)

    # 8. Recommendation Engine
    if not khasra_matched or boundary_status in ("MISMATCH", "NO"):
        create_recommendation(
            db, project_id=project_id, parcel_id=parcel_id,
            recommendation=f"Initiate Joint Cadastral GIS Demarcation for Parcel {expected_khasra}",
            reason="Ground inspection identified physical boundary discrepancy with revenue map.",
            priority="CRITICAL"
        )
    if comp_issue and comp_issue not in ("None", "No issue", "NONE", ""):
        create_recommendation(
            db, project_id=project_id, parcel_id=parcel_id,
            recommendation=f"Prioritize SLAO Compensation Hearing for Parcel {expected_khasra}",
            reason=f"Field verification recorded owner grievance: {comp_issue}",
            priority="HIGH"
        )
    if dispute_type and dispute_type not in ("NONE", "None", ""):
        create_recommendation(
            db, project_id=project_id, parcel_id=parcel_id,
            recommendation=f"Assign Legal Cell Review for Ownership Claim on Parcel {expected_khasra}",
            reason=f"Ground dispute flagged: {dispute_type}",
            priority="HIGH"
        )

    db.commit()

    return {
        "inspection_id": inspection.id,
        "inspection_code": inspection.inspection_code,
        "status": inspection.status,
        "risk_level": risk_result.get("risk_level", "HIGH"),
        "risk_probability": risk_result.get("risk_probability", 0.85),
        "alerts_created": alerts_created,
        "issues_flagged": len(created_issue_objects)
    }
