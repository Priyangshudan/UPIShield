"""
Full Evaluation Experiment Runner for UPIShield Cash-Out Risk Prediction.
Executes training, evaluation, baseline comparison, and exports results to evaluation/results/.
"""

import os
import json
import csv
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier

from src.cashout_features import FEATURE_NAMES
from evaluation.generate_dataset import load_evaluation_data, build_event_groups, get_leakage_safe_split
from evaluation.evaluate_cashout_model import evaluate_model_on_events
from evaluation.evaluate_baseline import evaluate_heuristic_baseline
from training.export_model import export_gb_model_to_json, save_exported_model


def run_full_experiment():
    """Runs the complete end-to-end evaluation experiment."""
    print("==================================================================")
    print("RUNNING UPISHIELD CASHOUT PREDICTION EVALUATION EXPERIMENT")
    print("==================================================================")

    # 1. Load data
    cashouts, locations = load_evaluation_data()
    events_data = build_event_groups(cashouts, locations)

    # 2. Leakage-safe split (Temporal split: older 80% -> train, newer 20% -> test)
    train_events, test_events = get_leakage_safe_split(events_data, test_ratio=0.2, method="temporal")

    # Build X_train, y_train matrix
    X_train_list, y_train_list = [], []
    for ev in train_events:
        for cand in ev["candidates"]:
            X_train_list.append(cand["features"])
            y_train_list.append(cand["label"])

    X_train = np.array(X_train_list, dtype=np.float64)
    y_train = np.array(y_train_list, dtype=np.int32)

    X_test_list, y_test_list = [], []
    for ev in test_events:
        for cand in ev["candidates"]:
            X_test_list.append(cand["features"])
            y_test_list.append(cand["label"])

    X_test = np.array(X_test_list, dtype=np.float64)
    y_test = np.array(y_test_list, dtype=np.int32)

    print(f"[DATASET INFO]")
    print(f"  Total Historical Events: {len(events_data)}")
    print(f"  Training Events: {len(train_events)} ({len(X_train)} candidate rows, {np.sum(y_train==1)} positive)")
    print(f"  Test Events: {len(test_events)} ({len(X_test)} candidate rows, {np.sum(y_test==1)} positive)")
    print(f"  Candidate Locations per Event: {len(locations)}")

    # 3. Train GradientBoostingClassifier
    clf = GradientBoostingClassifier(
        n_estimators=50,
        max_depth=3,
        learning_rate=0.1,
        random_state=42
    )
    clf.fit(X_train, y_train)

    # 4. Evaluate ML model
    ml_metrics, predictions_rows = evaluate_model_on_events(clf, test_events)

    # 5. Evaluate Heuristic Baseline
    baseline_metrics = evaluate_heuristic_baseline(test_events)

    print("\n[EVALUATION METRICS COMPARISON]")
    print(f"  Metric        | ML Model (GradientBoosting) | Baseline Heuristic")
    print(f"  --------------+-----------------------------+-------------------")
    print(f"  Recall@1      | {ml_metrics['recall_at_1']:<27} | {baseline_metrics['recall_at_1']}")
    print(f"  Recall@3      | {ml_metrics['recall_at_3']:<27} | {baseline_metrics['recall_at_3']}")
    print(f"  Recall@4      | {ml_metrics['recall_at_4']:<27} | {baseline_metrics['recall_at_4']}")
    print(f"  MRR           | {ml_metrics['mrr']:<27} | {baseline_metrics['mrr']}")
    print(f"  Precision@1   | {ml_metrics['precision_at_1']:<27} | N/A")
    print(f"  ROC-AUC       | {ml_metrics['roc_auc']:<27} | N/A")
    print(f"  PR-AUC        | {ml_metrics['pr_auc']:<27} | N/A")

    # 6. Extract Feature Importance
    importances = clf.feature_importances_
    feat_imp_list = []
    for feat_name, imp in zip(FEATURE_NAMES, importances):
        feat_imp_list.append({"feature": feat_name, "importance": round(float(imp), 6)})
    feat_imp_list.sort(key=lambda x: x["importance"], reverse=True)

    print("\n[FEATURE IMPORTANCE]")
    for item in feat_imp_list:
        print(f"  {item['feature']:<25} : {item['importance']:.4f}")

    # 7. Create Sample Prediction Explanation
    sample_event = test_events[0]
    sample_candidates = predictions_rows[:len(locations)]
    sample_top = sample_candidates[0]
    sample_explanation = {
        "event_id": sample_event["event_id"],
        "top_candidate_name": sample_top["location_name"],
        "rank": sample_top["rank"],
        "predicted_probability": sample_top["probability"],
        "actual_ground_truth_label": sample_top["label"],
        "candidate_features": {
            feat_name: round(val, 4)
            for feat_name, val in zip(FEATURE_NAMES, sample_top["features"])
        }
    }

    # 8. Save artifacts into evaluation/results/
    results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results")
    os.makedirs(results_dir, exist_ok=True)

    # Save metrics.json
    metrics_json_path = os.path.join(results_dir, "metrics.json")
    results_payload = {
        "model": "GradientBoostingClassifier",
        "model_version": "SIH-ML-Cashout-GBClassifier-v2.0.0",
        "dataset": "Delhi-NCR Synthetic Cybercrime Historical Cashouts",
        "train_events": len(train_events),
        "test_events": len(test_events),
        "candidate_rows": len(X_train) + len(X_test),
        "positive_examples": int(np.sum(y_train == 1) + np.sum(y_test == 1)),
        "negative_examples": int(np.sum(y_train == 0) + np.sum(y_test == 0)),
        "metrics": ml_metrics,
        "baseline_metrics": baseline_metrics,
        "feature_importances": feat_imp_list,
        "sample_prediction_explanation": sample_explanation
    }

    with open(metrics_json_path, "w", encoding="utf-8") as f:
        json.dump(results_payload, f, indent=2)
    print(f"\n[SUCCESS] Saved metrics to: {metrics_json_path}")

    # Save feature_importance.csv
    feat_csv_path = os.path.join(results_dir, "feature_importance.csv")
    with open(feat_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["feature", "importance"])
        writer.writeheader()
        writer.writerows(feat_imp_list)
    print(f"[SUCCESS] Saved feature importance to: {feat_csv_path}")

    # Save predictions.csv
    pred_csv_path = os.path.join(results_dir, "predictions.csv")
    with open(pred_csv_path, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["event_id", "location_id", "location_name", "probability", "rank", "label"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for p in predictions_rows:
            writer.writerow({
                "event_id": p["event_id"],
                "location_id": p["location_id"],
                "location_name": p["location_name"],
                "probability": round(p["probability"], 4),
                "rank": p["rank"],
                "label": p["label"]
            })
    print(f"[SUCCESS] Saved predictions to: {pred_csv_path}")

    # Also update production model export
    model_payload = export_gb_model_to_json(
        model=clf,
        feature_names=FEATURE_NAMES,
        model_version="SIH-ML-Cashout-GBClassifier-v2.0.0",
        metadata={
            "train_events": len(train_events),
            "test_events": len(test_events),
            "total_samples": len(X_train) + len(X_test),
            "test_mrr": ml_metrics["mrr"],
            "test_recall_at_1": ml_metrics["recall_at_1"]
        }
    )
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    prod_json = os.path.join(base_dir, "supabase", "functions", "_shared", "models", "cashout_model.json")
    prod_ts = os.path.join(base_dir, "supabase", "functions", "_shared", "models", "cashout_model.ts")
    save_exported_model(model_payload, prod_json, prod_ts)

    print("==================================================================")
    print("EVALUATION EXPERIMENT COMPLETED SUCCESSFULLY")
    print("==================================================================")
    return results_payload


if __name__ == "__main__":
    run_full_experiment()

