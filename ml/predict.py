import os
import joblib
import pandas as pd
import numpy as np

ml_dir = os.path.dirname(__file__)
model_path = os.path.join(ml_dir, "model.pkl")

# Load model
_model = None

def get_model():
    global _model
    if _model is None:
        if os.path.exists(model_path):
            _model = joblib.load(model_path)
        else:
            raise FileNotFoundError("Model not found. Run ml/train.py first.")
    return _model

stage_map = {
    "Proposal": 1, "Scrutiny": 2, "Approval": 3, "Notification": 4,
    "Objection": 5, "Award": 6, "Compensation": 7, "R&R": 8,
    "Possession": 9, "Closure": 10
}

def predict_project_risk(features: dict):
    model = get_model()
    
    stage = features.get("current_stage", "Proposal")
    stage_num = stage_map.get(stage, 1)

    input_data = [
        features.get("land_area", 1000.0),
        features.get("parcel_count", 150),
        features.get("affected_families", 500),
        features.get("legal_dispute_count", 0),
        features.get("dispute_ratio", 0.0),
        features.get("approval_delay", 0),
        features.get("notification_delay", 0),
        features.get("compensation_completion", 0.5),
        features.get("rr_completion", 0.5),
        features.get("possession_completion", 0.5),
        features.get("pending_documents", 0),
        features.get("stakeholder_response_time", 14),
        features.get("documentation_score", 0.8),
        stage_num
    ]

    prob = float(model.predict_proba([input_data])[0][1])
    risk_pct = round(prob * 100, 1)

    if risk_pct >= 75:
        risk_level = "CRITICAL"
        pred_delay_days = int(45 + (risk_pct - 75) * 2.2)
    elif risk_pct >= 60:
        risk_level = "HIGH"
        pred_delay_days = int(25 + (risk_pct - 60) * 1.3)
    elif risk_pct >= 35:
        risk_level = "MEDIUM"
        pred_delay_days = int(10 + (risk_pct - 35) * 0.6)
    else:
        risk_level = "LOW"
        pred_delay_days = int(max(0, risk_pct * 0.2))

    return {
        "delay_probability": round(prob, 3),
        "risk_percentage": risk_pct,
        "risk_level": risk_level,
        "predicted_delay_days": pred_delay_days,
        "is_delayed": prob >= 0.5
    }

if __name__ == "__main__":
    test_features = {
        "land_area": 1250.0,
        "parcel_count": 52,
        "affected_families": 2400,
        "legal_dispute_count": 18,
        "dispute_ratio": 0.346,
        "approval_delay": 14,
        "notification_delay": 28,
        "compensation_completion": 0.45,
        "rr_completion": 0.51,
        "possession_completion": 0.48,
        "pending_documents": 4,
        "stakeholder_response_time": 21,
        "current_stage": "Compensation",
        "documentation_score": 0.65
    }
    result = predict_project_risk(test_features)
    print("Inference Result for NH-GJ-2026-001:", result)
