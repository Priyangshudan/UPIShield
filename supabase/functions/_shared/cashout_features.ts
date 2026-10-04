export const FEATURE_NAMES = [
  "distance_km",
  "historical_fraud_count",
  "cctv_available",
  "is_csp",
  "case_amount",
  "cashout_hour",
  "distance_rank",
] as const;

export function haversineDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371.0; // Earth radius in km

  const dlat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dlon = ((lon2 - lon1) * Math.PI) / 180.0;
  const a =
    Math.sin(dlat / 2.0) ** 2 +
    Math.cos((lat1 * Math.PI) / 180.0) * Math.cos((lat2 * Math.PI) / 180.0) * Math.sin(dlon / 2.0) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function parseBoolFeature(val: unknown): number {
  if (val === null || val === undefined) {
    return 0.0;
  }
  if (typeof val === "boolean") {
    return val ? 1.0 : 0.0;
  }
  if (typeof val === "number") {
    return val !== 0 ? 1.0 : 0.0;
  }
  if (typeof val === "string") {
    const s = val.trim().toLowerCase();
    if (s === "1" || s === "true" || s === "yes") {
      return 1.0;
    }
    if (s === "0" || s === "false" || s === "no") {
      return 0.0;
    }
  }
  return 0.0;
}

export interface EventInfo {
  last_hop_lat: number;
  last_hop_lon: number;
  amount: number;
  hour: number;
}

export interface CandidateLocationInput {
  id?: string;
  location_id?: string;
  latitude: number | string;
  longitude: number | string;
  historical_fraud_count?: number | string;
  cctv_available?: boolean | number | string;
  type?: string;
}

export function buildCandidateFeatureVectors(
  eventInfo: EventInfo,
  candidateLocations: CandidateLocationInput[]
): number[][] {
  const lastHop: [number, number] = [eventInfo.last_hop_lat, eventInfo.last_hop_lon];
  const caseAmount = eventInfo.amount;
  const cashoutHour = eventInfo.hour;

  // 1. Compute Haversine distance and build guaranteed-unique candidate keys
  const candidatesWithDist = candidateLocations.map((loc, idx) => {
    const lat = typeof loc.latitude === "string" ? parseFloat(loc.latitude) : loc.latitude;
    const lon = typeof loc.longitude === "string" ? parseFloat(loc.longitude) : loc.longitude;
    const dist = haversineDistance(lastHop, [lat, lon]);
    const rawId = String(loc.id || loc.location_id || "");
    const uniqueKey = rawId ? `${rawId}___${idx}` : `idx_${idx}`;
    return { dist, loc, uniqueKey, origIdx: idx };
  });

  // 2. Sort candidates by distance ascending, with deterministic tie-breaking by uniqueKey
  const sorted = [...candidatesWithDist].sort((a, b) => {
    if (Math.abs(a.dist - b.dist) > 1e-9) {
      return a.dist - b.dist;
    }
    return a.uniqueKey.localeCompare(b.uniqueKey);
  });

  // 3. Build rank map (closest candidate = rank 1)
  const rankMap = new Map<string, number>();
  sorted.forEach((item, idx) => {
    rankMap.set(item.uniqueKey, idx + 1);
  });

  // 4. Construct feature vectors in ORIGINAL candidate order
  return candidatesWithDist.map((item) => {
    const loc = item.loc;
    const fraudCnt = typeof loc.historical_fraud_count === "string"
      ? parseFloat(loc.historical_fraud_count)
      : (loc.historical_fraud_count || 0);
    const cctv = parseBoolFeature(loc.cctv_available);
    const isCsp = String(loc.type || "").toUpperCase() === "CSP" ? 1.0 : 0.0;
    const distRank = rankMap.get(item.uniqueKey) || 1.0;

    return [
      parseFloat(item.dist.toFixed(4)),
      fraudCnt,
      cctv,
      isCsp,
      caseAmount,
      cashoutHour,
      distRank
    ];
  });
}
