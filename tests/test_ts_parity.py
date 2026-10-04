"""
Parity, Feature Engineering, & Model Inference Verification Tests for UPIShield.
Validates exact mathematical parity between Python GradientBoostingClassifier,
exported JSON model structure, and TypeScript prediction engine logic.
"""

import unittest
import json
import os
import math
import numpy as np

from src.cashout_features import FEATURE_NAMES, build_candidate_feature_vectors, haversine_distance, parse_bool_feature
from training.train_cashout_model import train_and_export_model
from backend.ml.cashout_predictor import predictor


def evaluate_exported_json_model(model_data: dict, feature_vector: list) -> float:
    """Python reference implementation of the TypeScript model inference engine."""
    init_val = float(model_data["init_value"])
    learning_rate = float(model_data["learning_rate"])
    trees = model_data["trees"]

    raw_f = init_val
    for tree in trees:
        nodes = tree["nodes"]
        curr = 0
        while curr >= 0 and curr < len(nodes) and nodes[curr]["feature"] != -1 and nodes[curr]["left"] != -1:
            feat_idx = nodes[curr]["feature"]
            val = feature_vector[feat_idx]
            if val <= nodes[curr]["threshold"]:
                curr = nodes[curr]["left"]
            else:
                curr = nodes[curr]["right"]
        leaf_val = nodes[curr]["value"] if curr < len(nodes) else 0.0
        raw_f += learning_rate * leaf_val

    prob = 1.0 / (1.0 + math.exp(-raw_f))
    return prob


class TestModelParityAndInference(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.clf, cls.model_payload = train_and_export_model()

    def test_a_feature_count(self):
        """Test A: Every candidate vector has exactly 7 feature values."""
        event_info = {"last_hop_lat": 28.7120, "last_hop_lon": 77.1190, "amount": 270000.0, "hour": 14.0}
        locs = [{"id": "L1", "latitude": 28.7126, "longitude": 77.1197, "historical_fraud_count": 10, "cctv_available": 1, "type": "ATM"}]
        vecs = build_candidate_feature_vectors(event_info, locs)
        self.assertEqual(len(vecs[0]), 7)

    def test_b_feature_ordering(self):
        """Test B: FEATURE_NAMES matches exact required 7-feature order."""
        expected = [
            "distance_km",
            "historical_fraud_count",
            "cctv_available",
            "is_csp",
            "case_amount",
            "cashout_hour",
            "distance_rank"
        ]
        self.assertEqual(FEATURE_NAMES, expected)

    def test_c_boolean_parsing(self):
        """Test C: parse_bool_feature handles all boolean, numeric, string, and whitespace representations."""
        test_cases = [
            (True, 1.0),
            (False, 0.0),
            (1, 1.0),
            (0, 0.0),
            ("1", 1.0),
            ("0", 0.0),
            ("true", 1.0),
            ("false", 0.0),
            ("TRUE", 1.0),
            ("FALSE", 0.0),
            ("yes", 1.0),
            ("no", 0.0),
            (" yes ", 1.0),
            (" false ", 0.0),
            (None, 0.0)
        ]
        for val, expected in test_cases:
            self.assertEqual(parse_bool_feature(val), expected, f"Failed for val: {val}")

    def test_d_distance_ranking(self):
        """Test D: Candidate distance ranking assigns rank 1 to nearest, rank 2 to second nearest."""
        event_info = {"last_hop_lat": 28.7120, "last_hop_lon": 77.1190, "amount": 100000.0, "hour": 12.0}
        locs = [
            {"id": "FAR", "latitude": 28.8000, "longitude": 77.3000, "historical_fraud_count": 0, "cctv_available": 0, "type": "ATM"},
            {"id": "CLOSE", "latitude": 28.7121, "longitude": 77.1191, "historical_fraud_count": 0, "cctv_available": 0, "type": "ATM"}
        ]
        vecs = build_candidate_feature_vectors(event_info, locs)
        # locs[0] is FAR (rank 2.0), locs[1] is CLOSE (rank 1.0)
        self.assertEqual(vecs[0][6], 2.0)
        self.assertEqual(vecs[1][6], 1.0)

    def test_e_deterministic_ties(self):
        """Test E: Identical candidate distances produce deterministic ranks via unique_key tie-breaking."""
        event_info = {"last_hop_lat": 28.7120, "last_hop_lon": 77.1190, "amount": 100000.0, "hour": 12.0}
        locs = [
            {"id": "LOC_B", "latitude": 28.7126, "longitude": 77.1197, "historical_fraud_count": 0, "cctv_available": 0, "type": "ATM"},
            {"id": "LOC_A", "latitude": 28.7126, "longitude": 77.1197, "historical_fraud_count": 0, "cctv_available": 0, "type": "ATM"}
        ]
        vecs_run1 = build_candidate_feature_vectors(event_info, locs)
        vecs_run2 = build_candidate_feature_vectors(event_info, locs)
        self.assertEqual(vecs_run1, vecs_run2)
        # LOC_A___1 sorts before LOC_B___0 alphabetically, so LOC_A gets rank 1, LOC_B gets rank 2
        self.assertEqual(vecs_run1[0][6], 2.0) # LOC_B
        self.assertEqual(vecs_run1[1][6], 1.0) # LOC_A

    def test_f_duplicate_ids(self):
        """Test F: Duplicate location IDs do not overwrite each other in the rank map."""
        event_info = {"last_hop_lat": 28.7120, "last_hop_lon": 77.1190, "amount": 100000.0, "hour": 12.0}
        locs = [
            {"id": "SAME_ID", "latitude": 28.7126, "longitude": 77.1197, "historical_fraud_count": 0, "cctv_available": 0, "type": "ATM"},
            {"id": "SAME_ID", "latitude": 28.8000, "longitude": 77.3000, "historical_fraud_count": 0, "cctv_available": 0, "type": "ATM"}
        ]
        vecs = build_candidate_feature_vectors(event_info, locs)
        ranks = [vecs[0][6], vecs[1][6]]
        self.assertEqual(sorted(ranks), [1.0, 2.0])

    def test_g_missing_ids(self):
        """Test G: Missing location IDs fall back safely to index keys (idx_0, idx_1)."""
        event_info = {"last_hop_lat": 28.7120, "last_hop_lon": 77.1190, "amount": 100000.0, "hour": 12.0}
        locs = [
            {"latitude": 28.8000, "longitude": 77.3000, "historical_fraud_count": 0, "cctv_available": 0, "type": "ATM"},
            {"latitude": 28.7121, "longitude": 77.1191, "historical_fraud_count": 0, "cctv_available": 0, "type": "ATM"}
        ]
        vecs = build_candidate_feature_vectors(event_info, locs)
        ranks = [vecs[0][6], vecs[1][6]]
        self.assertEqual(ranks[0], 2.0)
        self.assertEqual(ranks[1], 1.0)

    def test_h_python_ts_model_parity_and_shape(self):
        """Test H: GBDT expects 7 input features and TS engine reproduces sklearn probabilities within 1e-6."""
        self.assertEqual(self.clf.n_features_in_, 7)
        self.assertEqual(len(self.model_payload["feature_names"]), 7)

        sample_vectors = [
            [0.095, 10.0, 1.0, 0.0, 270000.0, 14.0, 1.0],
            [1.245, 5.0, 0.0, 1.0, 120000.0, 10.0, 2.0],
            [8.502, 0.0, 1.0, 0.0, 50000.0, 22.0, 5.0]
        ]

        for vec in sample_vectors:
            sk_prob = float(self.clf.predict_proba(np.array([vec]))[0, 1])
            ts_engine_prob = evaluate_exported_json_model(self.model_payload, vec)
            diff = abs(sk_prob - ts_engine_prob)
            self.assertLess(diff, 1e-6, f"Parity failure: sk={sk_prob}, ts={ts_engine_prob}, diff={diff}")


if __name__ == "__main__":
    unittest.main()
