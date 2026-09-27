import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.preprocessing import StandardScaler

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

def generate_synthetic_dataset(n_samples: int = 2500, random_state: int = 42):
    np.random.seed(random_state)

    land_area = np.random.uniform(10.0, 2500.0, n_samples)
    parcel_count = np.random.randint(5, 500, n_samples)
    affected_families = np.random.randint(10, 2000, n_samples)
    legal_dispute_count = np.random.poisson(3, n_samples)
    dispute_ratio = np.clip(legal_dispute_count / np.maximum(parcel_count, 1), 0.0, 1.0)
    
    approval_delay = np.random.randint(0, 120, n_samples)
    notification_delay = np.random.randint(0, 90, n_samples)
    compensation_completion = np.random.uniform(10.0, 100.0, n_samples)
    rr_completion = np.random.uniform(5.0, 100.0, n_samples)
    possession_completion = np.random.uniform(0.0, 100.0, n_samples)
    pending_documents = np.random.randint(0, 15, n_samples)
    stakeholder_response_time = np.random.randint(2, 45, n_samples)
    documentation_score = np.random.uniform(40.0, 100.0, n_samples)

    # Field features (0 or 1)
    field_verification_completed = np.random.choice([0, 1], size=n_samples, p=[0.2, 0.8])
    gps_verified = np.random.choice([0, 1], size=n_samples, p=[0.1, 0.9])
    boundary_mismatch = np.random.choice([0, 1], size=n_samples, p=[0.8, 0.2])
    khasra_mismatch = np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15])
    encroachment_detected = np.random.choice([0, 1], size=n_samples, p=[0.8, 0.2])
    owner_dispute = np.random.choice([0, 1], size=n_samples, p=[0.75, 0.25])
    compensation_issue = np.random.choice([0, 1], size=n_samples, p=[0.7, 0.3])
    legal_issue = np.random.choice([0, 1], size=n_samples, p=[0.8, 0.2])
    land_use_mismatch = np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15])
    rr_issue = np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15])
    inspection_delay = np.random.randint(0, 45, n_samples)

    # Risk formulation based on statutory acquisition rules
    risk_score = (
        (approval_delay * 0.15) +
        (notification_delay * 0.12) +
        ((100.0 - compensation_completion) * 0.20) +
        ((100.0 - possession_completion) * 0.15) +
        (legal_dispute_count * 4.0) +
        (pending_documents * 3.0) +
        (boundary_mismatch * 20.0) +
        (khasra_mismatch * 25.0) +
        (encroachment_detected * 22.0) +
        (owner_dispute * 20.0) +
        (compensation_issue * 18.0) +
        (legal_issue * 20.0) +
        np.random.normal(0, 5, n_samples)
    )

    # Delay target binary label: 1 if delayed / high risk, 0 otherwise
    y = (risk_score > 60.0).astype(int)

    df = pd.DataFrame({
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
        "documentation_score": documentation_score,
        "field_verification_completed": field_verification_completed,
        "gps_verified": gps_verified,
        "boundary_mismatch": boundary_mismatch,
        "khasra_mismatch": khasra_mismatch,
        "encroachment_detected": encroachment_detected,
        "owner_dispute": owner_dispute,
        "compensation_issue": compensation_issue,
        "legal_issue": legal_issue,
        "land_use_mismatch": land_use_mismatch,
        "rr_issue": rr_issue,
        "inspection_delay": inspection_delay
    })
    return df, y

def train_and_export_model():
    model_dir = os.path.join(os.path.dirname(__file__), "model")
    os.makedirs(model_dir, exist_ok=True)

    df, y = generate_synthetic_dataset(n_samples=3000, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(df, y, test_size=0.2, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train_scaled, y_train)

    y_pred = clf.predict(X_test_scaled)
    y_prob = clf.predict_proba(X_test_scaled)[:, 1]

    metrics = {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred)), 4),
        "recall": round(float(recall_score(y_test, y_pred)), 4),
        "f1": round(float(f1_score(y_test, y_pred)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_prob)), 4),
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "features": FEATURE_NAMES,
        "model_type": "RandomForestClassifier",
        "version": "2.0.0-rf-synthetic",
        "note": "MODEL TRAINED ON REPRODUCIBLE SYNTHETIC DEMO DATASET"
    }

    # Save model and preprocessor
    joblib.dump(clf, os.path.join(model_dir, "delay_risk_model.joblib"))
    joblib.dump(scaler, os.path.join(model_dir, "preprocessor.joblib"))

    with open(os.path.join(model_dir, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print("Model trained and saved successfully!")
    print("Metrics:", json.dumps(metrics, indent=2))
    return metrics

if __name__ == "__main__":
    train_and_export_model()
