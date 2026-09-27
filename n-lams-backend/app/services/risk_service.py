import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.db.models.project import Project
from app.db.models.parcel import Parcel
from app.db.models.risk import RiskPrediction
from app.ml.prediction import predict_risk

def calculate_and_save_project_risk(
    db: Session,
    project_id: str,
    parcel_id: Optional[str] = None,
    field_override_features: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return {}

    parcels = db.query(Parcel).filter(Parcel.project_id == project_id).all()
    parcel_count = max(len(parcels), 1)

    features = {
        "land_area": float(project.land_required or 100.0),
        "parcel_count": parcel_count,
        "affected_families": int(project.affected_families or 100),
        "legal_dispute_count": 2,
        "dispute_ratio": 2.0 / parcel_count,
        "approval_delay": 15,
        "notification_delay": 20,
        "compensation_completion": float((project.land_acquired / max(project.land_required, 1.0)) * 100.0),
        "rr_completion": 50.0,
        "possession_completion": 40.0,
        "pending_documents": 3,
        "stakeholder_response_time": 10,
        "documentation_score": 85.0,
        "field_verification_completed": False,
        "gps_verified": True,
        "boundary_mismatch": False,
        "khasra_mismatch": False,
        "encroachment_detected": False,
        "owner_dispute": False,
        "compensation_issue": False,
        "legal_issue": False,
        "land_use_mismatch": False,
        "rr_issue": False,
        "inspection_delay": 0
    }

    # If field overrides supplied (e.g. from inspection submission)
    if field_override_features:
        features.update(field_override_features)

    result = predict_risk(features)

    # Store prediction record
    prediction_record = RiskPrediction(
        id=f"RISK-{uuid.uuid4().hex[:8].upper()}",
        project_id=project_id,
        parcel_id=parcel_id,
        prediction=result["prediction"],
        risk_probability=result["risk_probability"],
        risk_level=result["risk_level"],
        model_version=result["model_version"],
        feature_snapshot=json.dumps(features),
        created_at=datetime.utcnow()
    )
    db.add(prediction_record)

    # Update project risk fields
    project.risk_level = result["risk_level"]
    project.risk_score = round(result["risk_probability"] * 100.0, 1)
    db.commit()
    db.refresh(prediction_record)

    result["prediction_id"] = prediction_record.id
    return result
