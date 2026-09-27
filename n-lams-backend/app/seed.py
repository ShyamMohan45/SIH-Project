import os
import sys
import json
import csv
from datetime import datetime

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

root_dir = os.path.dirname(backend_dir)
data_dir = os.path.join(root_dir, "data")

from app.core.security import get_password_hash
from app.db.database import engine, Base, SessionLocal
from app.db.models.user import User
from app.db.models.project import Project
from app.db.models.parcel import Parcel
from app.db.models.workflow import WorkflowStage
from app.db.models.inspection import (
    InspectionTask, FieldInspection, InspectionPhoto, 
    InspectionIssue, FieldGPSLog, InspectionChecklist
)
from app.db.models.compensation import CompensationRecord
from app.db.models.rr import RRRecord
from app.db.models.legal import LegalCase
from app.db.models.document import DocumentRecord
from app.db.models.notice import PublicNotice
from app.db.models.risk import RiskPrediction
from app.db.models.alert import RiskAlert
from app.db.models.recommendation import Recommendation
from app.db.models.audit import AuditLog
from app.db.init_postgis import init_postgis

def seed():
    print("[*] Initializing PostGIS in PostgreSQL...")
    init_postgis()
    print("[*] Recreating database schema tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        default_pwd_hash = get_password_hash("password123")

        # 1. Seed Users (RBAC)
        demo_users = [
            User(
                id="USR-001", name="National System Administrator", email="central.admin@nlams.gov.in",
                password_hash=default_pwd_hash, role="CENTRAL_ADMIN",
                state="National", district="National", officer_id="CADM-001"
            ),
            User(
                id="USR-001B", name="Rajesh Sharma", email="admin@nlams.gov.in",
                password_hash=default_pwd_hash, role="CENTRAL_ADMIN",
                state="National", district="National", officer_id="ADM-001"
            ),
            User(
                id="USR-002", name="Kiran Mehta", email="state.gujarat@nlams.gov.in",
                password_hash=default_pwd_hash, role="STATE_ADMIN",
                state="Gujarat", district="Gandhinagar", officer_id="SADM-GJ-01"
            ),
            User(
                id="USR-002B", name="Kiran Mehta", email="state.gj@nlams.gov.in",
                password_hash=default_pwd_hash, role="STATE_OFFICER",
                state="Gujarat", district="Gandhinagar", officer_id="SO-GJ-01"
            ),
            User(
                id="USR-003", name="Amit Trivedi", email="district.rajkot@nlams.gov.in",
                password_hash=default_pwd_hash, role="DISTRICT_OFFICER",
                state="Gujarat", district="Rajkot", officer_id="DO-RJK-01"
            ),
            User(
                id="USR-004", name="Vikram Patel", email="fo.vikram@nlams.gov.in",
                password_hash=default_pwd_hash, role="FIELD_OFFICER",
                state="Gujarat", district="Surendranagar", officer_id="FO-007"
            ),
            User(
                id="USR-005", name="Public Citizen", email="viewer@nlams.gov.in",
                password_hash=default_pwd_hash, role="VIEWER",
                state="Gujarat", district="All", officer_id="VW-001"
            ),
            User(
                id="USR-006", name="Suresh Deshmukh", email="state.maharashtra@nlams.gov.in",
                password_hash=default_pwd_hash, role="STATE_ADMIN",
                state="Maharashtra", district="Mumbai", officer_id="SADM-MH-01"
            ),
        ]
        for u in demo_users:
            db.add(u)
        db.commit()
        print(f"[*] Seeded and committed {len(demo_users)} RBAC users.")

        # 2. Seed Projects
        projects_file = os.path.join(data_dir, "projects.csv")
        seeded_projects = 0
        if os.path.exists(projects_file):
            with open(projects_file, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    p = Project(
                        id=row["id"],
                        project_code=row["project_code"],
                        name=row["name"].replace("", "–"),
                        project_type=row["project_type"],
                        state=row["state"],
                        district=row["district"],
                        land_required=float(row.get("land_required", 1000.0)),
                        land_acquired=float(row.get("land_acquired", 600.0)),
                        affected_families=int(row.get("affected_families", 500)),
                        displaced_families=int(row.get("displaced_families", 120)),
                        status=row.get("status", "IN_PROGRESS"),
                        start_date=row.get("start_date", "2024-01-15"),
                        target_date=row.get("target_date", "2027-03-31"),
                        current_stage=row.get("current_stage", "Award"),
                        risk_level=row.get("risk_level", "LOW"),
                        risk_score=float(row.get("risk_score", 18.5))
                    )
                    db.add(p)
                    seeded_projects += 1

        db.commit()
        print(f"[*] Seeded and committed {seeded_projects} national projects.")

        # 3. Seed Parcels from parcels.geojson
        parcels_file = os.path.join(data_dir, "parcels.geojson")
        seeded_parcels = 0
        if os.path.exists(parcels_file):
            with open(parcels_file, "r", encoding="utf-8") as f:
                geo_data = json.load(f)
                for feat in geo_data.get("features", []):
                    props = feat.get("properties", {})
                    geom = feat.get("geometry", {})
                    pid = props.get("parcel_id") or props.get("id") or f"P-{props.get('khasra_number', '0')}"
                    khasra = str(props.get("khasra_number") or props.get("khasra_no") or "1042")

                    area_val = 2.45 if khasra == "1042" else float(props.get("area_ha") or props.get("area") or 2.15)
                    parcel = Parcel(
                        id=pid,
                        project_id="NH-GJ-2026-001",
                        survey_number=khasra,
                        village=props.get("village", "Kuvadva"),
                        district="Surendranagar",
                        state="Gujarat",
                        area=area_val,
                        owner_count=int(props.get("owner_count", 1)),
                        primary_owner=props.get("owner_name") or "Rameshbhai Patel",
                        acquisition_status=props.get("acquisition_status", "NOTIFIED"),
                        compensation_status="DISPUTED" if khasra == "1042" else props.get("compensation_status", "PENDING"),
                        legal_status="STAYED" if khasra == "1042" else props.get("legal_status", "CLEAR"),
                        possession_status=props.get("possession_status", "PENDING"),
                        field_verification_status="MISMATCH" if khasra == "1042" else ("VERIFIED" if props.get("field_verified") else "PENDING"),
                        risk_level="CRITICAL" if khasra == "1042" else props.get("risk_level", "LOW").upper(),
                        geometry=json.dumps(geom) if geom else None,
                        is_public=True
                    )
                    db.add(parcel)
                    seeded_parcels += 1

        # Seed additional parcels for Maharashtra (MH-RAIL-2026-014) to test cross-state GIS filtering
        mh_parcels = [
            ("P-MH-501", "501", "Thane", "Thane", "Maharashtra", 3.2, "MH-RAIL-2026-014", [
                [[72.978, 19.218], [72.982, 19.219], [72.981, 19.223], [72.976, 19.221], [72.978, 19.218]]
            ]),
            ("P-MH-502", "502", "Thane", "Thane", "Maharashtra", 2.8, "MH-RAIL-2026-014", [
                [[72.982, 19.219], [72.986, 19.220], [72.985, 19.224], [72.981, 19.223], [72.982, 19.219]]
            ]),
        ]
        for p_id, s_no, vil, dist, st, ar, prj, coords in mh_parcels:
            db.add(Parcel(
                id=p_id, project_id=prj, survey_number=s_no, village=vil, district=dist, state=st,
                area=ar, acquisition_status="NOTIFIED", compensation_status="PENDING", legal_status="CLEAR",
                possession_status="PENDING", field_verification_status="PENDING", risk_level="MEDIUM",
                geometry=json.dumps({"type": "Polygon", "coordinates": coords}), is_public=True
            ))
            seeded_parcels += 1

        # Seed additional parcels for Ahmedabad (GJ-DHOL-2026-005) to test district GIS filtering
        ahmedabad_parcels = [
            ("P-GJ-201", "201", "Dholera", "Ahmedabad", "Gujarat", 4.5, "GJ-DHOL-2026-005", [
                [[72.195, 22.245], [72.199, 22.247], [72.198, 22.251], [72.193, 22.249], [72.195, 22.245]]
            ]),
            ("P-GJ-202", "202", "Dholera", "Ahmedabad", "Gujarat", 3.8, "GJ-DHOL-2026-005", [
                [[72.199, 22.247], [72.203, 22.248], [72.202, 22.252], [72.198, 22.251], [72.199, 22.247]]
            ]),
        ]
        for p_id, s_no, vil, dist, st, ar, prj, coords in ahmedabad_parcels:
            db.add(Parcel(
                id=p_id, project_id=prj, survey_number=s_no, village=vil, district=dist, state=st,
                area=ar, acquisition_status="ACQUIRED", compensation_status="PAID", legal_status="CLEAR",
                possession_status="COMPLETED", field_verification_status="VERIFIED", risk_level="LOW",
                geometry=json.dumps({"type": "Polygon", "coordinates": coords}), is_public=True
            ))
            seeded_parcels += 1

        db.commit()
        print(f"[*] Seeded and committed {seeded_parcels} irregular parcels with PostGIS GeoJSON polygons.")

        # 4. Seed Workflow Stages for NH-GJ-2026-001
        stages_data = [
            ("Proposal", 1, "2024-01-15", "2024-03-31", "2024-01-15", "2024-03-25", "COMPLETED", 0),
            ("Scrutiny", 2, "2024-04-01", "2024-05-31", "2024-04-02", "2024-05-28", "COMPLETED", 0),
            ("Approval", 3, "2024-06-01", "2024-07-31", "2024-06-01", "2024-08-15", "COMPLETED", 15),
            ("Notification", 4, "2024-08-16", "2024-10-31", "2024-08-20", "2024-11-20", "COMPLETED", 20),
            ("Objection", 5, "2024-11-21", "2025-01-31", "2024-11-21", "2025-02-15", "COMPLETED", 15),
            ("Award", 6, "2025-02-16", "2025-06-30", "2025-02-20", None, "IN_PROGRESS", 45),
            ("Compensation", 7, "2025-07-01", "2025-11-30", None, None, "PENDING", 0),
            ("R&R", 8, "2025-12-01", "2026-04-30", None, None, "PENDING", 0),
            ("Possession", 9, "2026-05-01", "2026-10-31", None, None, "PENDING", 0),
            ("Closure", 10, "2026-11-01", "2027-03-31", None, None, "PENDING", 0)
        ]
        for name, order, p_start, p_end, a_start, a_end, status, delay in stages_data:
            ws = WorkflowStage(
                id=f"WS-{order:02d}",
                project_id="NH-GJ-2026-001",
                stage=name,
                stage_order=order,
                planned_start=p_start,
                planned_end=p_end,
                actual_start=a_start,
                actual_end=a_end,
                status=status,
                delay_days=delay,
                responsible_officer="SLAO Rajkot",
                remarks=f"Stage {name} statutory progress under RFCTLARR 2013"
            )
            db.add(ws)
        db.commit()
        print("[*] Seeded and committed 10 workflow stages.")

        # 5. Seed Field Inspection Tasks
        demo_tasks = [
            InspectionTask(
                id="TSK-1042-01",
                inspection_code="FO-1042-001",
                project_id="NH-GJ-2026-001",
                parcel_id="P-1042",
                khasra_number="1042",
                village="Limbdi",
                district="Surendranagar",
                area_ha=2.45,
                assigned_officer_id="FO-007",
                priority="HIGH",
                reason="Compensation verification and boundary demarcation",
                assigned_date="2026-03-01",
                due_date="2026-03-25",
                status="PENDING"
            ),
            InspectionTask(
                id="TSK-1039-01",
                inspection_code="FO-1039-001",
                project_id="NH-GJ-2026-001",
                parcel_id="P-1039",
                khasra_number="1039",
                village="Limbdi",
                district="Surendranagar",
                area_ha=1.85,
                assigned_officer_id="FO-007",
                priority="MEDIUM",
                reason="Routine cadastral ground survey",
                assigned_date="2026-03-02",
                due_date="2026-03-28",
                status="PENDING"
            ),
            InspectionTask(
                id="TSK-1040-01",
                inspection_code="FO-1040-001",
                project_id="NH-GJ-2026-001",
                parcel_id="P-1040",
                khasra_number="1040",
                village="Limbdi",
                district="Surendranagar",
                area_ha=3.10,
                assigned_officer_id="FO-007",
                priority="CRITICAL",
                reason="Encroachment investigation",
                assigned_date="2026-03-03",
                due_date="2026-03-20",
                status="IN_PROGRESS"
            ),
            InspectionTask(
                id="TSK-1043-01",
                inspection_code="FO-1043-001",
                project_id="NH-GJ-2026-001",
                parcel_id="P-1043",
                khasra_number="1043",
                village="Limbdi",
                district="Surendranagar",
                area_ha=1.92,
                assigned_officer_id="FO-007",
                priority="HIGH",
                reason="Owner objection hearing ground check",
                assigned_date="2026-03-05",
                due_date="2026-03-30",
                status="PENDING"
            )
        ]
        for t in demo_tasks:
            db.add(t)
        db.commit()
        print(f"[*] Seeded and committed {len(demo_tasks)} field inspection tasks.")

        # 6. Seed Demo Completed Inspection for history/reference
        demo_insp = FieldInspection(
            id="INSP-1042-001",
            inspection_code="FO-1042-001",
            task_id="TSK-1042-01",
            project_id="NH-GJ-2026-001",
            parcel_id="P-1042",
            officer_id="FO-007",
            officer_name="Vikram Patel",
            started_at=datetime(2026, 3, 10, 10, 30),
            submitted_at=datetime(2026, 3, 10, 12, 15),
            latitude=22.5694,
            longitude=71.8083,
            gps_accuracy=4.2,
            gps_verified=True,
            distance_meters=12.5,
            khasra_expected="1042",
            khasra_observed="1042",
            khasra_matched=True,
            boundary_status="MISMATCH",
            land_use_recorded="Agricultural",
            land_use_observed="Agricultural",
            land_use_matched=True,
            crop_type="Cotton / Groundnut",
            structure_present=False,
            encroachment_status="NO",
            occupancy_status="OWNER_CULTIVATED",
            person_present="Rameshbhai Patel (Owner)",
            compensation_status="AWARD_DECLARED",
            compensation_issue="Amount dispute - claims higher circle rate",
            objection_status="FILED",
            dispute_type="Owner dispute",
            rr_required=False,
            rr_status="NOT_APPLICABLE",
            remarks="Ground demarcation needed with DILR surveyor.",
            status="SUBMITTED"
        )
        db.add(demo_insp)
        db.commit()

        # Photos for demo inspection
        demo_photos = [
            InspectionPhoto(
                id="PHO-001", photo_id="PHO-001", inspection_id="INSP-1042-001",
                project_id="NH-GJ-2026-001", parcel_id="P-1042",
                category="BOUNDARY", file_name="khasra_1042_boundary_peg.jpg",
                file_path="/uploads/khasra_1042_boundary_peg.jpg",
                latitude=22.5694, longitude=71.8083, gps_available=True, uploaded_by="FO-007"
            ),
            InspectionPhoto(
                id="PHO-002", photo_id="PHO-002", inspection_id="INSP-1042-001",
                project_id="NH-GJ-2026-001", parcel_id="P-1042",
                category="LAND_CROP", file_name="khasra_1042_crop_standing.jpg",
                file_path="/uploads/khasra_1042_crop_standing.jpg",
                latitude=22.5696, longitude=71.8085, gps_available=True, uploaded_by="FO-007"
            ),
            InspectionPhoto(
                id="PHO-003", photo_id="PHO-003", inspection_id="INSP-1042-001",
                project_id="NH-GJ-2026-001", parcel_id="P-1042",
                category="SURVEY_MARKER", file_name="khasra_1042_stone_pillar.jpg",
                file_path="/uploads/khasra_1042_stone_pillar.jpg",
                latitude=22.5692, longitude=71.8081, gps_available=True, uploaded_by="FO-007"
            )
        ]
        for ph in demo_photos:
            db.add(ph)

        # Issues for demo inspection
        demo_issues = [
            InspectionIssue(
                id="ISS-001", inspection_id="INSP-1042-001", project_id="NH-GJ-2026-001",
                parcel_id="P-1042", issue_type="BOUNDARY_MISMATCH", severity="HIGH",
                description="Southern boundary shows 12m discrepancy with revenue map.", status="OPEN"
            ),
            InspectionIssue(
                id="ISS-002", inspection_id="INSP-1042-001", project_id="NH-GJ-2026-001",
                parcel_id="P-1042", issue_type="COMPENSATION_ISSUE", severity="HIGH",
                description="Owner dispute: demands commercial circle rate instead of agricultural.", status="OPEN"
            )
        ]
        for iss in demo_issues:
            db.add(iss)

        # Checklist for demo inspection
        db.add(InspectionChecklist(
            id="CHK-1042-01", inspection_id="INSP-1042-001",
            boundary_visible=True, survey_marker_available=True,
            land_use_verified=True, area_consistent=False,
            notice_received=True, owner_verified=True,
            compensation_discussed=True, possession_checked=True,
            affected_family_verified=True, rr_checked=True,
            survey_number_checked=True, field_evidence_captured=True
        ))

        # 7. Seed Compensation & Legal & R&R records
        db.add(CompensationRecord(
            id="CMP-001", project_id="NH-GJ-2026-001", parcel_id="P-1042",
            beneficiary_name="Rameshbhai Patel", award_amount=1850000.0, disbursed_amount=0.0,
            status="DISPUTED", payment_mode="DBT / RTGS", issue_reported="Circle rate revision demanded"
        ))
        db.add(LegalCase(
            id="LEG-001", project_id="NH-GJ-2026-001", parcel_id="P-1042",
            court_name="High Court of Gujarat", case_number="SCA/1420/2025",
            dispute_category="COMPENSATION_ENHANCEMENT", stay_granted=False,
            status="PENDING", remarks="Hearing scheduled on circle rate valuation"
        ))
        db.add(RRRecord(
            id="RR-001", project_id="NH-GJ-2026-001",
            family_head="Rameshbhai Patel", entitlement_type="HOUSING",
            status="SURVEYED", resettlement_site="Limbdi Model Colony Plot 14"
        ))

        # 8. Seed Initial Alert and Recommendation
        db.add(RiskAlert(
            id="ALT-INIT-001", project_id="NH-GJ-2026-001", parcel_id="P-1042",
            inspection_id="INSP-1042-001", severity="HIGH",
            title="HIGH PRIORITY FIELD ISSUE - Khasra 1042",
            message="Boundary mismatch and compensation grievance reported by FO-007 on Parcel 1042.",
            delay_days=45, assigned_to="District Land Officer", status="ACTIVE"
        ))
        db.add(Recommendation(
            id="REC-INIT-001", project_id="NH-GJ-2026-001", parcel_id="P-1042",
            recommendation="Initiate Joint Cadastral GIS Demarcation for Parcel 1042",
            reason="Ground inspection identified 12m boundary discrepancy with revenue map.",
            priority="CRITICAL", assigned_to="SLAO / Competent Authority",
            due_date="2026-03-31", status="OPEN"
        ))

        # 9. Seed Public Notices
        demo_notices = [
            PublicNotice(
                id="NOT-001",
                project_id="NH-GJ-2026-001",
                title="Section 11(1) Preliminary Notification - Ahmedabad-Rajkot Green Expressway",
                notice_type="ACQUISITION_NOTICE",
                state="Gujarat",
                district="Surendranagar",
                issue_date="2025-04-10",
                summary="Notification under Section 11 of RFCTLARR Act 2013 for acquisition of land in Limbdi and Chotila talukas.",
                file_path="/notices/sec11_ahmedabad_rajkot.pdf",
                is_public=True
            ),
            PublicNotice(
                id="NOT-002",
                project_id="NH-GJ-2026-001",
                title="Public Hearing Notification on Social Impact Assessment (SIA) Report",
                notice_type="PUBLIC_HEARING",
                state="Gujarat",
                district="Surendranagar",
                issue_date="2025-06-15",
                summary="Public hearing scheduled at Taluka Panchayat Hall, Limbdi for affected landholders and residents.",
                file_path="/notices/sia_hearing_limbdi.pdf",
                is_public=True
            ),
            PublicNotice(
                id="NOT-003",
                project_id="NH-GJ-2026-001",
                title="Declaration of Summary Award under Section 23/30 - Khasra 1040 to 1055",
                notice_type="AWARD_NOTICE",
                state="Gujarat",
                district="Surendranagar",
                issue_date="2025-11-20",
                summary="Competent authority award declared. Affected landowners advised to submit bank details for DBT disbursement.",
                file_path="/notices/award_declaration_1040_1055.pdf",
                is_public=True
            ),
            PublicNotice(
                id="NOT-004",
                project_id="GJ-DHOL-2026-005",
                title="R&R Entitlement Matrix and Allotment of Resettlement Plots - Dholera SIR Link",
                notice_type="RR_NOTICE",
                state="Gujarat",
                district="Ahmedabad",
                issue_date="2025-08-01",
                summary="Final list of eligible displaced families for alternate housing allotment at Dholera Model Resettlement Colony.",
                file_path="/notices/rr_allotment_dholera.pdf",
                is_public=True
            ),
            PublicNotice(
                id="NOT-005",
                project_id="MH-RAIL-2026-014",
                title="Section 11 Preliminary Notification - High-Speed Rail Corridor Thane Section",
                notice_type="ACQUISITION_NOTICE",
                state="Maharashtra",
                district="Thane",
                issue_date="2024-10-15",
                summary="Statutory land acquisition notice under RFCTLARR for High Speed Rail Corridor alignment in Thane district.",
                file_path="/notices/sec11_thane_rail.pdf",
                is_public=True
            ),
        ]
        for n in demo_notices:
            db.add(n)

        # 10. Seed Audit Logs
        db.add(AuditLog(
            user="SYSTEM", role="ADMIN", action="DATABASE_SEED",
            entity="SYSTEM", entity_id="ALL", new_value="Seeded N-LAMS initial demo database"
        ))

        db.commit()
        print("[*] Successfully committed all seeded data to PostgreSQL database!")
        print("    - 5 RBAC Users (Central Admin, State, District, Field Officer FO-007, Viewer)")
        print(f"    - {seeded_projects} Projects (Hero: NH-GJ-2026-001)")
        print(f"    - {seeded_parcels} Irregular Cadastral Parcels (Hero: Khasra 1042)")
        print("    - 10 Statutory Workflow Stages")
        print(f"    - {len(demo_tasks)} Field Inspection Tasks")
        print("    - 1 Completed Demo Inspection (INSP-1042-001) with ground evidence")
        print("    - Compensation, Legal, R&R records, Risk Alerts, Recommendations, Audit logs")

    except Exception as e:
        db.rollback()
        print(f"[!] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
