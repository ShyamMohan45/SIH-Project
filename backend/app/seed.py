import os
import sys
import json
import csv
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.app.database import engine, Base, SessionLocal
from backend.app.models.models import (
    User, Project, Parcel, WorkflowStage, CompensationRecord,
    RRRecord, LegalCase, DocumentRecord, RiskAlert, AuditLog,
    InspectionTask, FieldInspection, InspectionPhoto, InspectionIssue, FieldGPSLog
)

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
data_dir = os.path.join(root_dir, "data")

def seed_database():
    print("Dropping and recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Users
        users_file = os.path.join(data_dir, "users.csv")
        if os.path.exists(users_file):
            with open(users_file, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    u = User(
                        id=row["id"],
                        name=row["name"],
                        email=row["email"],
                        role=row["role"],
                        department=row["department"],
                        state=row["state"],
                        district=row["district"]
                    )
                    db.add(u)
            print("Seeded Users.")

        # 2. Seed Projects
        projects_file = os.path.join(data_dir, "projects.csv")
        if os.path.exists(projects_file):
            with open(projects_file, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    p = Project(
                        id=row["id"],
                        project_code=row["project_code"],
                        name=row["name"],
                        project_type=row["project_type"],
                        state=row["state"],
                        district=row["district"],
                        land_required=float(row["land_required"]),
                        land_acquired=float(row["land_acquired"]),
                        affected_families=int(row["affected_families"]),
                        displaced_families=int(row["displaced_families"]),
                        start_date=row["start_date"],
                        target_date=row["target_date"],
                        current_stage=row["current_stage"],
                        status=row["status"],
                        compensation_assessed_cr=float(row["compensation_assessed_cr"]),
                        compensation_disbursed_cr=float(row["compensation_disbursed_cr"]),
                        rr_completed_families=int(row["rr_completed_families"]),
                        possession_ha=float(row["possession_ha"]),
                        legal_cases=int(row["legal_cases"]),
                        risk_level=row["risk_level"],
                        risk_score=float(row["risk_score"]),
                        predicted_delay_days=74 if row["id"] == "NH-GJ-2026-001" else (45 if float(row["risk_score"]) > 70 else 12)
                    )
                    db.add(p)
            print("Seeded Projects.")

        # 3. Seed Parcels from parcels.geojson
        parcels_file = os.path.join(data_dir, "parcels.geojson")
        if os.path.exists(parcels_file):
            with open(parcels_file, "r", encoding="utf-8") as f:
                geo = json.load(f)
                for feat in geo.get("features", []):
                    props = feat["properties"]
                    geom = feat["geometry"]
                    par = Parcel(
                        id=props["parcel_id"],
                        project_id=props["project_id"],
                        survey_number=props["survey_number"],
                        khasra_number=props["khasra_number"],
                        village=props["village"],
                        taluka=props["taluka"],
                        district=props["district"],
                        state=props["state"],
                        area_ha=float(props["area_ha"]),
                        land_type=props["land_type"],
                        owner_name=props["owner_name"],
                        owner_count=props["owner_count"],
                        acquisition_status=props["acquisition_status"],
                        compensation_status=props["compensation_status"],
                        compensation_assessed=float(props["compensation_assessed"]),
                        compensation_paid=float(props["compensation_paid"]),
                        legal_status=props["legal_status"],
                        legal_case_no=props["legal_case_no"],
                        possession_status=props["possession_status"],
                        risk_level=props["risk_level"],
                        ai_risk_score=float(props["ai_risk_score"]),
                        field_verified=props["field_verified"],
                        field_verified_date=props["field_verified_date"],
                        field_officer=props["field_officer"],
                        gps_lat=props.get("gps_lat"),
                        gps_lng=props.get("gps_lng"),
                        geometry=geom
                    )
                    db.add(par)
            print("Seeded Parcels from GeoJSON.")

        # 4. Seed 10-Stage Workflow for NH-GJ-2026-001
        stages_info = [
            (1, "Proposal", "Requiring Body (NHAI)", "2025-04-01", "2025-04-20", "2025-04-01", "2025-04-18", "COMPLETED", 0, "DPR verified and submitted"),
            (2, "Scrutiny", "District Scrutiny Cell", "2025-04-21", "2025-05-15", "2025-04-21", "2025-05-12", "COMPLETED", 0, "All boundary alignment checks cleared"),
            (3, "Approval", "State Revenue Dept / Cabinet", "2025-05-16", "2025-06-30", "2025-05-16", "2025-06-25", "COMPLETED", 0, "Administrative Sanction issued"),
            (4, "Notification", "Gazette Authority", "2025-07-01", "2025-08-15", "2025-07-01", "2025-08-10", "COMPLETED", 0, "RFCTLARR Section 11 notice published"),
            (5, "Objection", "District Legal Cell / DM", "2025-08-16", "2025-10-31", "2025-08-16", "2025-11-20", "DELAYED", 20, "18 landowner rate multiplier disputes filed"),
            (6, "Award", "Acquisition Collectorate", "2025-11-01", "2026-01-31", "2025-11-21", "2026-02-15", "DELAYED", 15, "Section 23 award declared for 910 parcels"),
            (7, "Compensation", "Finance / PFMS Nodal", "2026-02-01", "2026-05-31", "2026-02-16", None, "IN_PROGRESS", 28, "₹690 Cr paid of ₹850 Cr (Pending backlog)"),
            (8, "R&R", "R&R Administrator", "2026-04-01", "2026-08-31", "2026-04-10", None, "IN_PROGRESS", 0, "1,890 of 2,400 packages disbursed"),
            (9, "Possession", "Revenue Collectorate", "2026-06-01", "2026-11-30", "2026-06-15", None, "IN_PROGRESS", 0, "980 of 1,250 ha handed over"),
            (10, "Closure", "MoRD / Central Admin", "2026-12-01", "2027-03-31", None, None, "PENDING", 0, "Final milestone audit pending")
        ]

        for s_num, name, dept, p_start, p_end, a_start, a_end, st, del_d, rem in stages_info:
            ws = WorkflowStage(
                project_id="NH-GJ-2026-001",
                stage_number=s_num,
                stage_name=name,
                responsible_dept=dept,
                planned_start=p_start,
                planned_end=p_end,
                actual_start=a_start,
                actual_end=a_end,
                status=st,
                delay_days=del_d,
                remarks=rem
            )
            db.add(ws)

        # 5. Seed Legal Cases
        legal_cases_data = [
            ("LEG-2026-0042", "NH-GJ-2026-001", "P-1042", "Suresh & Bhavesh Patel", "Rate Multiplier & Solatium Dispute", "2025-09-12", "Gujarat High Court", "Open", "2026-09-28", "District Legal Officer", "High"),
            ("LEG-2026-0045", "NH-GJ-2026-001", "P-1045", "Ramesh Patel & Heirs", "Joint Family Khata Mutation Dispute", "2025-10-04", "Collectorate Tribunal", "Under Review", "2026-09-20", "Tehsildar Legal Cell", "High"),
            ("LEG-2026-0051", "NH-GJ-2026-001", "P-1051", "Kuvadva Gram Panchayat", "Gauchar (Pasture) Reclassification", "2025-08-28", "District Collectorate", "Resolved", "2026-08-15", "District Collector", "Medium")
        ]
        for cid, pid, parid, cl, ctype, fdate, forum, cstat, nhear, roff, rimp in legal_cases_data:
            lc = LegalCase(
                id=cid, project_id=pid, parcel_id=parid, claimant_name=cl, case_type=ctype,
                filed_date=fdate, court_forum=forum, current_status=cstat, next_hearing_date=nhear,
                responsible_officer=roff, risk_impact=rimp
            )
            db.add(lc)

        # 6. Seed Compensation Records
        comp_records = [
            ("CMP-1041", "NH-GJ-2026-001", "P-1041", "Ramesh Bhai Patel", "SBIN0004210", 4560000, 4560000, 4560000, "Paid", "PFMS-2026-9041", "2026-03-15"),
            ("CMP-1042", "NH-GJ-2026-001", "P-1042", "Suresh & Bhavesh Patel", "HDFC0001924", 4560000, 4560000, 0, "Pending", None, None),
            ("CMP-1043", "NH-GJ-2026-001", "P-1043", "Kantilal J. Prajapati", "BARB0RAJKOT", 3800000, 3800000, 3800000, "Paid", "PFMS-2026-9043", "2026-04-10"),
            ("CMP-1045", "NH-GJ-2026-001", "P-1045", "Ramesh Patel Heirs", "SBIN0001882", 3800000, 3800000, 0, "Disputed", None, None)
        ]
        for cid, pid, parid, bname, bacc, ass, app, disb, st, pref, ddate in comp_records:
            cr = CompensationRecord(
                id=cid, project_id=pid, parcel_id=parid, beneficiary_name=bname,
                bank_account_masked=bacc, assessed_inr=ass, approved_inr=app,
                disbursed_inr=disb, status=st, pfms_ref=pref, disbursed_date=ddate
            )
            db.add(cr)

        # 7. Seed Documents
        doc_records = [
            ("DOC-001", "NH-GJ-2026-001", "DPR", "NH_GJ_2026_DPR_Final.pdf", "uploads/dpr_001.pdf", "v1.2", "State Officer", "a7f3b8921e4c70d", "Verified"),
            ("DOC-002", "NH-GJ-2026-001", "Survey Map", "Kuvadva_Cadastral_Survey_Grid.pdf", "uploads/survey_001.pdf", "v2.0", "District Collectorate", "c491e0a29f821d4", "Verified"),
            ("DOC-003", "NH-GJ-2026-001", "Notification", "Gazette_Sec11_Notification_Draft.pdf", "uploads/gazette_001.pdf", "v1.0", "Acquisition Officer", "e8812c3091b29a1", "Verified"),
            ("DOC-004", "NH-GJ-2026-001", "Award", "Section23_Collector_Award_Order.pdf", "uploads/award_001.pdf", "v1.0", "District Magistrate", "f1048291a27b301", "Verified")
        ]
        for did, pid, dtype, fname, spath, ver, upby, chash, st in doc_records:
            dr = DocumentRecord(
                id=did, project_id=pid, document_type=dtype, file_name=fname,
                storage_path=spath, version=ver, uploaded_by=upby, checksum=chash, status=st
            )
            db.add(dr)

        # 8. Seed Risk Alerts
        alerts_data = [
            ("ALT-001", "NH-GJ-2026-001", "Critical Acquisition Delay Alert", "CRITICAL", "Project NH-GJ-2026-001 delay risk reached 82%. Section 15 objection rate & PFMS compensation backlog triggering automated SLA violation.", 74, "ACTIVE"),
            ("ALT-002", "MH-RAIL-2026-014", "Forest Clearances Escalation Required", "HIGH", "Stage 5 Objection hearings delayed by 62 days in Thane collectorate.", 62, "ACTIVE"),
            ("ALT-003", "UP-EXP-2026-022", "High Court Stay on Gazette Notification", "CRITICAL", "38 legal disputes filed across Prayagraj and Varanasi sectors.", 88, "ACTIVE")
        ]
        for aid, pid, title, sev, msg, ddays, st in alerts_data:
            ra = RiskAlert(
                id=aid, project_id=pid, title=title, severity=sev,
                message=msg, delay_days=ddays, status=st
            )
            db.add(ra)

        # 9. Seed Audit Logs
        audit_records = [
            ("Vikramaditya Solanki", "DISTRICT_OFFICER", "VERIFY_PARCEL", "Parcel", "P-1042", "Unverified", "Verified with GPS (23.0225, 72.5714)"),
            ("Pooja Vaghela", "STATE_OFFICER", "SUBMIT_REQUISITION", "Project", "NH-GJ-2026-001", "Draft", "Submitted to Central DoLR"),
            ("Dr. Rajesh Sharma", "CENTRAL_ADMIN", "APPROVE_PROJECT", "Project", "NH-GJ-2026-001", "Submitted", "Approved for Gazette Publication"),
            ("ML_ENGINE_CRON", "SYSTEM", "GENERATE_PREDICTION", "RiskEngine", "NH-GJ-2026-001", "61% MEDIUM", "82% HIGH RISK (PS17 Detection)")
        ]
        # 10. Seed Field Inspection Tasks (8 tasks: 5 pending, 3 completed, 2 high/critical priority)
        tasks_data = [
            ("TASK-FO-1042", "FO-1042", "NH-GJ-2026-001", "P-1042", "1042", "Limbdi", "Rajkot", 2.45, "field.surveyor@nlams.gov.in", "2026-03-12", "2026-03-15", None, "HIGH", "Compensation pending, previous verification incomplete, AI risk 78%", "PENDING"),
            ("TASK-FO-1038", "FO-1038", "NH-GJ-2026-001", "P-1038", "1038", "Ralol", "Rajkot", 3.10, "field.surveyor@nlams.gov.in", "2026-03-12", "2026-03-16", None, "MEDIUM", "Routine joint cadastral survey & marker check", "PENDING"),
            ("TASK-FO-1039", "FO-1039", "NH-GJ-2026-001", "P-1039", "1039", "Ralol", "Rajkot", 1.85, "field.surveyor@nlams.gov.in", "2026-03-12", "2026-03-16", None, "LOW", "Boundary check post notification 3A", "PENDING"),
            ("TASK-FO-1045", "FO-1045", "NH-GJ-2026-001", "P-1045", "1045", "Bamanbore", "Rajkot", 4.20, "field.surveyor@nlams.gov.in", "2026-03-12", "2026-03-14", None, "HIGH", "Tree and well valuation re-measurement", "PENDING"),
            ("TASK-FO-1048", "FO-1048", "NH-GJ-2026-001", "P-1048", "1048", "Sayla Rural", "Surendranagar", 2.90, "field.surveyor@nlams.gov.in", "2026-03-12", "2026-03-13", None, "CRITICAL", "Disputed agricultural classification", "PENDING"),
            ("TASK-FO-1040", "FO-1040", "NH-GJ-2026-001", "P-1040", "1040", "Ralol", "Rajkot", 2.10, "field.surveyor@nlams.gov.in", "2026-03-08", "2026-03-10", "2026-03-09", "MEDIUM", "Boundary verification", "COMPLETED"),
            ("TASK-FO-1041", "FO-1041", "NH-GJ-2026-001", "P-1041", "1041", "Ralol", "Rajkot", 1.95, "field.surveyor@nlams.gov.in", "2026-03-09", "2026-03-11", "2026-03-10", "LOW", "Cultivation status verification", "COMPLETED"),
            ("TASK-FO-1037", "FO-1037", "NH-GJ-2026-001", "P-1037", "1037", "Ralol", "Rajkot", 3.40, "field.surveyor@nlams.gov.in", "2026-03-07", "2026-03-09", "2026-03-08", "MEDIUM", "Pre-acquisition boundary check", "COMPLETED"),
        ]
        for tid, tcode, pid, prid, kno, vil, dst, area, offid, adate, ddate, cdate, prio, rsn, st in tasks_data:
            it = InspectionTask(
                id=tid, task_code=tcode, project_id=pid, parcel_id=prid,
                khasra_number=kno, village=vil, district=dst, area_ha=area,
                officer_id=offid, assigned_date=adate, due_date=ddate,
                completed_date=cdate, priority=prio, reason=rsn, status=st
            )
            db.add(it)

        # 11. Seed Previous Completed Inspection Dossier for FO-1040
        prev_insp = FieldInspection(
            id="INSP-FO-1040",
            inspection_code="FO-1040-2026-001",
            task_id="TASK-FO-1040",
            project_id="NH-GJ-2026-001",
            parcel_id="P-1040",
            officer_id="field.surveyor@nlams.gov.in",
            officer_name="Ramesh Patel (Cadastral Surveyor)",
            started_at=datetime(2026, 3, 9, 10, 15),
            submitted_at=datetime(2026, 3, 9, 11, 45),
            latitude=22.3785,
            longitude=71.3082,
            gps_accuracy=6.2,
            gps_verified=True,
            gps_mode="REAL",
            distance_from_parcel_m=8.4,
            location_matched=True,
            khasra_expected="1040",
            khasra_observed="1040",
            khasra_matched=True,
            land_use="Agricultural",
            crop_type="Wheat / Cotton",
            occupancy_status="Owner Present",
            occupant_name="Jayeshbhai Patel",
            occupant_relation="Owner",
            encroachment_status="No",
            encroachment_type="None",
            checklist_data={
                "boundary_visible": "Yes",
                "survey_marker": "Yes",
                "land_area_consistent": "Yes",
                "access_road": "Yes",
                "land_use_verified": "Yes",
                "owner_present": "Yes",
                "cultivation_observed": "Yes",
                "structure_present": "No",
                "encroachment_observed": "No",
                "notice_received": "Yes",
                "objection_raised": "No",
                "compensation_discussed": "Yes",
                "possession_verified": "Yes",
                "affected_family_verified": "Yes",
                "resettlement_required": "No",
                "livelihood_impact": "Yes"
            },
            remarks="Boundary and survey stones verified in presence of talati. Crop cultivation active. No encroachment observed.",
            officer_confirmed=True,
            status="Approved"
        )
        db.add(prev_insp)

        # Photo for FO-1040
        photo_1040 = InspectionPhoto(
            id="PH-1040-1",
            inspection_id="INSP-FO-1040",
            parcel_id="P-1040",
            project_id="NH-GJ-2026-001",
            category="Parcel Boundary",
            file_url="/photos/survey_marker_1040.jpg",
            file_name="Boundary_Marker_1040.jpg",
            latitude=22.3785,
            longitude=71.3082,
            timestamp="2026-03-09 10:30:14",
            uploaded_by="field.surveyor@nlams.gov.in"
        )
        db.add(photo_1040)

        # 12. Seed Demonstration Inspection Dossier for Khasra 1042
        insp_1042 = FieldInspection(
            id="INSP-FO-1042",
            inspection_code="FO-1042-2026-001",
            task_id="TASK-FO-1042",
            project_id="NH-GJ-2026-001",
            parcel_id="P-1042",
            officer_id="field.surveyor@nlams.gov.in",
            officer_name="Amit B. Parmar (Cadastral Surveyor)",
            started_at=datetime(2026, 3, 11, 14, 20),
            submitted_at=datetime(2026, 3, 11, 15, 35),
            latitude=22.3862,
            longitude=71.0676,
            gps_accuracy=4.2,
            gps_verified=True,
            gps_mode="DEMO_SIMULATED",
            distance_from_parcel_m=11.5,
            location_matched=True,
            khasra_expected="1042",
            khasra_observed="1042",
            khasra_matched=True,
            boundary_status="Mismatch",
            boundary_remarks="Discrepancy of ~12 meters observed on Eastern boundary abutting local cart-track. Fencing encroaches on right-of-way.",
            land_use="Agricultural",
            land_use_recorded="Agricultural",
            land_use_observed="Agricultural (Cotton / Groundnut)",
            land_use_matched=True,
            crop_type="Irrigated Cotton",
            structure_present="Yes",
            structure_type="Borewell Shed & Irrigation Pump",
            structure_count=1,
            encroachment_status="Yes",
            encroachment_type="Fencing onto right-of-way",
            occupancy_status="Owner Present",
            occupant_name="Suresh & Bhavesh Patel",
            occupant_relation="Joint Owners",
            compensation_status="Issue Reported",
            compensation_confirmed="Yes",
            compensation_issue="Demanding 2026 commercial solatium rate instead of 2024 agricultural benchmark.",
            objection_status="Yes",
            dispute_type="Owner Dispute & Compensation Rate Grievance",
            dispute_severity="High",
            dispute_description="Co-sharers have pending partition suit in Limbdi Civil Court and High Court writ petition (LEG-2026-0042).",
            rr_status="Pending",
            checklist_data={
                "boundary_visible": "Yes",
                "survey_marker": "Yes",
                "land_area_consistent": "Mismatch",
                "access_road": "Yes",
                "land_use_verified": "Yes",
                "owner_present": "Yes",
                "cultivation_observed": "Yes",
                "structure_present": "Yes",
                "encroachment_observed": "Yes",
                "notice_received": "Yes",
                "objection_raised": "Yes",
                "compensation_discussed": "Yes",
                "possession_verified": "Pending Dispute",
                "affected_family_verified": "Yes",
                "resettlement_required": "Yes",
                "livelihood_impact": "Critical"
            },
            remarks="Landowner Suresh Patel present on-site. Survey stones verified; however, eastern boundary shows 12m overlap with road reservation. Landowner refused physical possession notice citing pending compensation dispute in High Court.",
            officer_confirmed=True,
            status="Submitted for Review"
        )
        db.add(insp_1042)

        # Photos for FO-1042
        photos_1042 = [
            ("PH-1042-1", "INSP-FO-1042", "P-1042", "NH-GJ-2026-001", "Survey/Khasra Marker", "/uploads/field_photos/khasra_marker_1042.jpg", "Khasra_Marker_1042.jpg", 22.3862, 71.0676, "2026-03-11 14:32:10"),
            ("PH-1042-2", "INSP-FO-1042", "P-1042", "NH-GJ-2026-001", "Parcel Boundary", "/uploads/field_photos/boundary_mismatch_1042.jpg", "Boundary_Eastern_Fence.jpg", 22.3865, 71.0679, "2026-03-11 14:45:22"),
            ("PH-1042-3", "INSP-FO-1042", "P-1042", "NH-GJ-2026-001", "Crop/Land Condition", "/uploads/field_photos/crop_cotton_1042.jpg", "Cotton_Crop_Standing.jpg", 22.3860, 71.0672, "2026-03-11 14:58:05"),
            ("PH-1042-4", "INSP-FO-1042", "P-1042", "NH-GJ-2026-001", "Structure", "/uploads/field_photos/borewell_pump_1042.jpg", "Borewell_Pump_Shed.jpg", 22.3863, 71.0674, "2026-03-11 15:10:40")
        ]
        for pid, inid, prid, pjid, cat, furl, fname, lat, lng, tstamp in photos_1042:
            db.add(InspectionPhoto(
                id=pid, inspection_id=inid, parcel_id=prid, project_id=pjid,
                category=cat, file_url=furl, file_name=fname,
                latitude=lat, longitude=lng, timestamp=tstamp,
                uploaded_by="field.surveyor@nlams.gov.in"
            ))

        # Issues for FO-1042
        issues_1042 = [
            ("ISSUE-1042-1", "INSP-FO-1042", "NH-GJ-2026-001", "P-1042", "Boundary mismatch", "High", "Eastern boundary fencing encroaches 12 meters into highway alignment right-of-way."),
            ("ISSUE-1042-2", "INSP-FO-1042", "NH-GJ-2026-001", "P-1042", "Compensation issue", "Critical", "Owners dispute agricultural classification, demand commercial rate and solatium batch disbursement."),
            ("ISSUE-1042-3", "INSP-FO-1042", "NH-GJ-2026-001", "P-1042", "Owner dispute", "High", "Joint co-sharer partition dispute pending in High Court (Case LEG-2026-0042).")
        ]
        for iid, inid, pjid, prid, ityp, sev, desc in issues_1042:
            db.add(InspectionIssue(
                id=iid, inspection_id=inid, project_id=pjid, parcel_id=prid,
                issue_type=ityp, severity=sev, description=desc
            ))

        db.commit()
        print("Database seeding completed successfully with Field Inspection models!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
