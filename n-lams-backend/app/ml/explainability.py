import numpy as np
import pandas as pd
from typing import List, Dict, Any

def explain_prediction(model, scaler, raw_feature_vector: list, feature_names: list) -> List[Dict[str, Any]]:
    # Try SHAP TreeExplainer first if available
    try:
        import shap
        explainer = shap.TreeExplainer(model)
        X_df = pd.DataFrame([raw_feature_vector], columns=feature_names)
        X_scaled = scaler.transform(X_df)
        shap_values = explainer.shap_values(X_scaled)

        # For binary classification, take class 1
        if isinstance(shap_values, list):
            sv = shap_values[1][0]
        elif len(shap_values.shape) == 3:
            sv = shap_values[0, :, 1]
        else:
            sv = shap_values[0]

        factors = []
        for feat, val, contrib in zip(feature_names, raw_feature_vector, sv):
            factors.append({
                "feature": feat,
                "importance": float(round(abs(contrib), 4)),
                "contribution": float(round(contrib, 4)),
                "value": val,
                "description": f"{feat.replace('_', ' ').title()} contributed {'positively' if contrib > 0 else 'negatively'} to delay risk."
            })

        factors.sort(key=lambda x: x["importance"], reverse=True)
        return factors[:5]

    except Exception:
        # Transparent feature importance fallback using Tree Feature Importances * scaled deviation
        importances = model.feature_importances_
        factors = []
        for feat, val, imp in zip(feature_names, raw_feature_vector, importances):
            contrib = imp * (1.0 if float(val) > 0 else 0.1)
            factors.append({
                "feature": feat,
                "importance": float(round(imp, 4)),
                "contribution": float(round(contrib, 4)),
                "value": val,
                "description": f"{feat.replace('_', ' ').title()} weight in random forest ensemble"
            })
        factors.sort(key=lambda x: x["importance"], reverse=True)
        return factors[:5]
