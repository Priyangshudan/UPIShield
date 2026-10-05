"""
Evaluation Dataset Generator for UPIShield.
Extracts event-grouped candidate data and performs leakage-safe train/test splitting.
"""

import os
import sqlite3
from datetime import datetime
import numpy as np
import pandas as pd
from sklearn.model_selection import GroupShuffleSplit

from src.cashout_features import FEATURE_NAMES, build_candidate_feature_vectors, haversine_distance

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "sih_cybercrime.db")


def load_evaluation_data(db_path: str = DB_PATH):
    """Loads historical cashout events and canonical locations from DB."""
    if not os.path.exists(db_path):
        from backend.synthetic_data import seed_cybercrime_data
        seed_cybercrime_data()

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cashouts = [dict(r) for r in cursor.execute("SELECT * FROM historical_cashouts WHERE successful = 1").fetchall()]
    # Select distinct canonical locations (prefer LOC-DEL-* to avoid duplicated coordinates)
    locations = [dict(r) for r in cursor.execute("SELECT * FROM locations WHERE id LIKE 'LOC-DEL-%'").fetchall()]
    if not locations:
        locations = [dict(r) for r in cursor.execute("SELECT * FROM locations").fetchall()]
    conn.close()

    # Sort cashouts chronologically for temporal splitting capability
    cashouts.sort(key=lambda x: x["withdrawal_time"])

    return cashouts, locations


def build_event_groups(cashouts: list, locations: list, candidates_per_event: int = 14):
    """
    Builds event-grouped structures where each event contains candidate locations (default 14)
    and ground truth labels.
    """
    events_data = []

    for event in cashouts:
        event_id = event["id"]
        actual_loc_id = event["location_id"]

        w_time_str = event["withdrawal_time"]
        try:
            w_time = datetime.strptime(w_time_str, "%Y-%m-%d %H:%M:%S")
            hour = float(w_time.hour)
        except Exception:
            hour = 14.0

        last_hop_lat = float(event.get("last_hop_lat", 28.7120))
        last_hop_lon = float(event.get("last_hop_lon", 77.1190))

        event_info = {
            "event_id": event_id,
            "last_hop_lat": last_hop_lat,
            "last_hop_lon": last_hop_lon,
            "amount": float(event.get("amount", 270000.0)),
            "hour": hour,
            "withdrawal_time": w_time_str,
            "actual_location_id": actual_loc_id
        }

        # Select candidates for this event (closest candidates_per_event to last hop, ensuring actual_loc_id is included)
        if len(locations) > candidates_per_event:
            locs_with_dist = []
            for loc in locations:
                d = haversine_distance((last_hop_lat, last_hop_lon), (float(loc["latitude"]), float(loc["longitude"])))
                locs_with_dist.append((d, loc))
            locs_with_dist.sort(key=lambda x: x[0])
            event_locs = [x[1] for x in locs_with_dist[:candidates_per_event]]
            if not any(loc["id"] == actual_loc_id for loc in event_locs):
                # Ensure actual location is in candidate set
                actual_loc_obj = next((l for l in locations if l["id"] == actual_loc_id), None)
                if actual_loc_obj:
                    event_locs[-1] = actual_loc_obj
        else:
            event_locs = list(locations)

        # Build feature vectors using shared module
        feature_vecs = build_candidate_feature_vectors(event_info, event_locs)

        candidate_rows = []
        for loc, vec in zip(event_locs, feature_vecs):
            label = 1 if loc["id"] == actual_loc_id else 0
            candidate_rows.append({
                "event_id": event_id,
                "location_id": loc["id"],
                "location_name": loc["name"],
                "label": label,
                "features": vec,
                "location": loc,
                "event_info": event_info
            })

        events_data.append({
            "event_id": event_id,
            "event_info": event_info,
            "candidates": candidate_rows
        })

    return events_data


def get_leakage_safe_split(events_data: list, test_ratio: float = 0.2, method: str = "temporal"):
    """
    Splits dataset into train and test groups without leaking candidate rows from the same event.
    
    Methods:
      - 'temporal': Older events -> train, newer events -> test.
      - 'group': GroupShuffleSplit by event_id.
    """
    n_events = len(events_data)
    if method == "temporal":
        split_idx = int(n_events * (1.0 - test_ratio))
        train_events = events_data[:split_idx]
        test_events = events_data[split_idx:]
    else:
        gss = GroupShuffleSplit(n_splits=1, test_size=test_ratio, random_state=42)
        event_ids = np.array([e["event_id"] for e in events_data])
        dummy_X = np.zeros((len(event_ids), 1))
        train_idx, test_idx = next(gss.split(dummy_X, groups=event_ids))
        train_events = [events_data[i] for i in train_idx]
        test_events = [events_data[i] for i in test_idx]

    return train_events, test_events
