import { CashoutPredictionItem, CashoutPredictionResponse } from "./types.ts";
import { buildCandidateFeatureVectors, CandidateLocationInput, EventInfo, haversineDistance } from "./cashout_features.ts";
import { CASHOUT_MODEL_DATA } from "./models/cashout_model.ts";

export { haversineDistance };

export interface ModelNode {
  feature: number;
  threshold: number;
  left: number;
  right: number;
  value: number;
}

export interface ModelTree {
  nodes: readonly ModelNode[] | ModelNode[];
}

export interface GBModel {
  model_version: string;
  feature_names: readonly string[] | string[];
  learning_rate: number;
  init_value: number;
  trees: readonly ModelTree[] | ModelTree[];
}

/**
 * Evaluates a single decision tree given a feature vector.
 */
export function evaluateTree(nodes: readonly ModelNode[], featureVector: number[]): number {
  let curr = 0;
  while (curr >= 0 && curr < nodes.length && nodes[curr].feature !== -1 && nodes[curr].left !== -1) {
    const featIdx = nodes[curr].feature;
    const val = featureVector[featIdx];
    if (val <= nodes[curr].threshold) {
      curr = nodes[curr].left;
    } else {
      curr = nodes[curr].right;
    }
  }
  return nodes[curr] ? nodes[curr].value : 0.0;
}

/**
 * Evaluates exported Gradient Boosting Classifier model to return predicted probability P(y = 1 | X).
 */
export function predictProbability(model: GBModel, featureVector: number[]): number {
  let rawF = model.init_value;
  for (const tree of model.trees) {
    rawF += model.learning_rate * evaluateTree(tree.nodes, featureVector);
  }
  return 1.0 / (1.0 + Math.exp(-rawF));
}

export async function predictTopLocations(
  caseAmount: number,
  lastKnownCoord: [number, number] = [28.7120, 77.1190],
  incidentHour: number = 14,
  topK = 4,
  supabaseClient: any
): Promise<CashoutPredictionItem[]> {
  const { data: locRows, error } = await supabaseClient.from("locations").select("*");

  if (error || !locRows || locRows.length === 0) {
    return [];
  }

  const eventInfo: EventInfo = {
    last_hop_lat: lastKnownCoord[0],
    last_hop_lon: lastKnownCoord[1],
    amount: caseAmount,
    hour: incidentHour
  };

  const featureVectors = buildCandidateFeatureVectors(eventInfo, locRows);

  const candidates: { loc: any; dist: number; prob: number }[] = [];

  locRows.forEach((loc: any, idx: number) => {
    const fVec = featureVectors[idx];
    const dist = fVec[0]; // distance_km
    const rawProb = predictProbability(CASHOUT_MODEL_DATA as unknown as GBModel, fVec);
    const prob = parseFloat(rawProb.toFixed(3));

    candidates.push({
      loc,
      dist,
      prob
    });
  });

  // Sort candidates by predicted probability descending
  candidates.sort((a, b) => b.prob - a.prob);
  const topCandidates = candidates.slice(0, topK);

  const results: CashoutPredictionItem[] = [];

  topCandidates.forEach((item, idx) => {
    const loc = item.loc;
    const dist = item.dist;
    const prob = item.prob;
    const rank = idx + 1;

    let risk_lvl: "CRITICAL" | "HIGH" | "MODERATE" = "MODERATE";
    if (rank === 1 || prob >= 0.70) {
      risk_lvl = "CRITICAL";
    } else if (prob >= 0.40) {
      risk_lvl = "HIGH";
    } else {
      risk_lvl = "MODERATE";
    }

    let time_win = "40 - 75 mins";
    if (dist < 2.0) {
      time_win = "10 - 25 mins";
    } else if (dist < 5.0) {
      time_win = "20 - 45 mins";
    }

    // Honest factor explanations based strictly on candidate feature values
    const reasons: string[] = [];
    if (loc.historical_fraud_count >= 10) {
      reasons.push(`High historical cashout cluster (${loc.historical_fraud_count} past incidents)`);
    }
    if (dist <= 3.0) {
      reasons.push(`Immediate spatial proximity (${dist.toFixed(1)} km from runner hop)`);
    }
    if (loc.type === "CSP") {
      reasons.push("High-risk Micro-ATM / CSP agent vulnerability");
    }
    if (!loc.cctv_available) {
      reasons.push("No active CCTV surveillance coverage recorded");
    }
    if (reasons.length === 0) {
      reasons.push("Multi-factor spatial likelihood alignment");
    }

    results.push({
      rank,
      location_id: loc.id,
      name: loc.name,
      type: loc.type,
      bank: loc.bank,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
      probability_score: prob,
      risk_level: risk_lvl,
      distance_km: parseFloat(dist.toFixed(2)),
      estimated_time_window: time_win,
      reason_factors: reasons
    });
  });

  return results;
}

export async function predictCaseCashout(caseId: string, supabaseClient: any): Promise<CashoutPredictionResponse> {
  const { data: caseRow } = await supabaseClient.from("cases").select("*").eq("id", caseId).single();

  const target_amount = caseRow ? parseFloat(caseRow.total_amount_lost) : 270000.0;
  
  let incident_hour = 14;
  if (caseRow && caseRow.created_at) {
    try {
      const dt = new Date(caseRow.created_at);
      incident_hour = dt.getHours();
    } catch {
      incident_hour = 14;
    }
  }

  const last_coord: [number, number] = [28.7120, 77.1190];

  const items = await predictTopLocations(target_amount, last_coord, incident_hour, 4, supabaseClient);

  const methodology =
    "Supervised Gradient Boosting Classifier model (v3.0.0) trained on synthetic historical cash withdrawals. " +
    "Evaluated geodesic spatial proximity to runner hop, kiosk historical fraud density, " +
    "CSP agent vulnerability index, CCTV presence, transaction amount, and incident hour.";

  const recommended_actions = [
    "Dispatch tactical cyber patrol / PCR van to Rank #1 hotspot (" + (items[0]?.name || "Sector 7 Rohini") + ").",
    "Issue immediate debit freeze instruction to SBI & Paytm Payments Bank nodal fraud desk.",
    "Broadcast suspect device IMEI and runner token to I4C Joint Cybercrime Coordination."
  ];

  return {
    case_id: caseId,
    target_amount,
    predicted_locations: items,
    model_version: "SIH-ML-Cashout-GBClassifier-v3.0.0",
    methodology_note: methodology,
    recommended_actions
  };
}

