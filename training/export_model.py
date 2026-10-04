"""
Model Exporter for UPIShield.
Exports trained scikit-learn GradientBoostingClassifier to portable JSON & TypeScript representations
for production inference inside Supabase Edge Functions.
"""

import json
import os
import math
import numpy as np
from typing import Dict, Any
from sklearn.ensemble import GradientBoostingClassifier


def export_gb_model_to_json(
    model: GradientBoostingClassifier,
    feature_names: list,
    model_version: str = "SIH-ML-Cashout-GBClassifier-v2.0.0",
    metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Serializes sklearn GradientBoostingClassifier trees and metadata to a dictionary.
    """
    if not isinstance(model, GradientBoostingClassifier):
        raise TypeError("Expected sklearn.ensemble.GradientBoostingClassifier instance.")

    # 1. Extract initial raw prediction (log-odds prior)
    f0 = float(model._raw_predict_init(np.zeros((1, len(feature_names))))[0, 0])
    learning_rate = float(model.learning_rate)

    # 2. Extract trees
    exported_trees = []
    for m in range(model.n_estimators):
        tree = model.estimators_[m, 0].tree_
        nodes = []
        n_nodes = tree.node_count

        for i in range(n_nodes):
            left_child = int(tree.children_left[i])
            right_child = int(tree.children_right[i])
            feature = int(tree.feature[i])
            threshold = float(tree.threshold[i])
            
            # Leaf value in tree.value is shape (n_nodes, 1, 1)
            val = float(tree.value[i, 0, 0])

            nodes.append({
                "feature": feature,
                "threshold": round(threshold, 6),
                "left": left_child,
                "right": right_child,
                "value": round(val, 8)
            })

        exported_trees.append({
            "nodes": nodes
        })

    payload = {
        "model_version": model_version,
        "model_type": "GradientBoostingClassifier",
        "feature_names": feature_names,
        "learning_rate": learning_rate,
        "init_value": round(f0, 8),
        "n_estimators": model.n_estimators,
        "max_depth": model.max_depth,
        "metadata": metadata or {},
        "trees": exported_trees
    }

    return payload


def save_exported_model(
    model_payload: Dict[str, Any],
    json_path: str,
    ts_path: str = None
):
    """Saves the exported model payload as JSON and optionally TypeScript file."""
    os.makedirs(os.path.dirname(os.path.abspath(json_path)), exist_ok=True)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(model_payload, f, indent=2)
    print(f"[SUCCESS] Exported JSON model artifact to: {json_path}")

    if ts_path:
        os.makedirs(os.path.dirname(os.path.abspath(ts_path)), exist_ok=True)
        ts_content = f"// Auto-generated GradientBoostingClassifier model export for Supabase Edge Functions\n"
        ts_content += f"export const CASHOUT_MODEL_DATA = {json.dumps(model_payload, indent=2)} as const;\n"
        with open(ts_path, "w", encoding="utf-8") as f:
            f.write(ts_content)
        print(f"[SUCCESS] Exported TypeScript model module to: {ts_path}")

