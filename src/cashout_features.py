"""
Shared Feature Engineering for Cash-Out Location Risk Prediction.
Ensures identical 7-feature calculation across training, evaluation, and production.
"""

import math
from typing import Dict, Any, List, Tuple

FEATURE_NAMES = [
    "distance_km",
    "historical_fraud_count",
    "cctv_available",
    "is_csp",
    "case_amount",
    "cashout_hour",
    "distance_rank",
]


def haversine_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """Calculates geodesic distance in kilometers between two (lat, lon) coordinates."""
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371.0  # Earth radius in km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def parse_bool_feature(val: Any) -> float:
    """
    Robust conversion of boolean, numeric, string, or None representation to 1.0 / 0.0.
    
    Semantics:
      - True -> 1.0, False -> 0.0
      - Nonzero number -> 1.0, Zero number -> 0.0
      - Strings ("1", "true", "yes") -> 1.0
      - Strings ("0", "false", "no") -> 0.0
      - Unknown / None -> 0.0
    """
    if val is None:
        return 0.0
    if isinstance(val, bool):
        return 1.0 if val else 0.0
    if isinstance(val, (int, float)):
        return 1.0 if val != 0 else 0.0
    if isinstance(val, str):
        s = val.strip().lower()
        if s in ("1", "true", "yes"):
            return 1.0
        if s in ("0", "false", "no"):
            return 0.0
    return 0.0


def build_candidate_feature_vectors(
    event_info: Dict[str, Any],
    candidate_locations: List[Dict[str, Any]]
) -> List[List[float]]:
    """
    Builds feature vectors for a list of candidate locations for a specific cash-out event.
    Returns exactly 7 features per candidate in FEATURE_NAMES order.
    """
    last_hop = (float(event_info["last_hop_lat"]), float(event_info["last_hop_lon"]))
    case_amount = float(event_info.get("amount", 270000.0))
    cashout_hour = float(event_info.get("hour", 14.0))

    # 1. Compute Haversine distance and build guaranteed-unique candidate keys
    candidates_with_dist = []
    for idx, loc in enumerate(candidate_locations):
        loc_coord = (float(loc["latitude"]), float(loc["longitude"]))
        dist = haversine_distance(last_hop, loc_coord)
        raw_id = str(loc.get("id") or loc.get("location_id") or "")
        if raw_id:
            unique_key = f"{raw_id}___{idx}"
        else:
            unique_key = f"idx_{idx}"
        candidates_with_dist.append((dist, loc, unique_key, idx))

    # 2. Sort candidates by distance ascending, with deterministic tie-breaking by unique_key
    sorted_by_dist = sorted(candidates_with_dist, key=lambda x: (round(x[0], 9), x[2]))

    # 3. Build rank map (closest candidate = rank 1)
    dist_rank_map = {}
    for rank_idx, (dist, loc, unique_key, idx) in enumerate(sorted_by_dist, 1):
        dist_rank_map[unique_key] = float(rank_idx)

    # 4. Construct feature vectors in ORIGINAL candidate order
    feature_vectors = []
    for dist, loc, unique_key, idx in candidates_with_dist:
        fraud_cnt = float(loc.get("historical_fraud_count", 0))
        cctv = parse_bool_feature(loc.get("cctv_available"))
        is_csp = 1.0 if str(loc.get("type", "")).upper() == "CSP" else 0.0
        dist_rank = float(dist_rank_map[unique_key])

        vec = [
            round(dist, 4),
            fraud_cnt,
            cctv,
            is_csp,
            case_amount,
            cashout_hour,
            dist_rank
        ]
        feature_vectors.append(vec)

    return feature_vectors

