import os
import sys
import pytest
from fastapi.testclient import TestClient

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

client = TestClient(app)

def test_01_public_unauthenticated_access():
    resp = client.get("/api/public/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert "active_projects" in data or "total_projects" in data
    assert "transparency_portal" in data
    assert data["transparency_portal"] == "N-LAMS Public Transparency Portal"

    resp_states = client.get("/api/public/states")
    assert resp_states.status_code == 200
    states = resp_states.json()
    assert isinstance(states, list)
    assert len(states) > 0

    resp_notices = client.get("/api/public/notices")
    assert resp_notices.status_code == 200
    notices = resp_notices.json()
    assert isinstance(notices, list)
    assert len(notices) >= 3
    print("[PASS] Test 1: Public unauthenticated access verified")

def test_02_central_admin_unauthenticated_protection():
    resp = client.get("/api/admin/central/dashboard")
    assert resp.status_code == 401
    assert "detail" in resp.json()

    resp_states = client.get("/api/admin/central/states")
    assert resp_states.status_code == 401
    print("[PASS] Test 2: Central Admin endpoints protected (401 Unauthorized)")

def test_03_central_admin_login_and_national_scope():
    login_resp = client.post("/api/auth/login", json={
        "email": "central.admin@nlams.gov.in",
        "password": "password123"
    })
    assert login_resp.status_code == 200
    auth_data = login_resp.json()
    token = auth_data["access_token"]
    assert auth_data["user"]["role"] == "CENTRAL_ADMIN"

    headers = {"Authorization": f"Bearer {token}"}
    dash_resp = client.get("/api/admin/central/dashboard", headers=headers)
    assert dash_resp.status_code == 200
    dash = dash_resp.json()
    assert dash["portal"] == "N-LAMS Central Administration Control Room"
    assert "states_summary" in dash
    assert len(dash["states_summary"]) >= 2

    states_resp = client.get("/api/admin/central/states", headers=headers)
    assert states_resp.status_code == 200
    states = states_resp.json()
    state_names = [s["state"] for s in states]
    assert "Gujarat" in state_names
    assert "Maharashtra" in state_names
    print("[PASS] Test 3: Central Admin authenticated with full national scope across all states")

def test_04_state_admin_login_and_scoped_access():
    login_resp = client.post("/api/auth/login", json={
        "email": "state.gujarat@nlams.gov.in",
        "password": "password123"
    })
    assert login_resp.status_code == 200
    auth_data = login_resp.json()
    token = auth_data["access_token"]
    assert auth_data["user"]["role"] == "STATE_ADMIN"
    assert auth_data["user"]["state"] == "Gujarat"

    headers = {"Authorization": f"Bearer {token}"}
    dash_resp = client.get("/api/admin/state/dashboard?state_name=Gujarat", headers=headers)
    assert dash_resp.status_code == 200
    dash = dash_resp.json()
    assert dash["state"] == "Gujarat"
    assert "districts_summary" in dash
    assert len(dash["districts_summary"]) > 0

    proj_resp = client.get("/api/admin/state/projects?state_name=Gujarat", headers=headers)
    assert proj_resp.status_code == 200
    projects = proj_resp.json()
    for p in projects:
        assert p["state"] == "Gujarat"
    print("[PASS] Test 4: Gujarat State Admin authenticated and scoped to Gujarat")

def test_05_state_admin_cross_state_isolation():
    login_resp = client.post("/api/auth/login", json={
        "email": "state.gujarat@nlams.gov.in",
        "password": "password123"
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    mh_dash = client.get("/api/admin/state/dashboard?state_name=Maharashtra", headers=headers)
    assert mh_dash.status_code == 403
    assert "Access denied" in mh_dash.json()["detail"] or "cannot access" in mh_dash.json()["detail"]

    mh_dist = client.get("/api/admin/state/districts?state_name=Maharashtra", headers=headers)
    assert mh_dist.status_code == 403

    mh_proj = client.get("/api/admin/state/projects?state_name=Maharashtra", headers=headers)
    assert mh_proj.status_code == 403
    print("[PASS] Test 5: Backend-enforced cross-state isolation verified (403 Forbidden on foreign state)")

def test_06_public_pii_and_data_redaction():
    resp = client.get("/api/public/projects/NH-GJ-2026-001")
    assert resp.status_code == 200
    data = resp.json()
    project = data["project"]
    assert project["id"] == "NH-GJ-2026-001"

    text_data = str(data).lower()
    assert "bank_account" not in text_data
    assert "aadhaar" not in text_data
    assert "ifsc" not in text_data
    assert "password" not in text_data

    parcels = data.get("parcels", [])
    for p in parcels:
        assert "aadhaar" not in p
        assert "phone" not in p
        assert "bank" not in str(p).lower()
    print("[PASS] Test 6: Public data redaction verified (no PII, bank data, or secret keys)")

def test_07_unauthorized_role_escalation_prevention():
    login_state = client.post("/api/auth/login", json={
        "email": "state.gujarat@nlams.gov.in",
        "password": "password123"
    })
    token_state = login_state.json()["access_token"]
    resp_state = client.get("/api/admin/central/dashboard", headers={"Authorization": f"Bearer {token_state}"})
    assert resp_state.status_code == 403

    login_viewer = client.post("/api/auth/login", json={
        "email": "viewer@nlams.gov.in",
        "password": "password123"
    })
    token_viewer = login_viewer.json()["access_token"]
    resp_viewer = client.get("/api/admin/central/dashboard", headers={"Authorization": f"Bearer {token_viewer}"})
    assert resp_viewer.status_code == 403
    print("[PASS] Test 7: Unauthorized role escalation prevented (403 Forbidden)")

def test_08_credential_and_hash_sanitization():
    pub_summary = client.get("/api/public/summary").json()
    assert "password_hash" not in str(pub_summary)

    login_resp = client.post("/api/auth/login", json={
        "email": "central.admin@nlams.gov.in",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    profile_resp = client.get("/api/admin/central/profile", headers=headers).json()
    assert "password_hash" not in profile_resp
    assert "password" not in profile_resp
    print("[PASS] Test 8: Password hashes and sensitive credentials fully sanitized")

def test_09_central_admin_drilldown_hierarchy():
    login_resp = client.post("/api/auth/login", json={
        "email": "central.admin@nlams.gov.in",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    st_resp = client.get("/api/admin/central/states/Gujarat", headers=headers)
    assert st_resp.status_code == 200
    st_data = st_resp.json()
    assert st_data["state"] == "Gujarat"
    assert len(st_data["projects"]) > 0

    p_resp = client.get("/api/projects/NH-GJ-2026-001", headers=headers)
    assert p_resp.status_code == 200
    p_data = p_resp.json()
    assert p_data["id"] == "NH-GJ-2026-001"

    parcels_resp = client.get("/api/parcels?project_id=NH-GJ-2026-001&search=1042", headers=headers)
    assert parcels_resp.status_code == 200
    parcels = parcels_resp.json()
    assert any(p.get("survey_number") == "1042" or p.get("khasra_number") == "1042" for p in parcels)
    print("[PASS] Test 9: Central Admin multi-tier drilldown verified through Khasra 1042")

def test_10_state_admin_local_drilldown():
    login_resp = client.post("/api/auth/login", json={
        "email": "state.gujarat@nlams.gov.in",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    dist_resp = client.get("/api/admin/state/districts?state_name=Gujarat", headers=headers)
    assert dist_resp.status_code == 200
    districts = dist_resp.json()
    assert len(districts) > 0

    d_detail = client.get("/api/admin/state/districts/Surendranagar?state_name=Gujarat", headers=headers)
    assert d_detail.status_code == 200
    d_data = d_detail.json()
    assert d_data["district"] == "Surendranagar"

    insp_resp = client.get("/api/admin/state/inspections?state_name=Gujarat", headers=headers)
    assert insp_resp.status_code == 200
    inspections = insp_resp.json()
    assert isinstance(inspections, list)
    print("[PASS] Test 10: State Admin local district and inspection drilldown verified")
