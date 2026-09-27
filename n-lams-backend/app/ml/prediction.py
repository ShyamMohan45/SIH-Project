import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, Any, List

FEATURE_NAMES = [
    "land_area", "parcel_count", "affected_families", "legal_dispute_count",
    "dispute_ratio", "approval_delay", "notification_delay", "compensation_completion",
    "rr_completion", "possession_completion", "pending_documents",
    "stakeholder_response_time", "documentation_score",
    "field_verification_completed", "gps_verified", "boundary_mismatch",
    "khasra_mismatch", "encroachment_detected", "owner_dispute",
    "compensation_issue", "legal_issue", "land_use_mismatch", "rr_issue",
    "inspection_delay"
]

_model = None
_scaler = None
_metadata = None

def get_model_and_scaler():
    global _model, _scaler, _metadata
    if _model is None:
        model_dir = os.path.join(os.path.dirname(__file__), "model")
        model_path = os.path.join(model_dir, "delay_risk_model.joblib")
        scaler_path = os.path.join(model_dir, "preprocessor.joblib")
        meta_path = os.path.join(model_dir, "metadata.json")

        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            from app.ml.train import train_and_export_model
            train_and_export_model()

        _model = joblib.load(model_path)
        _scaler = joblib.load(scaler_path)
        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as f:
                _metadata = json.load(f)
    return _model, _scaler, _metadata

def predict_risk(features_dict: Dict[str, Any]) -> Dict[str, Any]:
    model, scaler, metadata = get_model_and_scaler()

    row = []
    for f in FEATURE_NAMES:
        val = features_dict.get(f, 0.0)
        if isinstance(val, bool):
            val = 1.0 if val else 0.0
        row.append(float(val))

    X_df = pd.DataFrame([row], columns=FEATURE_NAMES)
    X_scaled = scaler.transform(X_df)

    prob = float(model.predict_proba(X_scaled)[0, 1])

    # Assign risk level based on probability
    if prob >= 0.75:
        risk_level = "CRITICAL"
        pred = "DELAYED"
    elif prob >= 0.50:
        risk_level = "HIGH"
        pred = "DELAYED"
    elif prob >= 0.25:
        risk_level = "MEDIUM"
        pred = "ON_TRACK"
    else:
        risk_level = "LOW"
        pred = "ON_TRACK"

    from app.ml.explainability import explain_prediction
    top_factors = explain_prediction(model, scaler, row, FEATURE_NAMES)

    return {
        "prediction": pred,
        "risk_probability": round(prob, 4),
        "risk_level": risk_level,
        "model_version": metadata.get("version", "2.0.0-rf-synthetic") if metadata else "2.0.0-rf-synthetic",
        "top_factors": top_factors,
        "feature_snapshot": features_dict,
        "created_at": datetime.utcnow()
    }
