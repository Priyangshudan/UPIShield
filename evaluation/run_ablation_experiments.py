"""
Offline Ablation & Scientific Validation Experiments for UPIShield.
Evaluates Distance-Only Baseline, Ablation without distance_rank, and Progressive Feature Ablation
on the exact same temporal held-out test split.
"""

import os
import json
import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import GradientBoostingClassifier

from src.cashout_features import FEATURE_NAMES
from evaluation.generate_dataset import load_evaluation_data, build_event_groups, get_leakage_safe_split
from evaluation.evaluate_cashout_model import evaluate_model_on_events
from evaluation.evaluate_baseline import evaluate_heuristic_baseline


def evaluate_distance_only_ranking(test_events: list) -> dict:
    """
    Experiment 1: Ranks candidate locations using ONLY distance_km (closest candidate = rank 1).
    No GBDT training or auxiliary features used.
    """
    recall_at_1_list = []
    recall_at_3_list = []
    recall_at_4_list = []
    mrr_list = []

    for event in test_events:
        candidates = event["candidates"]
        scored = []
        for cand in candidates:
            dist = cand["features"][0]  # distance_km is feature 0
            scored.append({
                "candidate": cand,
                "distance_km": dist,
                "label": cand["label"]
            })

        # Rank by distance_km ascending (closest candidate gets rank 1)
        scored.sort(key=lambda x: x["distance_km"])

        actual_rank = None
        for r, sc in enumerate(scored, 1):
            if sc["label"] == 1:
                actual_rank = r
                break

        if actual_rank is not None:
            recall_at_1_list.append(1.0 if actual_rank <= 1 else 0.0)
            recall_at_3_list.append(1.0 if actual_rank <= 3 else 0.0)
            recall_at_4_list.append(1.0 if actual_rank <= 4 else 0.0)
            mrr_list.append(1.0 / actual_rank)

    metrics = {
        "experiment": "Distance-Only Baseline (Pure Spatial Proximity Rank)",
        "test_events": len(test_events),
        "recall_at_1": round(float(np.mean(recall_at_1_list)), 4),
        "recall_at_3": round(float(np.mean(recall_at_3_list)), 4),
        "recall_at_4": round(float(np.mean(recall_at_4_list)), 4),
        "mrr": round(float(np.mean(mrr_list)), 4)
    }

    return metrics


def run_all_ablation_experiments():
    print("==================================================================")
    print("RUNNING OFFLINE ABLATION & SCIENTIFIC VALIDATION EXPERIMENTS")
    print("==================================================================")

    results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results")
    os.makedirs(results_dir, exist_ok=True)

    # 1. Load data and split using the EXACT SAME temporal split as run_experiment.py
    cashouts, locations = load_evaluation_data()
    events_data = build_event_groups(cashouts, locations)
    train_events, test_events = get_leakage_safe_split(events_data, test_ratio=0.2, method="temporal")

    print(f"[DATASET INFO] Total Events: {len(events_data)} | Train: {len(train_events)} | Test: {len(test_events)}")

    # Extract X_train, y_train, X_test, y_test
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

    # -------------------------------------------------------------------------
    # EXPERIMENT 1: DISTANCE-ONLY BASELINE (Pure Spatial Distance Rank)
    # -------------------------------------------------------------------------
    print("\n--- EXPERIMENT 1: Distance-Only Baseline ---")
    dist_only_metrics = evaluate_distance_only_ranking(test_events)
    print(f"  Recall@1: {dist_only_metrics['recall_at_1']} | Recall@3: {dist_only_metrics['recall_at_3']} | MRR: {dist_only_metrics['mrr']}")

    with open(os.path.join(results_dir, "distance_only_baseline.json"), "w", encoding="utf-8") as f:
        json.dump(dist_only_metrics, f, indent=2)

    # -------------------------------------------------------------------------
    # EXPERIMENT 2: REMOVE distance_rank FROM ML MODEL
    # -------------------------------------------------------------------------
    print("\n--- EXPERIMENT 2: Remove distance_rank from ML Model ---")
    # Features 0..5: distance_km, historical_fraud_count, cctv_available, is_csp, case_amount, cashout_hour
    no_dist_rank_feats = [0, 1, 2, 3, 4, 5]
    no_dist_rank_feat_names = FEATURE_NAMES[0:6]

    clf_no_dist_rank = GradientBoostingClassifier(
        n_estimators=50,
        max_depth=3,
        learning_rate=0.1,
        random_state=42
    )
    clf_no_dist_rank.fit(X_train[:, no_dist_rank_feats], y_train)

    no_dist_rank_metrics, _ = evaluate_model_on_events(clf_no_dist_rank, test_events, feature_indices=no_dist_rank_feats)
    print(f"  Recall@1: {no_dist_rank_metrics['recall_at_1']} | Recall@3: {no_dist_rank_metrics['recall_at_3']} | MRR: {no_dist_rank_metrics['mrr']} | ROC-AUC: {no_dist_rank_metrics['roc_auc']}")

    no_dist_rank_payload = {
        "experiment": "Ablation Model (Without distance_rank)",
        "features": no_dist_rank_feat_names,
        "test_events": len(test_events),
        "metrics": no_dist_rank_metrics
    }
    with open(os.path.join(results_dir, "ablation_without_distance_rank.json"), "w", encoding="utf-8") as f:
        json.dump(no_dist_rank_payload, f, indent=2)

    # Feature Importance for Experiment 2
    no_rank_imps = clf_no_dist_rank.feature_importances_
    no_rank_feat_imp_list = []
    for fn, imp in zip(no_dist_rank_feat_names, no_rank_imps):
        no_rank_feat_imp_list.append({"feature": fn, "importance": round(float(imp), 6)})
    no_rank_feat_imp_list.sort(key=lambda x: x["importance"], reverse=True)

    with open(os.path.join(results_dir, "feature_importance_without_distance_rank.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["feature", "importance"])
        writer.writeheader()
        writer.writerows(no_rank_feat_imp_list)

    # -------------------------------------------------------------------------
    # EXPERIMENT 3: PROGRESSIVE FEATURE ABLATION
    # -------------------------------------------------------------------------
    print("\n--- EXPERIMENT 3: Progressive Feature Ablation ---")

    ablation_sets = [
        {
            "id": "A",
            "name": "Distance only (GBDT)",
            "features": ["distance_km"],
            "indices": [0]
        },
        {
            "id": "B",
            "name": "Distance + historical fraud",
            "features": ["distance_km", "historical_fraud_count"],
            "indices": [0, 1]
        },
        {
            "id": "C",
            "name": "Distance + historical fraud + kiosk security",
            "features": ["distance_km", "historical_fraud_count", "cctv_available", "is_csp"],
            "indices": [0, 1, 2, 3]
        },
        {
            "id": "D",
            "name": "Add case context (Without distance_rank)",
            "features": ["distance_km", "historical_fraud_count", "cctv_available", "is_csp", "case_amount", "cashout_hour"],
            "indices": [0, 1, 2, 3, 4, 5]
        },
        {
            "id": "E",
            "name": "Full current model (With distance_rank)",
            "features": FEATURE_NAMES,
            "indices": [0, 1, 2, 3, 4, 5, 6]
        }
    ]

    summary_rows = []

    # Include Distance-Only Pure Rank Baseline for comparison
    summary_rows.append({
        "experiment": "Baseline (Pure Dist Rank)",
        "feature_set": "distance_km (Pure Rank)",
        "recall_at_1": dist_only_metrics["recall_at_1"],
        "recall_at_3": dist_only_metrics["recall_at_3"],
        "recall_at_4": dist_only_metrics["recall_at_4"],
        "mrr": dist_only_metrics["mrr"],
        "roc_auc": "N/A",
        "pr_auc": "N/A",
        "f1": "N/A"
    })

    # Include Old Heuristic Baseline for comparison
    old_heur_metrics = evaluate_heuristic_baseline(test_events)
    summary_rows.append({
        "experiment": "Baseline (Old Heuristic)",
        "feature_set": "dist + fraud + csp - cctv (Formula)",
        "recall_at_1": old_heur_metrics["recall_at_1"],
        "recall_at_3": old_heur_metrics["recall_at_3"],
        "recall_at_4": old_heur_metrics["recall_at_4"],
        "mrr": old_heur_metrics["mrr"],
        "roc_auc": "N/A",
        "pr_auc": "N/A",
        "f1": "N/A"
    })

    for aset in ablation_sets:
        indices = aset["indices"]
        clf_a = GradientBoostingClassifier(
            n_estimators=50,
            max_depth=3,
            learning_rate=0.1,
            random_state=42
        )
        clf_a.fit(X_train[:, indices], y_train)
        m, _ = evaluate_model_on_events(clf_a, test_events, feature_indices=indices)

        print(f"  Set {aset['id']} ({aset['name']:<40}): Recall@1={m['recall_at_1']} | Recall@3={m['recall_at_3']} | MRR={m['mrr']} | ROC-AUC={m['roc_auc']}")

        summary_rows.append({
            "experiment": f"Set {aset['id']}: {aset['name']}",
            "feature_set": ", ".join(aset["features"]),
            "recall_at_1": m["recall_at_1"],
            "recall_at_3": m["recall_at_3"],
            "recall_at_4": m["recall_at_4"],
            "mrr": m["mrr"],
            "roc_auc": m["roc_auc"],
            "pr_auc": m["pr_auc"],
            "f1": m["f1"]
        })

    # -------------------------------------------------------------------------
    # SAVE OUTPUT ARTIFACTS
    # -------------------------------------------------------------------------
    # Save ablation_summary.csv
    summary_csv_path = os.path.join(results_dir, "ablation_summary.csv")
    fieldnames = ["experiment", "feature_set", "recall_at_1", "recall_at_3", "recall_at_4", "mrr", "roc_auc", "pr_auc", "f1"]
    with open(summary_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(summary_rows)
    print(f"\n[SUCCESS] Saved ablation summary CSV to: {summary_csv_path}")

    # Save ablation_summary.json
    summary_json_path = os.path.join(results_dir, "ablation_summary.json")
    with open(summary_json_path, "w", encoding="utf-8") as f:
        json.dump(summary_rows, f, indent=2)
    print(f"[SUCCESS] Saved ablation summary JSON to: {summary_json_path}")

    # Generate recall_at_1_ablation.png plot
    plt_path = os.path.join(results_dir, "recall_at_1_ablation.png")
    try:
        exp_labels = [r["experiment"] for r in summary_rows]
        r1_scores = [float(r["recall_at_1"]) for r in summary_rows]

        plt.figure(figsize=(10, 5))
        bars = plt.barh(exp_labels, r1_scores, color=['#94a3b8', '#f87171', '#38bdf8', '#38bdf8', '#38bdf8', '#38bdf8', '#34d399'])
        plt.xlabel("Recall@1 Score", fontsize=11, fontweight='bold')
        plt.title("UPIShield Cash-Out Model: Progressive Feature Ablation (Recall@1)", fontsize=12, fontweight='bold')
        plt.xlim(0.0, 1.05)
        plt.gca().invert_yaxis()

        for bar in bars:
            width = bar.get_width()
            plt.text(width + 0.01, bar.get_y() + bar.get_height()/2, f"{width*100:.1f}%",
                     va='center', ha='left', fontsize=10, fontweight='bold')

        plt.tight_layout()
        plt.savefig(plt_path, dpi=150)
        plt.close()
        print(f"[SUCCESS] Saved Recall@1 ablation plot to: {plt_path}")
    except Exception as e:
        print(f"[WARN] Could not save plot: {e}")

    print("==================================================================")
    print("ABLATION EXPERIMENTS COMPLETED SUCCESSFULLY")
    print("==================================================================")
    return summary_rows


if __name__ == "__main__":
    run_all_ablation_experiments()
