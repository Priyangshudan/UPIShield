import { BEHAVIOR_RISK_RULES, HISTORY_SUFFICIENT_MIN_TX } from "./config.ts";

export interface UserBehaviorProfile {
  user_id: string;
  tx_count: number;
  cohort: "NO_HISTORY" | "LIMITED_HISTORY" | "SUFFICIENT_HISTORY";
  avg_amount: number;
  median_amount: number;
  std_amount: number;
  min_amount: number;
  max_amount: number;
  p90_amount: number;
  known_devices: Set<string>;
  known_beneficiaries: Set<string>;
  known_locations: Set<string>;
  active_hours: Set<number>;
  min_active_hour: number;
  max_active_hour: number;
  avg_frequency: number;
}

export function extractHourFromTimeOrTs(tx: Record<string, any>): number {
  if (tx.hour !== undefined && tx.hour !== null) {
    return parseInt(String(tx.hour), 10);
  }
  if (tx.timestamp) {
    try {
      const dt = new Date(tx.timestamp);
      if (!isNaN(dt.getTime())) {
        return dt.getHours();
      }
    } catch (_e) {
      // Fallback
    }
  }
  return 12; // default midday fallback
}

function calculatePercentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (upper >= sorted.length) return sorted[sorted.length - 1];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function buildUserProfile(user_id: string, historyRows: Record<string, any>[] = []): UserBehaviorProfile {
  if (!historyRows || historyRows.length === 0) {
    return {
      user_id,
      tx_count: 0,
      cohort: "NO_HISTORY",
      avg_amount: 0.0,
      median_amount: 0.0,
      std_amount: 0.0,
      min_amount: 0.0,
      max_amount: 0.0,
      p90_amount: 0.0,
      known_devices: new Set(),
      known_beneficiaries: new Set(),
      known_locations: new Set(),
      active_hours: new Set(),
      min_active_hour: 0,
      max_active_hour: 23,
      avg_frequency: 0.0
    };
  }

  // Filter normal (non-fraud) transactions for baseline learning if available
  let baselineRows = historyRows.filter((r) => r.fraud_label === 0 || r.fraud_label === "0");
  if (baselineRows.length === 0) {
    baselineRows = historyRows;
  }

  const tx_count = baselineRows.length;
  let cohort: "NO_HISTORY" | "LIMITED_HISTORY" | "SUFFICIENT_HISTORY" = "NO_HISTORY";
  if (tx_count === 0) {
    cohort = "NO_HISTORY";
  } else if (tx_count < HISTORY_SUFFICIENT_MIN_TX) {
    cohort = "LIMITED_HISTORY";
  } else {
    cohort = "SUFFICIENT_HISTORY";
  }

  const amounts = baselineRows.map((r) => parseFloat(r.amount || 0));
  const avg_amount = tx_count > 0 ? amounts.reduce((a, b) => a + b, 0) / tx_count : 0.0;
  const median_amount = tx_count > 0 ? calculatePercentile(amounts, 50) : 0.0;
  
  let std_amount = 0.0;
  if (tx_count > 1) {
    const variance = amounts.reduce((acc, val) => acc + Math.pow(val - avg_amount, 2), 0) / (tx_count - 1);
    std_amount = Math.sqrt(variance);
  }

  const min_amount = tx_count > 0 ? Math.min(...amounts) : 0.0;
  const max_amount = tx_count > 0 ? Math.max(...amounts) : 0.0;
  const p90_amount = tx_count > 0 ? calculatePercentile(amounts, 90) : 0.0;

  const known_devices = new Set<string>();
  const known_beneficiaries = new Set<string>();
  const known_locations = new Set<string>();
  const active_hours = new Set<number>();

  baselineRows.forEach((r) => {
    if (r.device_id) known_devices.add(String(r.device_id));
    if (r.beneficiary_id || r.receiver_id) known_beneficiaries.add(String(r.beneficiary_id || r.receiver_id));
    if (r.location) known_locations.add(String(r.location));
    if (r.timestamp) {
      try {
        const dt = new Date(r.timestamp);
        if (!isNaN(dt.getTime())) {
          active_hours.add(dt.getHours());
        }
      } catch (_e) {
        // ignore
      }
    }
  });

  const activeHoursArr = Array.from(active_hours);
  const min_active_hour = activeHoursArr.length > 0 ? Math.min(...activeHoursArr) : 0;
  const max_active_hour = activeHoursArr.length > 0 ? Math.max(...activeHoursArr) : 23;

  const freqs = baselineRows
    .map((r) => parseFloat(r.transaction_frequency))
    .filter((v) => !isNaN(v));
  const avg_frequency = freqs.length > 0 ? freqs.reduce((a, b) => a + b, 0) / freqs.length : 1.0;

  return {
    user_id,
    tx_count,
    cohort,
    avg_amount,
    median_amount,
    std_amount,
    min_amount,
    max_amount,
    p90_amount,
    known_devices,
    known_beneficiaries,
    known_locations,
    active_hours,
    min_active_hour,
    max_active_hour,
    avg_frequency
  };
}

export function scoreBehavioralAnomaly(
  tx: Record<string, any>,
  profile: UserBehaviorProfile
): [number, string[], Record<string, any>] {
  const reasons: string[] = [];
  const metrics: Record<string, any> = {
    cohort: profile.cohort,
    tx_count: profile.tx_count,
    amount_multiplier: 1.0,
    device_known: true,
    beneficiary_known: true,
    hour_within_profile: true,
    location_known: true
  };

  if (profile.cohort === "NO_HISTORY" || profile.tx_count === 0) {
    return [0.0, ["No prior user transaction history available; relying on General Risk Engine."], metrics];
  }

  let raw_score = 0.0;
  const amount = parseFloat(tx.amount || 0);
  const device_id = String(tx.device_id || "");
  const beneficiary_id = String(tx.beneficiary_id || tx.receiver_id || "");
  const location = String(tx.location || "");
  const hour = extractHourFromTimeOrTs(tx);
  const freq = parseFloat(tx.transaction_frequency || 1.0);

  const baseline_amt = profile.median_amount > 0 ? profile.median_amount : (profile.avg_amount > 0 ? profile.avg_amount : 1.0);
  const amt_mult = baseline_amt > 0 ? amount / baseline_amt : 1.0;
  metrics["amount_multiplier"] = parseFloat(amt_mult.toFixed(2));

  // 1. Amount deviation checks
  if (amt_mult >= BEHAVIOR_RISK_RULES.amount_massive_spike.multiplier) {
    raw_score += BEHAVIOR_RISK_RULES.amount_massive_spike.points;
    reasons.push(
      `Personalized Anomaly: Transaction amount (₹${amount.toLocaleString("en-IN")}) is ${amt_mult.toFixed(1)}x higher than typical baseline (₹${baseline_amt.toLocaleString("en-IN")})`
    );
  } else if (amt_mult >= BEHAVIOR_RISK_RULES.amount_large_spike.multiplier) {
    raw_score += BEHAVIOR_RISK_RULES.amount_large_spike.points;
    reasons.push(
      `Personalized Anomaly: Transaction amount (₹${amount.toLocaleString("en-IN")}) is ${amt_mult.toFixed(1)}x higher than typical baseline (₹${baseline_amt.toLocaleString("en-IN")})`
    );
  } else if (amt_mult >= BEHAVIOR_RISK_RULES.amount_moderate_spike.multiplier) {
    raw_score += BEHAVIOR_RISK_RULES.amount_moderate_spike.points;
    reasons.push(
      `Personalized Anomaly: Transaction amount (₹${amount.toLocaleString("en-IN")}) is ${amt_mult.toFixed(1)}x higher than personal median (₹${baseline_amt.toLocaleString("en-IN")})`
    );
  }

  if (profile.max_amount > 0 && amount > profile.max_amount * 1.5) {
    raw_score += BEHAVIOR_RISK_RULES.amount_exceeds_max.points;
    reasons.push(
      `Personalized Anomaly: Amount exceeds previous highest recorded transaction (₹${profile.max_amount.toLocaleString("en-IN")}) by >50%`
    );
  }

  // 2. Device familiarity check
  if (profile.known_devices.size > 0 && !profile.known_devices.has(device_id)) {
    metrics.device_known = false;
    raw_score += BEHAVIOR_RISK_RULES.unseen_device.points;
    const knownArr = Array.from(profile.known_devices);
    reasons.push(
      `Personalized Anomaly: Unrecognized device (${device_id}). User normally transacts with: ${knownArr.join(", ")}`
    );
  }

  // 3. Beneficiary familiarity check
  if (profile.known_beneficiaries.size > 0 && !profile.known_beneficiaries.has(beneficiary_id)) {
    metrics.beneficiary_known = false;
    raw_score += BEHAVIOR_RISK_RULES.unseen_beneficiary.points;
    reasons.push(
      `Personalized Anomaly: First-time transfer to beneficiary (${beneficiary_id}). Not in user's regular recipient circle.`
    );
  }

  // 4. Temporal deviation check
  if (profile.active_hours.size > 0) {
    if (!profile.active_hours.has(hour)) {
      metrics.hour_within_profile = false;
      raw_score += BEHAVIOR_RISK_RULES.unusual_user_hour.points;
      const minH = String(profile.min_active_hour).padStart(2, "0");
      const maxH = String(profile.max_active_hour).padStart(2, "0");
      const hStr = String(hour).padStart(2, "0");
      reasons.push(
        `Personalized Anomaly: Transaction at ${hStr}:00 is outside user's active window (${minH}:00 - ${maxH}:00)`
      );
    }
  }

  // 5. Location familiarity check
  if (profile.known_locations.size > 0 && location && !profile.known_locations.has(location)) {
    metrics.location_known = false;
    raw_score += BEHAVIOR_RISK_RULES.unseen_location.points;
    const knownLocs = Array.from(profile.known_locations);
    reasons.push(
      `Personalized Anomaly: Unfamiliar location (${location}). User usually operates from: ${knownLocs.join(", ")}`
    );
  }

  // 6. Frequency anomaly check
  if (profile.avg_frequency > 0 && freq >= profile.avg_frequency * BEHAVIOR_RISK_RULES.frequency_surge.multiplier) {
    raw_score += BEHAVIOR_RISK_RULES.frequency_surge.points;
    reasons.push(
      `Personalized Anomaly: Sudden velocity surge (${freq.toFixed(1)} tx/hr vs personal average of ${profile.avg_frequency.toFixed(1)} tx/hr)`
    );
  }

  const behavioral_score = Math.min(100.0, Math.max(0.0, parseFloat(raw_score.toFixed(1))));
  return [behavioral_score, reasons, metrics];
}
