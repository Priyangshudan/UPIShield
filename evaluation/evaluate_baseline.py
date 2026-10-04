"""
Baseline Evaluator for UPIShield.
Evaluates the old hand-written heuristic on held-out test events for direct comparison with ML model.
"""

import numpy as np


def compute_heuristic_score(candidate: dict) -> float:
    """Calculates the old heuristic score for a candidate location."""
    vec = candidate["features"]
    # vec order: [distance_km, historical_fraud_count, cctv_available, is_csp, case_amount, cashout_hour, distance_rank]
    dist = vec[0]
    fraud_cnt = vec[1]
    cctv = vec[2]
    is_csp = vec[3]

    score = max(
        0.1,
        fraud_cnt * 3.0 + 20.0 / (dist + 0.5) + (15.0 if is_csp > 0 else 0.0) - (5.0 if cctv > 0 else 0.0)
    )
    return float(score)


def evaluate_heuristic_baseline(test_events: list) -> dict:
    """
    Evaluates the heuristic baseline over test events and computes ranking metrics.
    """
    recall_at_1_list = []
    recall_at_3_list = []
    recall_at_4_list = []
    mrr_list = []

    for event in test_events:
        candidates = event["candidates"]
        scored_candidates = []
        for cand in candidates:
            score = compute_heuristic_score(cand)
            scored_candidates.append({
                "candidate": cand,
                "score": score,
                "label": cand["label"]
            })

        # Rank candidates by heuristic score descending
        scored_candidates.sort(key=lambda x: x["score"], reverse=True)

        # Find 1-based rank of actual positive location (label == 1)
        rank_of_positive = None
        for r, sc in enumerate(scored_candidates, 1):
            if sc["label"] == 1:
                rank_of_positive = r
                break

        if rank_of_positive is not None:
            recall_at_1_list.append(1.0 if rank_of_positive <= 1 else 0.0)
            recall_at_3_list.append(1.0 if rank_of_positive <= 3 else 0.0)
            recall_at_4_list.append(1.0 if rank_of_positive <= 4 else 0.0)
            mrr_list.append(1.0 / rank_of_positive)

    metrics = {
        "recall_at_1": round(float(np.mean(recall_at_1_list)), 4),
        "recall_at_3": round(float(np.mean(recall_at_3_list)), 4),
        "recall_at_4": round(float(np.mean(recall_at_4_list)), 4),
        "mrr": round(float(np.mean(mrr_list)), 4)
    }

    return metrics

