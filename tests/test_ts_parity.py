"""
Parity Verification Tests between Python Core Engines and Supabase TypeScript Engine Logic.
"""

import pytest
import math
from src.risk_engine import RiskEngine
from src.behavior import build_user_profile, score_behavioral_anomaly
from backend.ml.cashout_predictor import haversine_distance, predictor


def test_haversine_distance_parity():
    coord1 = (28.7120, 77.1190)
    coord2 = (28.7126, 77.1197)
    dist = haversine_distance(coord1, coord2)
    assert dist > 0
    assert round(dist, 3) == 0.095  # ~0.1 km


def test_risk_engine_parity_logic():
    engine = RiskEngine()
    tx = {
        "transaction_id": "TXN_TEST_001",
        "user_id": "USER_NEW_001",
        "amount": 65000.0,
        "device_new": True,
        "beneficiary_new": True,
        "hour": 2,
        "transaction_frequency": 6.0,
        "location": "unknown_vpn"
    }

    res = engine.evaluate_transaction(tx)
    assert res.decision == "BLOCK"
    assert res.final_score == 100.0
    assert res.history_status == "NO_HISTORY"


def test_cashout_predictor_parity_logic():
    raw_ranked = predictor.predict_top_locations(
        case_amount=270000.0,
        last_known_coord=(28.7120, 77.1190),
        top_k=4
    )

    assert len(raw_ranked) == 4
    top = raw_ranked[0]
    assert top["rank"] == 1
    assert top["risk_level"] == "CRITICAL"
    assert top["probability_score"] >= 0.65
    assert top["probability_score"] <= 0.96
