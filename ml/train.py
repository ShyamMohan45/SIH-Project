import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

ml_dir = os.path.dirname(__file__)
root_dir = os.path.dirname(ml_dir)
data_path = os.path.join(root_dir, "data", "training_data.csv")

print(f"Loading training data from {data_path}...")
df = pd.read_csv(data_path)

# Feature list
feature_cols = [
    "land_area", "parcel_count", "affected_families", "legal_dispute_count",
    "dispute_ratio", "approval_delay", "notification_delay", "compensation_completion",
    "rr_completion", "possession_completion", "pending_documents",
    "stakeholder_response_time", "documentation_score"
]

stage_map = {
    "Proposal": 1, "Scrutiny": 2, "Approval": 3, "Notification": 4,
    "Objection": 5, "Award": 6, "Compensation": 7, "R&R": 8,
    "Possession": 9, "Closure": 10
}
df["stage_num"] = df["current_stage"].map(stage_map).fillna(1)
all_features = feature_cols + ["stage_num"]

X = df[all_features]
y = df["delayed"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print(f"Training set: {X_train.shape[0]} samples, Test set: {X_test.shape[0]} samples")

# Train Random Forest Classifier
clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)[:, 1]

acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred)
rec = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_prob)

print("==========================================")
print("     N-LAMS PS17 ML EVALUATION METRICS    ")
print("==========================================")
print(f"Accuracy:  {acc * 100:.2f}%")
print(f"Precision: {prec * 100:.2f}%")
print(f"Recall:    {rec * 100:.2f}%")
print(f"F1-Score:  {f1 * 100:.2f}%")
print(f"ROC-AUC:   {auc:.4f}")
print("==========================================")

# Feature Importances
importances = dict(zip(all_features, [round(float(v), 4) for v in clf.feature_importances_]))
sorted_importances = dict(sorted(importances.items(), key=lambda x: x[1], reverse=True))

model_path = os.path.join(ml_dir, "model.pkl")
joblib.dump(clf, model_path)
print(f"Saved trained model to {model_path}")

metadata = {
    "model_type": "RandomForestClassifier",
    "features": all_features,
    "stage_map": stage_map,
    "metrics": {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1": round(f1, 4),
        "roc_auc": round(auc, 4)
    },
    "feature_importances": sorted_importances
}

metadata_path = os.path.join(ml_dir, "metadata.json")
with open(metadata_path, "w") as f:
    json.dump(metadata, f, indent=2)

print(f"Saved model metadata to {metadata_path}")
