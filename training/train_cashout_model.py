"""
Offline Training Pipeline for UPIShield Cash-Out Risk Predictor.
Trains GradientBoostingClassifier on event-grouped candidate ranking data
and exports the model artifact to Supabase Edge Functions.
"""

import os
import sqlite3
from datetime import datetime
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

from src.cashout_features import FEATURE_NAMES, build_candidate_feature_vectors
from training.export_model import export_gb_model_to_json, save_exported_model

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "sih_cybercrime.db")


def load_raw_dataset_from_db(db_path: str = DB_PATH):
    """
    Loads historical cashout events and candidate locations from SQLite DB.
    Ensures dataset exists by initializing if missing.
    """
    if not os.path.exists(db_path):
        from backend.synthetic_data import seed_cybercrime_data
        seed_cybercrime_data()

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cashouts = [dict(r) for r in cursor.execute("SELECT * FROM historical_cashouts WHERE successful = 1").fetchall()]
    locations = [dict(r) for r in cursor.execute("SELECT * FROM locations").fetchall()]
    conn.close()

    return cashouts, locations


def prepare_training_dataset(cashouts: list, locations: list):
    """
    Constructs candidate-level feature matrix X, binary labels y, and event group identifiers.
    
    For each historical cashout event:
      - Actual location = positive label (y = 1)
      - Every other ATM/CSP location = negative label (y = 0)
    """
    X_all = []
    y_all = []
    groups_all = []
    event_ids = []

    for event in cashouts:
        event_id = event["id"]
        actual_loc_id = event["location_id"]
        
        # Parse withdrawal hour
        w_time_str = event["withdrawal_time"]
        try:
            w_time = datetime.strptime(w_time_str, "%Y-%m-%d %H:%M:%S")
            hour = float(w_time.hour)
        except Exception:
            hour = 14.0

        event_info = {
            "last_hop_lat": float(event.get("last_hop_lat", 28.7120)),
            "last_hop_lon": float(event.get("last_hop_lon", 77.1190)),
            "amount": float(event.get("amount", 270000.0)),
            "hour": hour
        }

        # Build feature vectors for all candidate locations
        feature_vecs = build_candidate_feature_vectors(event_info, locations)

        for loc, vec in zip(locations, feature_vecs):
            label = 1 if loc["id"] == actual_loc_id else 0
            X_all.append(vec)
            y_all.append(label)
            groups_all.append(event_id)

        event_ids.append(event_id)

    X_all = np.array(X_all, dtype=np.float64)
    y_all = np.array(y_all, dtype=np.int32)
    groups_all = np.array(groups_all)

    return X_all, y_all, groups_all, event_ids


def train_and_export_model():
    """Trains the GradientBoostingClassifier model and saves export files."""
    cashouts, locations = load_raw_dataset_from_db()
    print(f"[INFO] Loaded {len(cashouts)} historical events and {len(locations)} locations.")

    X, y, groups, event_ids = prepare_training_dataset(cashouts, locations)
    print(f"[INFO] Constructed {len(X)} candidate samples across {len(event_ids)} historical events.")
    print(f"[INFO] Positives: {np.sum(y == 1)}, Negatives: {np.sum(y == 0)}")

    clf = GradientBoostingClassifier(
        n_estimators=50,
        max_depth=3,
        learning_rate=0.1,
        random_state=42
    )
    clf.fit(X, y)
    print("[SUCCESS] Trained GradientBoostingClassifier model successfully.")

    metadata = {
        "dataset_name": "Delhi-NCR Synthetic Cybercrime Historical Cashouts",
        "num_events": len(event_ids),
        "num_locations": len(locations),
        "total_samples": len(X),
        "positive_samples": int(np.sum(y == 1)),
        "negative_samples": int(np.sum(y == 0)),
        "trained_at": datetime.now().isoformat()
    }

    model_payload = export_gb_model_to_json(
        model=clf,
        feature_names=FEATURE_NAMES,
        model_version="SIH-ML-Cashout-GBClassifier-v2.0.0",
        metadata=metadata
    )

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, "supabase", "functions", "_shared", "models", "cashout_model.json")
    ts_path = os.path.join(base_dir, "supabase", "functions", "_shared", "models", "cashout_model.ts")

    save_exported_model(model_payload, json_path, ts_path)
    return clf, model_payload


if __name__ == "__main__":
    train_and_export_model()

