"""
ML-based Cash-Out Location Predictor for SIH26184.
Ranks candidate ATM and CSP locations for imminent physical withdrawal using spatial proximity,
historical fraud volume, CCTV availability, and gradient boosting inference.
"""

import math
from typing import List, Dict, Any, Tuple
import numpy as np

from backend.database import get_db_connection
from src.cashout_features import haversine_distance, build_candidate_feature_vectors
from training.train_cashout_model import train_and_export_model

try:
    from sklearn.ensemble import GradientBoostingClassifier
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


class CashoutPredictor:
    """
    Predictive engine ranking physical withdrawal points for active cybercrime cases.
    """

    def __init__(self):
        self.is_trained = False
        self.model = None
        self._train_default_model()

    def _train_default_model(self):
        """Trains GradientBoostingClassifier on synthetic historical cashouts if available."""
        if not SKLEARN_AVAILABLE:
            self.is_trained = False
            return

        try:
            clf, _ = train_and_export_model()
            self.model = clf
            self.is_trained = True
        except Exception:
            self.is_trained = False

    def predict_top_locations(
        self,
        case_amount: float,
        last_known_coord: Tuple[float, float] = (28.7120, 77.1190),
        top_k: int = 4,
        incident_hour: float = 14.0
    ) -> List[Dict[str, Any]]:
        """
        Evaluates all registered ATM/CSP locations using trained Gradient Boosting model and returns top_k ranked candidates.
        """
        conn = get_db_connection()
        loc_rows = [dict(r) for r in conn.execute("SELECT * FROM locations").fetchall()]
        conn.close()

        if not loc_rows:
            return []

        event_info = {
            "last_hop_lat": last_known_coord[0],
            "last_hop_lon": last_known_coord[1],
            "amount": case_amount,
            "hour": incident_hour
        }

        feature_vecs = build_candidate_feature_vectors(event_info, loc_rows)
        candidates = []

        for idx, (loc, f_vec) in enumerate(zip(loc_rows, feature_vecs)):
            dist = f_vec[0]
            if self.is_trained and self.model is not None:
                prob = float(self.model.predict_proba(np.array([f_vec]))[0, 1])
            else:
                # Fallback ranking by inverse distance if model is uninitialized
                prob = max(0.01, min(0.99, 1.0 / (dist + 0.1)))

            candidates.append({
                "loc": loc,
                "dist": dist,
                "prob": round(prob, 3)
            })

        # Sort by predicted probability descending
        candidates.sort(key=lambda x: x["prob"], reverse=True)
        top_candidates = candidates[:top_k]

        results = []
        for idx, item in enumerate(top_candidates):
            loc = item["loc"]
            dist = item["dist"]
            prob = item["prob"]
            rank = idx + 1

            if rank == 1 or prob >= 0.70:
                risk_lvl = "CRITICAL"
            elif prob >= 0.40:
                risk_lvl = "HIGH"
            else:
                risk_lvl = "MODERATE"

            if dist < 2.0:
                time_win = "10 - 25 mins"
            elif dist < 5.0:
                time_win = "20 - 45 mins"
            else:
                time_win = "40 - 75 mins"

            reasons = []
            if loc["historical_fraud_count"] >= 10:
                reasons.append(f"High historical cashout cluster ({loc['historical_fraud_count']} past incidents)")
            if dist <= 3.0:
                reasons.append(f"Immediate spatial proximity ({dist:.1f} km from runner hop)")
            if loc["type"] == "CSP":
                reasons.append("High-risk Micro-ATM / CSP agent vulnerability")
            if not loc["cctv_available"]:
                reasons.append("No active CCTV surveillance coverage recorded")
            if not reasons:
                reasons.append("Multi-factor spatial likelihood alignment")

            results.append({
                "rank": rank,
                "location_id": loc["id"],
                "name": loc["name"],
                "type": loc["type"],
                "bank": loc["bank"],
                "latitude": float(loc["latitude"]),
                "longitude": float(loc["longitude"]),
                "probability_score": prob,
                "risk_level": risk_lvl,
                "distance_km": round(dist, 2),
                "estimated_time_window": time_win,
                "reason_factors": reasons
            })

        return results


predictor = CashoutPredictor()

