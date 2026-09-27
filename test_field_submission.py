import urllib.request
import json

url = "http://127.0.0.1:8000/api/field/inspection/submit"

payload = {
    "task_id": "TASK-FO-1042",
    "parcel_id": "P-1042",
    "project_id": "NH-GJ-2026-001",
    "officer_id": "FO-007",
    "officer_name": "Amit B. Parmar",
    "officer_confirmed": True,
    "remarks": "Completed ground cadastral survey. Boundary peg displaced by 4.2m on eastern edge. Landowner Rajubhai Patel submitted formal compensation revision petition.",
    "latitude": 22.386221,
    "longitude": 71.064316,
    "gps_accuracy": 5.4,
    "gps_mode": "DEMO_SIMULATED",
    "distance_from_parcel_m": 12.4,
    "location_matched": True,
    "khasra_expected": "1042",
    "khasra_observed": "1042",
    "khasra_matched": True,
    "boundary_status": "Mismatch",
    "boundary_remarks": "Physical fence extends 4.2m into ROW on eastern side",
    "land_use": "Agricultural - Irrigated",
    "land_use_recorded": "Agricultural - Irrigated",
    "land_use_observed": "Agricultural - Irrigated",
    "land_use_matched": True,
    "land_condition": "Standing Cotton Crop",
    "crop_type": "Cotton",
    "structure_present": True,
    "structure_type": "Borewell & pump shed",
    "structure_count": 1,
    "encroachment_status": "Yes",
    "encroachment_type": "Pump house within corridor",
    "encroachment_severity": "High",
    "encroachment_description": "Masonry borewell pump shed built 3m inside proposed 45m ROW line",
    "occupancy_status": "Occupied",
    "occupant_name": "Rajubhai N. Patel",
    "occupant_type": "Titleholder Owner",
    "occupant_relation": "Self",
    "compensation_status": "Disputed",
    "compensation_confirmed": False,
    "compensation_issue": "Disputed 2013 Circle Rate valuation",
    "compensation_remarks": "Owner demands 2024 commercial rate revision as per Section 26(1)",
    "objection_status": "Yes",
    "dispute_type": "Compensation Dispute",
    "dispute_severity": "High",
    "dispute_description": "Landowner refuses possession until enhanced compensation is awarded",
    "rr_status": "Pending",
    "rr_required": True,
    "rr_verified": False,
    "rr_issue": "Displaced agricultural laborer family requires resettlement plot",
    "checklist_data": {
        "gps_lock": True,
        "khasra_peg": True,
        "boundary_stones": False,
        "standing_crops": True,
        "trees_counted": True,
        "borewell_logged": True,
        "structures_photographed": True,
        "owner_id_verified": True,
        "tenant_interview": True,
        "bank_passbook_checked": True,
        "grievance_recorded": True,
        "officer_declaration": True
    },
    "issues": [
        {
            "issue_type": "Boundary mismatch",
            "severity": "High",
            "description": "Physical stone boundary differs 4.2m from digital GIS vector on eastern edge"
        },
        {
            "issue_type": "Encroachment",
            "severity": "High",
            "description": "Borewell and masonry shed situated in RoW"
        },
        {
            "issue_type": "Compensation dispute",
            "severity": "High",
            "description": "Owner filed formal dispute under Section 64 challenging circle rate"
        }
    ],
    "photos": [
        {
            "category": "Boundary Peg",
            "file_name": "survey_marker_1042.jpg",
            "file_url": "/photos/survey_marker_1040.jpg",
            "latitude": 22.386221,
            "longitude": 71.064316
        },
        {
            "category": "Disputed Structure",
            "file_name": "borewell_shed_1042.jpg",
            "file_url": "/photos/survey_marker_1040.jpg",
            "latitude": 22.386228,
            "longitude": 71.064320
        }
    ]
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode('utf-8'))
        print("STATUS CODE: 200 OK")
        print(json.dumps(res, indent=2))
except urllib.error.HTTPError as e:
    print(f"HTTP ERROR: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"ERROR: {e}")
