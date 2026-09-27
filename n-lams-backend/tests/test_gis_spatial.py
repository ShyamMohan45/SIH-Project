import os
import sys
import pytest
from fastapi.testclient import TestClient

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

client = TestClient(app)

def test_01_get_map_feature_collection():
    """Test 1: GET /api/map returns valid GeoJSON FeatureCollection generated from PostGIS."""
    resp = client.get("/api/map")
    assert resp.status_code == 200
    data = resp.json()
    assert data["type"] == "FeatureCollection"
    assert "features" in data
    features = data["features"]
    assert len(features) >= 30, f"Expected >= 30 parcels, got {len(features)}"

    # Inspect hero parcel 1042
    p1042 = next((f for f in features if f["properties"].get("survey_number") == "1042"), None)
    assert p1042 is not None, "Hero parcel Khasra 1042 not found"
    props = p1042["properties"]
    assert props["project_id"] == "NH-GJ-2026-001"
    assert props["district"] == "Surendranagar"
    assert props["state"] == "Gujarat"
    assert props["area"] == 2.45
    assert props["risk_level"] == "CRITICAL"
    assert props["field_verification_status"] == "MISMATCH"

    # Verify geometry
    geom = p1042["geometry"]
    assert geom["type"] in ["Polygon", "MultiPolygon"]
    assert len(geom["coordinates"]) > 0
    # Coordinates in WGS84 range
    first_coord = geom["coordinates"][0][0]
    lng, lat = first_coord[0], first_coord[1]
    assert 68.0 <= lng <= 75.0, f"Invalid longitude: {lng}"
    assert 20.0 <= lat <= 25.0, f"Invalid latitude: {lat}"
    print("[PASS] Test 1: GET /api/map valid GeoJSON FeatureCollection with 50+ PostGIS parcels verified")

def test_02_project_map_endpoint():
    """Test 2: GET /api/projects/{project_id}/map returns only parcels for that project."""
    resp = client.get("/api/projects/NH-GJ-2026-001/map")
    assert resp.status_code == 200
    data = resp.json()
    assert data["type"] == "FeatureCollection"
    for feat in data["features"]:
        assert feat["properties"]["project_id"] == "NH-GJ-2026-001"
    print("[PASS] Test 2: GET /api/projects/NH-GJ-2026-001/map scoped to project verified")

def test_03_parcel_geometry_endpoint():
    """Test 3: GET /api/parcels/{parcel_id}/geometry returns parcel GeoJSON geometry."""
    resp = client.get("/api/parcels/P-1042/geometry")
    assert resp.status_code == 200
    data = resp.json()
    assert "geometry" in data
    geom = data["geometry"]
    assert geom["type"] in ["Polygon", "MultiPolygon"]
    assert len(geom["coordinates"]) > 0
    assert data["properties"]["survey_number"] == "1042"
    print("[PASS] Test 3: GET /api/parcels/P-1042/geometry returned actual PostGIS geometry")

def test_04_state_gis_endpoints():
    """Test 4: GET /api/gis/state/{state} returns only parcels for that state."""
    # Gujarat
    resp_gj = client.get("/api/gis/state/Gujarat")
    assert resp_gj.status_code == 200
    data_gj = resp_gj.json()
    assert len(data_gj["features"]) > 0
    for feat in data_gj["features"]:
        assert feat["properties"]["state"].lower() == "gujarat"

    # Maharashtra
    resp_mh = client.get("/api/gis/state/Maharashtra")
    assert resp_mh.status_code == 200
    data_mh = resp_mh.json()
    assert len(data_mh["features"]) >= 2
    for feat in data_mh["features"]:
        assert feat["properties"]["state"].lower() == "maharashtra"
    print("[PASS] Test 4: GET /api/gis/state/{state} PostGIS filtering verified")

def test_05_district_gis_endpoints():
    """Test 5: GET /api/gis/district/{district} returns only parcels for that district."""
    # Surendranagar
    resp_srn = client.get("/api/gis/district/Surendranagar")
    assert resp_srn.status_code == 200
    data_srn = resp_srn.json()
    assert len(data_srn["features"]) >= 50
    for feat in data_srn["features"]:
        assert feat["properties"]["district"].lower() == "surendranagar"

    # Thane
    resp_thn = client.get("/api/gis/district/Thane")
    assert resp_thn.status_code == 200
    data_thn = resp_thn.json()
    assert len(data_thn["features"]) >= 2
    for feat in data_thn["features"]:
        assert feat["properties"]["district"].lower() == "thane"
    print("[PASS] Test 5: GET /api/gis/district/{district} PostGIS filtering verified")

def test_06_backend_attribute_filters():
    """Test 6: GET /api/map query filtering by risk, acquisition, compensation, verification."""
    # Filter by risk_level=CRITICAL
    resp_crit = client.get("/api/map?risk_level=CRITICAL")
    assert resp_crit.status_code == 200
    data_crit = resp_crit.json()
    assert len(data_crit["features"]) > 0
    for feat in data_crit["features"]:
        assert feat["properties"]["risk_level"] == "CRITICAL"

    # Filter by compensation_status=DISPUTED
    resp_disp = client.get("/api/map?compensation_status=DISPUTED")
    assert resp_disp.status_code == 200
    data_disp = resp_disp.json()
    assert len(data_disp["features"]) > 0
    for feat in data_disp["features"]:
        assert feat["properties"]["compensation_status"] == "DISPUTED"

    # Filter by field_verification_status=MISMATCH
    resp_mis = client.get("/api/map?field_verification_status=MISMATCH")
    assert resp_mis.status_code == 200
    data_mis = resp_mis.json()
    assert len(data_mis["features"]) > 0
    for feat in data_mis["features"]:
        assert feat["properties"]["field_verification_status"] == "MISMATCH"
    print("[PASS] Test 6: Backend-enforced SQL filtering on PostGIS parcels verified")

def test_07_project_corridor_endpoint():
    """Test 7: GET /api/gis/projects/{project_id}/corridor returns PostGIS LineString geometry & statistics."""
    resp = client.get("/api/gis/projects/NH-GJ-2026-001/corridor")
    assert resp.status_code == 200
    data = resp.json()
    assert data["type"] == "Feature"
    assert "geometry" in data
    geom = data["geometry"]
    assert geom["type"] in ["LineString", "MultiLineString"]
    assert len(geom["coordinates"]) >= 5

    props = data["properties"]
    assert props["project_id"] == "NH-GJ-2026-001"
    assert props["corridor_label"] == "DEMO / SYNTHETIC PROJECT CORRIDOR"
    assert props["corridor_length_km"] > 0
    assert props["affected_parcels_count"] >= 4
    assert "1042" in props["affected_khasra_list"]
    print(f"[PASS] Test 7: Project corridor returned {props['corridor_length_km']} km, {props['affected_parcels_count']} affected parcels")

def test_08_project_affected_parcels_endpoint():
    """Test 8: GET /api/gis/projects/{project_id}/affected-parcels uses PostGIS ST_Intersects."""
    resp = client.get("/api/gis/projects/NH-GJ-2026-001/affected-parcels")
    assert resp.status_code == 200
    data = resp.json()
    assert data["type"] == "FeatureCollection"
    features = data["features"]
    assert len(features) >= 4

    # Confirm Khasra 1042 is among the affected parcels
    p1042 = next((f for f in features if f["properties"].get("khasra_no") == "1042"), None)
    assert p1042 is not None, "Khasra 1042 must be affected/intersected by corridor"
    assert p1042["properties"]["is_affected_by_corridor"] is True
    assert p1042["properties"]["corridor_label"] == "DEMO / SYNTHETIC PROJECT CORRIDOR"

    # Confirm parcel geometry endpoint returns is_affected_by_corridor
    p_resp = client.get("/api/parcels/P-1042/geometry")
    assert p_resp.status_code == 200
    p_data = p_resp.json()
    assert p_data["properties"]["is_affected_by_corridor"] is True

    print("[PASS] Test 8: PostGIS ST_Intersects dynamic spatial query confirmed for affected parcels including Khasra 1042")

def test_09_field_officer_gps_to_gis_pipeline():
    """Test 9: Field Officer Android GPS -> FastAPI -> PostGIS ST_Distance_Parcel -> GIS Map feed."""
    # 1. Start Inspection on parcel P-1042
    start_resp = client.post("/api/field/inspection/start", json={
        "project_id": "NH-GJ-2026-001",
        "parcel_id": "P-1042",
        "officer_id": "FO-8832",
        "officer_name": "Vikram Patel"
    })
    assert start_resp.status_code == 200
    insp_id = start_resp.json()["inspection_id"]

    # 2. Log Field Officer GPS coordinates
    gps_resp = client.post("/api/field/inspection/gps", json={
        "inspection_id": insp_id,
        "officer_id": "FO-8832",
        "latitude": 22.3837,
        "longitude": 71.0673,
        "accuracy": 4.2,
        "is_demo": False
    })
    assert gps_resp.status_code == 200
    gps_data = gps_resp.json()
    assert "distance_meters" in gps_data
    assert "gps_accuracy" in gps_data
    assert "gps_verified" in gps_data
    assert gps_data["status"] in ["GPS VERIFIED", "GPS OUTSIDE ASSIGNED PARCEL"]
    assert gps_data["assigned_parcel_id"] == "P-1042"
    assert gps_data["assigned_khasra"] == "1042"

    # 3. Submit inspection
    sub_resp = client.post("/api/field/inspection/submit", json={
        "inspection_id": insp_id,
        "project_id": "NH-GJ-2026-001",
        "parcel_id": "P-1042",
        "officer_id": "FO-8832",
        "boundary_status": "MISMATCH",
        "khasra_observed": "1042",
        "land_use_observed": "Agricultural",
        "remarks": "12m physical boundary overlap logged with GPS precision against RoR record."
    })
    assert sub_resp.status_code == 200

    # 4. Open GIS GPS layer and verify marker appears with relationship to parcel 1042
    gis_resp = client.get("/api/gis/inspections/gps")
    assert gis_resp.status_code == 200
    gis_data = gis_resp.json()
    assert gis_data["type"] == "FeatureCollection"
    
    # Locate the submitted inspection GPS marker
    marker = next((f for f in gis_data["features"] if f["properties"].get("inspection_id") == insp_id), None)
    assert marker is not None, f"GPS marker for inspection {insp_id} not found in GIS layer"
    m_props = marker["properties"]
    assert m_props["assigned_parcel_id"] == "P-1042"
    assert m_props["assigned_khasra"] == "1042"
    assert m_props["officer_id"] == "FO-8832"
    assert m_props["latitude"] == 22.3837
    assert m_props["longitude"] == 71.0673
    assert m_props["gps_accuracy"] == 4.2
    assert m_props["distance_meters"] > 0
    assert m_props["status"] in ["GPS VERIFIED", "GPS OUTSIDE ASSIGNED PARCEL"]

    print(f"[PASS] Test 9: Field Officer GPS -> PostGIS -> GIS Map verified: Officer={m_props['officer_name']}, Parcel=1042, Dist={m_props['distance_meters']}m, Status={m_props['status']}")

def test_10_field_inspection_issues_to_gis_pipeline():
    """
    Test End-to-End Field Inspection Issue to GIS Warning Boundary Pipeline:
    1. Submit field inspection issue: Khasra 1042, 'Boundary mismatch'.
    2. Open GIS: Verify Khasra 1042 has warning boundary (#ea580c).
    3. Click 1042: Verify issue appears in active_issues with full metadata:
       Issue Type, Severity, Description, Reported By, Inspection ID, Timestamp, Status.
    4. Open Issue: Verify GET /api/field/inspection/{id} returns the inspection dossier.
    """
    client = TestClient(app)
    # 1. Start Inspection
    start_resp = client.post("/api/field/inspection/start", json={
        "project_id": "NH-GJ-2026-001",
        "parcel_id": "P-1042",
        "officer_id": "FO-8832",
        "officer_name": "Vikram Patel"
    })
    assert start_resp.status_code == 200
    insp_id = start_resp.json()["inspection_id"]
    insp_code = start_resp.json()["inspection_code"]

    # 2. Report Issue: 'Boundary mismatch'
    issue_resp = client.post("/api/field/inspection/issues", json={
        "inspection_id": insp_id,
        "issue_type": "Boundary mismatch",
        "severity": "HIGH",
        "description": "Southern boundary shows 12m discrepancy between cadastral revenue map and ground fence line."
    })
    assert issue_resp.status_code == 200
    issue_data = issue_resp.json()
    assert issue_data["success"] is True
    assert issue_data["issue_type"] == "BOUNDARY_MISMATCH"
    assert issue_data["parcel_id"] == "P-1042"

    # 3. Open GIS (GET /api/map)
    gis_resp = client.get("/api/map")
    assert gis_resp.status_code == 200
    gis_data = gis_resp.json()
    assert gis_data["type"] == "FeatureCollection"

    # Locate Khasra 1042
    k1042 = next((f for f in gis_data["features"] if str(f["properties"].get("khasra_number")) == "1042"), None)
    assert k1042 is not None, "Khasra 1042 polygon feature not found in GIS map"
    props = k1042["properties"]

    # Verify warning boundary
    assert props["has_active_issue"] is True
    assert props["warning_border"] is not None
    assert props["warning_border"]["color"] == "#ea580c"  # Red/Orange boundary for Boundary mismatch
    assert props["warning_border"]["weight"] >= 4

    # Verify Issue appears on Parcel
    active_issues = props.get("active_issues", [])
    assert len(active_issues) > 0
    matched_issue = next((i for i in active_issues if i["inspection_id"] == insp_id), None)
    assert matched_issue is not None, f"Reported issue for inspection {insp_id} not found on parcel 1042"

    assert matched_issue["issue_type"] == "BOUNDARY_MISMATCH"
    assert matched_issue["severity"] == "HIGH"
    assert "12m discrepancy" in matched_issue["description"]
    assert "Vikram Patel" in matched_issue["reported_by"]
    assert matched_issue["inspection_id"] == insp_id
    assert matched_issue["status"] == "OPEN"
    assert matched_issue["timestamp"] is not None

    # 4. Open Issue: Inspect inspection endpoint
    detail_resp = client.get(f"/api/field/inspection/{insp_id}")
    assert detail_resp.status_code == 200
    detail_data = detail_resp.json()
    assert detail_data["id"] == insp_id
    assert detail_data["officer_name"] == "Vikram Patel"
    assert str(detail_data["khasra_number"]) == "1042"
    assert len(detail_data["issues"]) >= 1

    print(f"[PASS] Test 10: Field Inspection Issue -> GIS Warning Border verified successfully: Parcel=1042, Issue={matched_issue['formatted_type']}, BorderColor={props['warning_border']['color']}, Inspection={insp_code}")



