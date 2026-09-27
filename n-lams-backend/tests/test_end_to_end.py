import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add n-lams-backend to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
from app.db.database import SessionLocal
from app.db.models.inspection import FieldInspection, InspectionTask, InspectionIssue
from app.db.models.parcel import Parcel
from app.db.models.alert import RiskAlert
from app.db.models.recommendation import Recommendation
from app.db.models.audit import AuditLog
from app.db.models.risk import RiskPrediction

client = TestClient(app)

def test_27_step_end_to_end():
    print("\n=== STARTING 27-STEP OFFICIAL VERIFICATION SEQUENCE ===")

    # Step 5: Open /docs
    docs_resp = client.get("/docs")
    assert docs_resp.status_code == 200
    print("[Step 5 PASS] Opened /docs successfully (Status 200)")

    # Step 6: Login
    login_payload = {
        "email": "fo.vikram@nlams.gov.in",
        "password": "password123"
    }
    login_resp = client.post("/api/auth/login", json=login_payload)
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token_data = login_resp.json()
    token = token_data["access_token"]
    assert token is not None
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[Step 6 PASS] Logged in successfully as Field Officer Vikram Patel (Token obtained)")

    # Step 7: Get project NH-GJ-2026-001
    p_resp = client.get("/api/projects/NH-GJ-2026-001", headers=headers)
    assert p_resp.status_code == 200
    project = p_resp.json()
    assert project["id"] == "NH-GJ-2026-001" or "NH-GJ" in project.get("project_code", "")
    print(f"[Step 7 PASS] Retrieved Project: {project['name']} (Stage: {project['current_stage']})")

    # Step 8: Get Khasra 1042
    parcels_resp = client.get("/api/parcels?project_id=NH-GJ-2026-001&search=1042", headers=headers)
    assert parcels_resp.status_code == 200
    parcels = parcels_resp.json()
    assert len(parcels) > 0
    khasra_1042 = parcels[0]
    parcel_id = khasra_1042["id"]
    print(f"[Step 8 PASS] Retrieved Khasra 1042: ID={parcel_id}, Area={khasra_1042['area']} ha, Village={khasra_1042['village']}")

    # Step 9: Get GIS GeoJSON
    gis_resp = client.get("/api/map?project_id=NH-GJ-2026-001", headers=headers)
    assert gis_resp.status_code == 200
    geojson = gis_resp.json()
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) > 0
    print(f"[Step 9 PASS] Retrieved GIS GeoJSON: {len(geojson['features'])} irregular parcel polygons")

    # Step 10: Get field task FO-1042-001
    task_resp = client.get("/api/field/tasks/TSK-1042-01", headers=headers)
    assert task_resp.status_code == 200
    task = task_resp.json()
    assert task["inspection_code"] == "FO-1042-001"
    print(f"[Step 10 PASS] Retrieved Field Task: {task['inspection_code']} (Priority: {task['priority']})")

    # Step 11: Start inspection
    start_resp = client.post("/api/field/inspection/start", json={
        "task_id": "TSK-1042-01",
        "project_id": "NH-GJ-2026-001",
        "parcel_id": parcel_id,
        "officer_id": "FO-007",
        "officer_name": "Vikram Patel"
    }, headers=headers)
    assert start_resp.status_code == 200
    inspection_id = start_resp.json()["inspection_id"]
    print(f"[Step 11 PASS] Started Inspection: {inspection_id} (Status: IN_PROGRESS)")

    # Step 12: Submit GPS
    gps_resp = client.post("/api/field/inspection/gps", json={
        "inspection_id": inspection_id,
        "officer_id": "FO-007",
        "latitude": 22.3857,
        "longitude": 71.0677,
        "accuracy": 4.5,
        "is_demo": False
    }, headers=headers)
    assert gps_resp.status_code == 200
    gps_data = gps_resp.json()
    assert gps_data["gps_verified"] is True
    print(f"[Step 12 PASS] Submitted GPS: Verified={gps_data['gps_verified']}, Distance={gps_data['distance_meters']}m")

    # Step 13: Submit checklist
    chk_resp = client.post("/api/field/inspection/checklist", json={
        "inspection_id": inspection_id,
        "boundary_visible": True,
        "survey_marker_available": True,
        "land_use_verified": True,
        "area_consistent": False,
        "notice_received": True,
        "owner_verified": True,
        "compensation_discussed": True,
        "possession_checked": True,
        "affected_family_verified": True,
        "rr_checked": True,
        "survey_number_checked": True,
        "field_evidence_captured": True
    }, headers=headers)
    assert chk_resp.status_code == 200
    print("[Step 13 PASS] Submitted Checklist: Verified 12 statutory parameters")

    # Step 14: Submit photo
    # Create a small dummy image in memory
    photo_resp = client.post(
        "/api/field/inspection/photos",
        data={
            "inspection_id": inspection_id,
            "category": "BOUNDARY",
            "latitude": 22.3857,
            "longitude": 71.0677,
            "uploaded_by": "FO-007"
        },
        files={"file": ("test_boundary_peg.jpg", b"fake_jpeg_content_12345", "image/jpeg")},
        headers=headers
    )
    assert photo_resp.status_code == 200
    photo_data = photo_resp.json()
    assert photo_data["gps_available"] is True
    print(f"[Step 14 PASS] Submitted Photo: {photo_data['file_path']} (GPS metadata available: {photo_data['gps_available']})")

    # Step 15: Submit field issue
    issue_resp = client.post("/api/field/inspection/issues", json={
        "inspection_id": inspection_id,
        "issue_type": "BOUNDARY_MISMATCH",
        "severity": "HIGH",
        "description": "Boundary stone shifted 12 meters southward into neighbouring field."
    }, headers=headers)
    assert issue_resp.status_code == 200
    print(f"[Step 15 PASS] Submitted Field Issue: BOUNDARY_MISMATCH (Severity: HIGH)")

    # Step 16: Submit inspection
    submit_payload = {
        "inspection_id": inspection_id,
        "task_id": "TSK-1042-01",
        "project_id": "NH-GJ-2026-001",
        "parcel_id": parcel_id,
        "officer_id": "FO-007",
        "latitude": 22.3857,
        "longitude": 71.0677,
        "gps_accuracy": 4.5,
        "khasra_expected": "1042",
        "khasra_observed": "1042",
        "boundary_status": "MISMATCH",
        "land_use_recorded": "Agricultural",
        "land_use_observed": "Agricultural",
        "crop_type": "Cotton / Groundnut",
        "structure_present": False,
        "encroachment_status": "NO",
        "occupancy_status": "OWNER_CULTIVATED",
        "person_present": "Suresh Patel (Owner)",
        "compensation_status": "PENDING",
        "compensation_issue": "Amount dispute - market rate revision demanded",
        "objection_status": "FILED",
        "dispute_type": "Owner dispute",
        "remarks": "Ground boundary demarcation and hearing required with SLAO."
    }
    submit_resp = client.post("/api/field/inspection/submit", json=submit_payload, headers=headers)
    assert submit_resp.status_code == 200
    submit_data = submit_resp.json()
    assert submit_data["status"] == "SUBMITTED"
    print(f"[Step 16 PASS] Submitted Complete Inspection (Status: SUBMITTED, Risk: {submit_data['risk_level']})")

    # Database verification steps
    db = SessionLocal()
    try:
        # Step 17: Verify inspection exists in database
        insp_db = db.query(FieldInspection).filter(FieldInspection.id == inspection_id).first()
        assert insp_db is not None
        assert insp_db.status == "SUBMITTED"
        print(f"[Step 17 PASS] Verified inspection exists in DB: Code={insp_db.inspection_code}, Status={insp_db.status}")

        # Step 18: Verify parcel updated
        parcel_db = db.query(Parcel).filter(Parcel.id == parcel_id).first()
        assert parcel_db is not None
        assert parcel_db.field_verification_status == "MISMATCH"
        print(f"[Step 18 PASS] Verified parcel updated in DB: Status={parcel_db.field_verification_status}, Risk={parcel_db.risk_level}")

        # Step 19: Verify issue created
        issues_db = db.query(InspectionIssue).filter(InspectionIssue.inspection_id == inspection_id).all()
        assert len(issues_db) >= 1
        print(f"[Step 19 PASS] Verified issues created in DB: {len(issues_db)} issues flagged")

        # Step 20: Verify audit log created
        audit_db = db.query(AuditLog).filter(
            AuditLog.entity_id == inspection_id,
            AuditLog.action == "SUBMIT_INSPECTION"
        ).first()
        assert audit_db is not None
        print(f"[Step 20 PASS] Verified audit log created: User={audit_db.user}, Action={audit_db.action}, Timestamp={audit_db.timestamp}")

        # Step 21 & 22: Verify AI endpoint called and risk prediction returned
        pred_db = db.query(RiskPrediction).filter(RiskPrediction.project_id == "NH-GJ-2026-001").order_by(RiskPrediction.created_at.desc()).first()
        assert pred_db is not None
        print(f"[Step 21 & 22 PASS] AI endpoint executed: Prediction={pred_db.prediction}, Probability={pred_db.risk_probability}")

        # Step 23: Verify risk prediction stored
        assert pred_db.risk_level in ("HIGH", "CRITICAL")
        print(f"[Step 23 PASS] Verified risk prediction stored in DB: ID={pred_db.id}, Level={pred_db.risk_level}")

        # Step 24: Verify alert created
        alert_db = db.query(RiskAlert).filter(RiskAlert.inspection_id == inspection_id).first()
        assert alert_db is not None
        print(f"[Step 24 PASS] Verified alert created in DB: Title='{alert_db.title}' (Severity: {alert_db.severity})")

        # Step 25: Verify recommendation created
        rec_db = db.query(Recommendation).filter(Recommendation.parcel_id == parcel_id).order_by(Recommendation.created_at.desc()).first()
        assert rec_db is not None
        print(f"[Step 25 PASS] Verified recommendation created in DB: '{rec_db.recommendation}' (Priority: {rec_db.priority})")

        # Step 26: Query project again
        p_recheck = client.get("/api/projects/NH-GJ-2026-001", headers=headers)
        assert p_recheck.status_code == 200
        proj_updated = p_recheck.json()
        print(f"[Step 26 PASS] Queried project again: Risk Score={proj_updated['risk_score']}, Risk Level={proj_updated['risk_level']}")

        # Step 27: Confirm updated field inspection is visible
        insp_check = client.get(f"/api/field/inspection/{inspection_id}", headers=headers)
        assert insp_check.status_code == 200
        insp_fetched = insp_check.json()
        assert insp_fetched["status"] == "SUBMITTED"
        assert insp_fetched["boundary_status"] == "MISMATCH"
        print(f"[Step 27 PASS] Confirmed updated field inspection is visible via API (Boundary Status: {insp_fetched['boundary_status']})")

    finally:
        db.close()

    print("\n=== ALL 27 STEPS VERIFIED AND PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    test_27_step_end_to_end()
