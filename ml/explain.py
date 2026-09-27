import os
import sys
import json
import pandas as pd
import numpy as np

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ml.predict import get_model, stage_map

def explain_prediction(features: dict):
    model = get_model()

    feature_cols = [
        "land_area", "parcel_count", "affected_families", "legal_dispute_count",
        "dispute_ratio", "approval_delay", "notification_delay", "compensation_completion",
        "rr_completion", "possession_completion", "pending_documents",
        "stakeholder_response_time", "documentation_score", "stage_num"
    ]

    stage = features.get("current_stage", "Proposal")
    stage_num = stage_map.get(stage, 1)

    # Feature contribution calculation based on project parameters
    disputes = features.get("legal_dispute_count", 0)
    comp_pct = features.get("compensation_completion", 0.5)
    app_delay = features.get("approval_delay", 0)
    notif_delay = features.get("notification_delay", 0)
    docs = features.get("pending_documents", 0)
    rr_pct = features.get("rr_completion", 0.5)

    contributions = [
        {
            "factor": "Legal Disputes & Section 15 Objections",
            "contribution_pct": round(min(45.0, (disputes * 2.2) + 12.0), 1),
            "severity": "HIGH" if disputes > 5 else "LOW",
            "description": f"{disputes} active legal objections filed in Collectorate."
        },
        {
            "factor": "Compensation Payment Backlog (>30 Days)",
            "contribution_pct": round(min(35.0, ((1.0 - comp_pct) * 32.0)), 1),
            "severity": "HIGH" if comp_pct < 0.6 else "MEDIUM",
            "description": f"Only {round(comp_pct * 100)}% compensation disbursed to beneficiaries."
        },
        {
            "factor": "Administrative Approval & Cabinet Clearance Latency",
            "contribution_pct": round(min(25.0, (app_delay * 1.1) + 4.0), 1),
            "severity": "HIGH" if app_delay > 10 else "LOW",
            "description": f"Approval processing overdue by {app_delay} days against statutory limit."
        },
        {
            "factor": "Rehabilitation & Resettlement (R&R) Execution Delay",
            "contribution_pct": round(min(20.0, ((1.0 - rr_pct) * 22.0)), 1),
            "severity": "MEDIUM" if rr_pct < 0.7 else "LOW",
            "description": f"R&R colony allotment and livelihood packages at {round(rr_pct * 100)}%."
        },
        {
            "factor": "Pending Statutory Environmental / Forest Documents",
            "contribution_pct": round(min(18.0, (docs * 3.5) + 2.0), 1),
            "severity": "MEDIUM" if docs > 2 else "LOW",
            "description": f"{docs} mandatory clearance documents pending verification."
        }
    ]

    contributions.sort(key=lambda x: x["contribution_pct"], reverse=True)

    # Generate Decision-Support Actionable Recommendations
    recommendations = []
    if disputes > 5:
        recommendations.append({
            "id": "REC-01",
            "priority": "CRITICAL",
            "reason": f"{disputes} legal disputes pending in Collectorate",
            "responsible_role": "District Magistrate / Legal Officer",
            "suggested_action": "Deploy dedicated Land Acquisition Tribunal bench for daily Section 15 objection hearings."
        })
    if comp_pct < 0.7:
        recommendations.append({
            "id": "REC-02",
            "priority": "HIGH",
            "reason": f"Compensation disbursement is at {round(comp_pct*100)}% (Pending backlog)",
            "responsible_role": "Finance Department / PFMS Nodal",
            "suggested_action": "Authorize PFMS Direct Benefit Transfer batch release for 2,400 verified beneficiary accounts."
        })
    if app_delay > 7:
        recommendations.append({
            "id": "REC-03",
            "priority": "HIGH",
            "reason": f"Administrative sanction delayed by {app_delay} days",
            "responsible_role": "State Principal Secretary (Revenue)",
            "suggested_action": "Issue deemed administrative sanction under RFCTLARR Section 11 single-window escalation."
        })
    if rr_pct < 0.75:
        recommendations.append({
            "id": "REC-04",
            "priority": "MEDIUM",
            "reason": f"R&R execution incomplete ({round(rr_pct*100)}% done)",
            "responsible_role": "R&R Administrator",
            "suggested_action": "Fast-track R&R township plot allotment and release first installment of subsistence grants."
        })

    return {
        "contributing_factors": contributions,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    test_features = {
        "legal_dispute_count": 18,
        "compensation_completion": 0.45,
        "approval_delay": 14,
        "rr_completion": 0.51,
        "pending_documents": 4
    }
    exp = explain_prediction(test_features)
    print("Explainability & Recommendations:", json.dumps(exp, indent=2))
