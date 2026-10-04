"""
ML Model Evaluator for UPIShield.
Evaluates trained GradientBoostingClassifier models on held-out test events.
Computes grouped ranking metrics (Recall@K, MRR, Precision@K) and classification metrics (ROC-AUC, PR-AUC, F1).
"""

import numpy as np
from sklearn.metrics import roc_auc_score, precision_recall_curve, auc, f1_score


def evaluate_model_on_events(model, test_events: list, feature_indices: list = None) -> tuple:
    """
    Evaluates ML model predictions per event and computes overall ranking and classification metrics.
    If feature_indices is provided, slices the candidate feature vector to those specific feature indices.
    """
    recall_at_1_list = []
    recall_at_3_list = []
    recall_at_4_list = []
    precision_at_1_list = []
    precision_at_3_list = []
    precision_at_4_list = []
    mrr_list = []

    all_y_true = []
    all_y_prob = []
    predictions_rows = []

    for event in test_events:
        candidates = event["candidates"]
        
        if feature_indices is not None:
            X_event = np.array([[cand["features"][i] for i in feature_indices] for cand in candidates])
        else:
            X_event = np.array([cand["features"] for cand in candidates])

        y_true = np.array([cand["label"] for cand in candidates])

        # Get probability estimates for positive class (y = 1)
        probs = model.predict_proba(X_event)[:, 1]

        scored = []
        for cand, prob, y_val in zip(candidates, probs, y_true):
            scored.append({
                "event_id": event["event_id"],
                "location_id": cand["location_id"],
                "location_name": cand["location_name"],
                "probability": float(prob),
                "label": int(y_val),
                "features": cand["features"]
            })
            all_y_true.append(y_val)
            all_y_prob.append(prob)

        # Rank by probability score descending
        scored.sort(key=lambda x: x["probability"], reverse=True)

        # Record rank
        actual_rank = None
        for r, sc in enumerate(scored, 1):
            sc["rank"] = r
            predictions_rows.append(sc)
            if sc["label"] == 1:
                actual_rank = r

        if actual_rank is not None:
            recall_at_1_list.append(1.0 if actual_rank <= 1 else 0.0)
            recall_at_3_list.append(1.0 if actual_rank <= 3 else 0.0)
            recall_at_4_list.append(1.0 if actual_rank <= 4 else 0.0)

            # Precision@K for group of size N where 1 item is positive
            precision_at_1_list.append(1.0 / 1.0 if actual_rank <= 1 else 0.0)
            precision_at_3_list.append(1.0 / 3.0 if actual_rank <= 3 else 0.0)
            precision_at_4_list.append(1.0 / 4.0 if actual_rank <= 4 else 0.0)

            mrr_list.append(1.0 / actual_rank)

    all_y_true = np.array(all_y_true)
    all_y_prob = np.array(all_y_prob)

    # Calculate ROC-AUC & PR-AUC
    try:
        roc_auc = float(roc_auc_score(all_y_true, all_y_prob))
    except Exception:
        roc_auc = 0.5

    try:
        p_vals, r_vals, _ = precision_recall_curve(all_y_true, all_y_prob)
        pr_auc = float(auc(r_vals, p_vals))
    except Exception:
        pr_auc = 0.0

    # Optimal F1 threshold
    y_pred_binary = (all_y_prob >= 0.5).astype(int)
    f1 = float(f1_score(all_y_true, y_pred_binary, zero_division=0))

    metrics = {
        "recall_at_1": round(float(np.mean(recall_at_1_list)), 4),
        "recall_at_3": round(float(np.mean(recall_at_3_list)), 4),
        "recall_at_4": round(float(np.mean(recall_at_4_list)), 4),
        "mrr": round(float(np.mean(mrr_list)), 4),
        "precision_at_1": round(float(np.mean(precision_at_1_list)), 4),
        "precision_at_3": round(float(np.mean(precision_at_3_list)), 4),
        "precision_at_4": round(float(np.mean(precision_at_4_list)), 4),
        "roc_auc": round(roc_auc, 4),
        "pr_auc": round(pr_auc, 4),
        "f1": round(f1, 4)
    }

    return metrics, predictions_rows
