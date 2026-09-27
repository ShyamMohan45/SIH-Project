import os
import json
import csv
import random
import numpy as np

os.makedirs(os.path.dirname(__file__), exist_ok=True)
data_dir = os.path.dirname(__file__)

# 1. GENERATE USERS (users.csv)
users = [
    {
        "id": "USR-001",
        "name": "Dr. Rajesh Sharma",
        "email": "central.admin@mord.gov.in",
        "role": "CENTRAL_ADMIN",
        "department": "Department of Land Resources (DoLR), MoRD",
        "state": "All India",
        "district": "All Districts"
    },
    {
        "id": "USR-002",
        "name": "Pooja Vaghela",
        "email": "state.nodal@gujarat.gov.in",
        "role": "STATE_OFFICER",
        "department": "Revenue & Land Acquisition Dept, Gujarat",
        "state": "Gujarat",
        "district": "All Districts"
    },
    {
        "id": "USR-003",
        "name": "Vikramaditya Solanki",
        "email": "collector.rajkot@nic.in",
        "role": "DISTRICT_OFFICER",
        "department": "Collectorate & District Magistrate Office, Rajkot",
        "state": "Gujarat",
        "district": "Rajkot"
    },
    {
        "id": "USR-004",
        "name": "Amit B. Parmar",
        "email": "field.surveyor@nlams.gov.in",
        "role": "FIELD_OFFICER",
        "department": "Field Cadastral Survey Cell, Kuvadva Tehsil",
        "state": "Gujarat",
        "district": "Rajkot"
    },
    {
        "id": "USR-005",
        "name": "Public Citizen Audit",
        "email": "viewer@nlams.gov.in",
        "role": "VIEWER",
        "department": "Public Oversight & Transparency Portal",
        "state": "All India",
        "district": "All Districts"
    }
]

with open(os.path.join(data_dir, "users.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=users[0].keys())
    writer.writeheader()
    writer.writerows(users)

print("Generated users.csv")

# 2. GENERATE PROJECTS (projects.csv)
projects = [
    {
        "id": "NH-GJ-2026-001",
        "project_code": "NH-GJ-001",
        "name": "Ahmedabad–Rajkot Green Highway Expansion",
        "project_type": "Highway",
        "state": "Gujarat",
        "district": "Rajkot, Surendranagar",
        "land_required": 1250.0,
        "land_acquired": 780.0,
        "affected_families": 2400,
        "displaced_families": 780,
        "start_date": "2025-04-01",
        "target_date": "2027-03-31",
        "actual_completion_date": "",
        "current_stage": "Compensation",
        "status": "IN_PROGRESS",
        "compensation_assessed_cr": 850.0,
        "compensation_disbursed_cr": 690.0,
        "rr_completed_families": 1890,
        "possession_ha": 980.0,
        "legal_cases": 18,
        "risk_level": "HIGH",
        "risk_score": 82
    },
    {
        "id": "MH-RAIL-2026-014",
        "project_code": "MH-RAIL-014",
        "name": "Mumbai–Nagpur High-Speed Rail Corridor",
        "project_type": "Railway",
        "state": "Maharashtra",
        "district": "Thane, Nashik, Nagpur",
        "land_required": 3400.0,
        "land_acquired": 2420.0,
        "affected_families": 5100,
        "displaced_families": 1650,
        "start_date": "2024-09-15",
        "target_date": "2028-06-30",
        "actual_completion_date": "",
        "current_stage": "Objection",
        "status": "DELAYED",
        "compensation_assessed_cr": 2400.0,
        "compensation_disbursed_cr": 1320.0,
        "rr_completed_families": 2200,
        "possession_ha": 1850.0,
        "legal_cases": 45,
        "risk_level": "HIGH",
        "risk_score": 79
    },
    {
        "id": "RJ-SOLAR-2026-031",
        "project_code": "RJ-SOLAR-031",
        "name": "Bhadla Mega Solar Corridor Phase IV",
        "project_type": "Power",
        "state": "Rajasthan",
        "district": "Jodhpur, Bikaner",
        "land_required": 4800.0,
        "land_acquired": 3950.0,
        "affected_families": 850,
        "displaced_families": 120,
        "start_date": "2025-01-10",
        "target_date": "2026-12-31",
        "actual_completion_date": "",
        "current_stage": "Possession",
        "status": "IN_PROGRESS",
        "compensation_assessed_cr": 640.0,
        "compensation_disbursed_cr": 580.0,
        "rr_completed_families": 780,
        "possession_ha": 3800.0,
        "legal_cases": 6,
        "risk_level": "MEDIUM",
        "risk_score": 61
    },
    {
        "id": "KA-IND-2026-009",
        "project_code": "KA-IND-009",
        "name": "Bengaluru–Chennai Industrial Expressway Hub",
        "project_type": "Industrial Corridor",
        "state": "Karnataka",
        "district": "Kolar, Bengaluru Rural",
        "land_required": 1850.0,
        "land_acquired": 1490.0,
        "affected_families": 1950,
        "displaced_families": 430,
        "start_date": "2025-03-01",
        "target_date": "2027-08-15",
        "actual_completion_date": "",
        "current_stage": "Award",
        "status": "IN_PROGRESS",
        "compensation_assessed_cr": 1120.0,
        "compensation_disbursed_cr": 890.0,
        "rr_completed_families": 1600,
        "possession_ha": 1420.0,
        "legal_cases": 12,
        "risk_level": "MEDIUM",
        "risk_score": 54
    },
    {
        "id": "GJ-DHOL-2026-005",
        "project_code": "GJ-DHOL-005",
        "name": "Dholera Special Investment Region (SIR) Expressway Link",
        "project_type": "Highway",
        "state": "Gujarat",
        "district": "Ahmedabad",
        "land_required": 2100.0,
        "land_acquired": 1980.0,
        "affected_families": 1400,
        "displaced_families": 210,
        "start_date": "2024-06-01",
        "target_date": "2026-09-30",
        "actual_completion_date": "",
        "current_stage": "Closure",
        "status": "COMPLETED",
        "compensation_assessed_cr": 940.0,
        "compensation_disbursed_cr": 940.0,
        "rr_completed_families": 1400,
        "possession_ha": 1980.0,
        "legal_cases": 1,
        "risk_level": "LOW",
        "risk_score": 14
    },
    {
        "id": "UP-EXP-2026-022",
        "project_code": "UP-EXP-022",
        "name": "Ganga Expressway Extension Phase II",
        "project_type": "Highway",
        "state": "Uttar Pradesh",
        "district": "Prayagraj, Varanasi",
        "land_required": 3100.0,
        "land_acquired": 1820.0,
        "affected_families": 4200,
        "displaced_families": 980,
        "start_date": "2025-02-15",
        "target_date": "2027-11-30",
        "actual_completion_date": "",
        "current_stage": "Notification",
        "status": "DELAYED",
        "compensation_assessed_cr": 1650.0,
        "compensation_disbursed_cr": 720.0,
        "rr_completed_families": 1400,
        "possession_ha": 1200.0,
        "legal_cases": 38,
        "risk_level": "CRITICAL",
        "risk_score": 88
    },
    {
        "id": "TN-METRO-2026-003",
        "project_code": "TN-METRO-003",
        "name": "Chennai Metro Rail Phase II Depot",
        "project_type": "Metro",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "land_required": 320.0,
        "land_acquired": 290.0,
        "affected_families": 720,
        "displaced_families": 310,
        "start_date": "2024-11-01",
        "target_date": "2026-10-31",
        "actual_completion_date": "",
        "current_stage": "Possession",
        "status": "IN_PROGRESS",
        "compensation_assessed_cr": 450.0,
        "compensation_disbursed_cr": 420.0,
        "rr_completed_families": 680,
        "possession_ha": 290.0,
        "legal_cases": 4,
        "risk_level": "LOW",
        "risk_score": 22
    },
    {
        "id": "AP-PORT-2026-008",
        "project_code": "AP-PORT-008",
        "name": "Ramayapatnam Deepwater Port Hinterland Rail",
        "project_type": "Railway",
        "state": "Andhra Pradesh",
        "district": "Nellore, Prakasam",
        "land_required": 1450.0,
        "land_acquired": 980.0,
        "affected_families": 1800,
        "displaced_families": 540,
        "start_date": "2025-05-10",
        "target_date": "2027-12-31",
        "actual_completion_date": "",
        "current_stage": "Scrutiny",
        "status": "IN_PROGRESS",
        "compensation_assessed_cr": 780.0,
        "compensation_disbursed_cr": 490.0,
        "rr_completed_families": 1100,
        "possession_ha": 920.0,
        "legal_cases": 9,
        "risk_level": "MEDIUM",
        "risk_score": 48
    },
    {
        "id": "MP-IRR-2026-015",
        "project_code": "MP-IRR-015",
        "name": "Ken-Betwa River Link Submergence & Canal Network",
        "project_type": "Irrigation",
        "state": "Madhya Pradesh",
        "district": "Chhatarpur, Panna",
        "land_required": 5200.0,
        "land_acquired": 2600.0,
        "affected_families": 6800,
        "displaced_families": 2900,
        "start_date": "2024-04-01",
        "target_date": "2029-03-31",
        "actual_completion_date": "",
        "current_stage": "Objection",
        "status": "DELAYED",
        "compensation_assessed_cr": 3100.0,
        "compensation_disbursed_cr": 1400.0,
        "rr_completed_families": 2100,
        "possession_ha": 2300.0,
        "legal_cases": 58,
        "risk_level": "CRITICAL",
        "risk_score": 91
    },
    {
        "id": "OD-MIN-2026-011",
        "project_code": "OD-MIN-011",
        "name": "Talcher Industrial Mineral Corridor",
        "project_type": "Industrial Corridor",
        "state": "Odisha",
        "district": "Angul",
        "land_required": 1650.0,
        "land_acquired": 1320.0,
        "affected_families": 2100,
        "displaced_families": 640,
        "start_date": "2025-01-20",
        "target_date": "2027-06-30",
        "actual_completion_date": "",
        "current_stage": "R&R",
        "status": "IN_PROGRESS",
        "compensation_assessed_cr": 890.0,
        "compensation_disbursed_cr": 780.0,
        "rr_completed_families": 1850,
        "possession_ha": 1280.0,
        "legal_cases": 7,
        "risk_level": "LOW",
        "risk_score": 28
    }
]

with open(os.path.join(data_dir, "projects.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=projects[0].keys())
    writer.writeheader()
    writer.writerows(projects)

print("Generated projects.csv")

# 3. GENERATE 600 SYNTHETIC TRAINING RECORDS (training_data.csv)
np.random.seed(42)
records = []
stages = ["Proposal", "Scrutiny", "Approval", "Notification", "Objection", "Award", "Compensation", "R&R", "Possession", "Closure"]

for i in range(600):
    land_area = round(float(np.random.uniform(50.0, 5000.0)), 2)
    parcel_count = int(np.random.uniform(20, 1500))
    affected_families = int(parcel_count * np.random.uniform(0.8, 3.5))
    legal_dispute_count = int(np.random.poisson(lam=parcel_count * 0.04))
    dispute_ratio = round(legal_dispute_count / max(1, parcel_count), 4)
    approval_delay = int(max(0, np.random.normal(loc=18, scale=12)))
    notification_delay = int(max(0, np.random.normal(loc=25, scale=15)))
    compensation_completion = round(float(np.random.uniform(0.1, 1.0)), 2)
    rr_completion = round(float(np.random.uniform(0.05, 1.0)), 2)
    possession_completion = round(float(np.random.uniform(0.0, compensation_completion)), 2)
    pending_documents = int(np.random.poisson(lam=3))
    stakeholder_response_time = int(max(2, np.random.normal(loc=14, scale=6)))
    current_stage = random.choice(stages)
    documentation_score = round(float(np.random.uniform(0.4, 0.98)), 2)

    # Risk formulation: higher disputes + low compensation + high approval delay => delayed
    delay_score = (
        (dispute_ratio * 40) +
        ((1.0 - compensation_completion) * 30) +
        (approval_delay * 0.8) +
        (notification_delay * 0.5) +
        (pending_documents * 4) +
        ((1.0 - rr_completion) * 15) -
        (documentation_score * 20)
    )
    prob = 1 / (1 + np.exp(- (delay_score - 35) / 10))
    delayed = 1 if prob > 0.5 else 0

    records.append({
        "land_area": land_area,
        "parcel_count": parcel_count,
        "affected_families": affected_families,
        "legal_dispute_count": legal_dispute_count,
        "dispute_ratio": dispute_ratio,
        "approval_delay": approval_delay,
        "notification_delay": notification_delay,
        "compensation_completion": compensation_completion,
        "rr_completion": rr_completion,
        "possession_completion": possession_completion,
        "pending_documents": pending_documents,
        "stakeholder_response_time": stakeholder_response_time,
        "current_stage": current_stage,
        "documentation_score": documentation_score,
        "delayed": delayed
    })

with open(os.path.join(data_dir, "training_data.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=records[0].keys())
    writer.writeheader()
    writer.writerows(records)

print("Generated training_data.csv with 600 records")

# 4. GENERATE GEOJSON FOR 52 AGRICULTURAL PARCELS (parcels.geojson)
# Center coordinates near Kuvadva / Limbdi along Ahmedabad-Rajkot Highway corridor (Lat: 22.38°N, Lng: 71.05°E)
base_lat = 22.3850
base_lng = 71.0520

khasra_numbers = [
    "1038", "1039", "1040", "1041", "1042", "1042/1", "1042/2", "1042/3",
    "1043", "1043/1", "1044", "1045", "1046", "1047", "1048", "1049",
    "1050", "1051", "1052", "1053", "1054", "1055", "1056", "1057",
    "1058", "1059", "1060", "1061", "1062", "1063", "1064", "1065",
    "1066", "1067", "1068", "1069", "1070", "1071", "1072", "1073",
    "1074", "1075", "1076", "1077", "1078", "1079", "1080", "1081",
    "1082", "1083", "1084", "1085"
]

features = []
rows = 6
cols = 9

for idx, khasra in enumerate(khasra_numbers):
    r = idx // cols
    c = idx % cols
    
    # 0.003 degree grid (~300m per parcel)
    lat_min = base_lat + (r * 0.0032) + random.uniform(-0.0003, 0.0003)
    lat_max = lat_min + 0.0028 + random.uniform(-0.0002, 0.0002)
    lng_min = base_lng + (c * 0.0035) + random.uniform(-0.0003, 0.0003)
    lng_max = lng_min + 0.0031 + random.uniform(-0.0002, 0.0002)

    polygon = [
        [round(lng_min, 6), round(lat_min, 6)],
        [round(lng_max, 6), round(lat_min, 6)],
        [round(lng_max, 6), round(lat_max, 6)],
        [round(lng_min, 6), round(lat_max, 6)],
        [round(lng_min, 6), round(lat_min, 6)]
    ]

    area = round(random.uniform(1.2, 4.8), 2)
    owner_count = random.choice([1, 2, 3, 4, 6])
    
    # High-Risk demo focal points: 1042, 1042/1, 1045
    if khasra == "1042":
        acq_status = "Under Process"
        comp_status = "Pending"
        legal_status = "Disputed"
        poss_status = "Not Taken"
        risk_level = "High"
        ai_risk_score = 84
        owner_name = "Suresh & Bhavesh Patel (Joint)"
        legal_case_no = "LEG-2026-0042 (High Court)"
        comp_assessed = 4560000
        comp_paid = 0
    elif khasra in ["1042/1", "1045", "1062"]:
        acq_status = "Under Process"
        comp_status = "Pending"
        legal_status = "Disputed"
        poss_status = "Not Taken"
        risk_level = "High"
        ai_risk_score = 78
        owner_name = "Ramesh Bhai Patel & Heirs"
        legal_case_no = "LEG-2026-0045"
        comp_assessed = 3800000
        comp_paid = 0
    elif khasra in ["1038", "1039", "1040", "1041", "1044", "1046", "1049", "1050", "1051"]:
        acq_status = "Acquired"
        comp_status = "Paid"
        legal_status = "Clear"
        poss_status = "Taken"
        risk_level = "Low"
        ai_risk_score = 15
        owner_name = f"Farmer Owner {khasra}"
        legal_case_no = "None"
        comp_assessed = int(area * 1800000)
        comp_paid = comp_assessed
    else:
        acq_status = random.choice(["Acquired", "Under Process", "Under Process", "Acquired"])
        comp_status = "Paid" if acq_status == "Acquired" else "Pending"
        legal_status = "Clear"
        poss_status = "Taken" if acq_status == "Acquired" else "Not Taken"
        risk_level = "Medium" if acq_status == "Under Process" else "Low"
        ai_risk_score = random.randint(35, 62) if acq_status == "Under Process" else random.randint(10, 25)
        owner_name = f"Local Agriculturist {khasra}"
        legal_case_no = "None"
        comp_assessed = int(area * 1800000)
        comp_paid = comp_assessed if comp_status == "Paid" else 0

    feature = {
        "type": "Feature",
        "id": f"P-{khasra}",
        "properties": {
            "parcel_id": f"P-{khasra}",
            "survey_number": f"Sur-{khasra}",
            "khasra_number": khasra,
            "village": "Kuvadva",
            "taluka": "Limbdi",
            "district": "Rajkot",
            "state": "Gujarat",
            "project_id": "NH-GJ-2026-001",
            "project_name": "Ahmedabad–Rajkot Green Highway Expansion",
            "area_ha": area,
            "land_type": "Agricultural / Irrigated Cotton",
            "owner_name": owner_name,
            "owner_count": owner_count,
            "acquisition_status": acq_status,
            "compensation_status": comp_status,
            "compensation_assessed": comp_assessed,
            "compensation_paid": comp_paid,
            "legal_status": legal_status,
            "legal_case_no": legal_case_no,
            "possession_status": poss_status,
            "risk_level": risk_level,
            "ai_risk_score": ai_risk_score,
            "field_verified": True if acq_status == "Acquired" else (khasra == "1042"),
            "field_verified_date": "2026-09-11" if khasra == "1042" else "2026-08-20",
            "field_officer": "Amit B. Parmar",
            "gps_lat": round((lat_min + lat_max) / 2, 6),
            "gps_lng": round((lng_min + lng_max) / 2, 6)
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [polygon]
        }
    }
    features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "name": "NLAMS_Cadastral_Parcels_NH_GJ_001",
    "crs": {
        "type": "name",
        "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
    },
    "features": features
}

with open(os.path.join(data_dir, "parcels.geojson"), "w", encoding="utf-8") as f:
    json.dump(geojson, f, indent=2)

print(f"Generated parcels.geojson with {len(features)} parcels")
