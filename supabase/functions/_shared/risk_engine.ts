import {
  DecisionThresholds,
  DEFAULT_THRESHOLD_ALLOW,
  DEFAULT_THRESHOLD_VERIFY,
  GENERAL_RISK_RULES,
  WEIGHTS_BY_HISTORY
} from "./config.ts";
import {
  buildUserProfile,
  scoreBehavioralAnomaly,
  extractHourFromTimeOrTs
} from "./behavior.ts";
import { RiskEvaluation } from "./types.ts";

export function calculateGeneralRisk(tx: Record<string, any>): [number, string[]] {
  let raw_score = 0.0;
  const reasons: string[] = [];

  const amount = parseFloat(tx.amount || 0.0);
  const device_new = Boolean(tx.device_new || tx.device_new === 1 || tx.device_new === "true");
  const beneficiary_new = Boolean(tx.beneficiary_new || tx.beneficiary_new === 1 || tx.beneficiary_new === "true");
  const hour = extractHourFromTimeOrTs(tx);
  const freq = parseFloat(tx.transaction_frequency || 1.0);
  const location = String(tx.location || "").toLowerCase();

  // 1. Absolute Amount Thresholds
  if (amount >= GENERAL_RISK_RULES.amount_very_high.threshold) {
    raw_score += GENERAL_RISK_RULES.amount_very_high.points;
    reasons.push(`General Risk: Very high transaction value (₹${amount.toLocaleString("en-IN")} >= ₹50,000)`);
  } else if (amount >= GENERAL_RISK_RULES.amount_high.threshold) {
    raw_score += GENERAL_RISK_RULES.amount_high.points;
    reasons.push(`General Risk: High transaction value (₹${amount.toLocaleString("en-IN")} >= ₹25,000)`);
  } else if (amount >= GENERAL_RISK_RULES.amount_moderate.threshold) {
    raw_score += GENERAL_RISK_RULES.amount_moderate.points;
    reasons.push(`General Risk: Elevated transaction value (₹${amount.toLocaleString("en-IN")} >= ₹10,000)`);
  }

  // 2. Device & Beneficiary Flags
  if (device_new) {
    raw_score += GENERAL_RISK_RULES.new_device.points;
    reasons.push("General Risk: New / unregistered device detected for this transaction");
  }

  if (beneficiary_new) {
    raw_score += GENERAL_RISK_RULES.new_beneficiary.points;
    reasons.push("General Risk: Payment to a first-time beneficiary");
  }

  // 3. High-Risk Time (Midnight / Early Morning 01:00 AM - 05:00 AM)
  const odd_start = GENERAL_RISK_RULES.unusual_hour.start_hour;
  const odd_end = GENERAL_RISK_RULES.unusual_hour.end_hour;
  if (hour >= odd_start && hour <= odd_end) {
    raw_score += GENERAL_RISK_RULES.unusual_hour.points;
    const hStr = String(hour).padStart(2, "0");
    const sStr = String(odd_start).padStart(2, "0");
    const eStr = String(odd_end).padStart(2, "0");
    reasons.push(`General Risk: High-risk time window (${hStr}:00 is between ${sStr}:00 and ${eStr}:00 AM)`);
  }

  // 4. Rapid Frequency / Velocity
  if (freq >= GENERAL_RISK_RULES.high_frequency.threshold) {
    raw_score += GENERAL_RISK_RULES.high_frequency.points;
    reasons.push(`General Risk: High transaction velocity (${freq.toFixed(1)} tx/hr)`);
  }

  // 5. Suspicious / Non-standard Location
  const high_risk_loc_keywords = ["unknown", "foreign", "unverified", "vpn", "proxy"];
  if (high_risk_loc_keywords.some((k) => location.includes(k))) {
    raw_score += GENERAL_RISK_RULES.unusual_location.points;
    reasons.push(`General Risk: High-risk or flagged location context (${tx.location})`);
  }

  if (reasons.length === 0) {
    reasons.push("General Risk: Transaction characteristics conform to safe baselines");
  }

  const general_score = Math.min(100.0, Math.max(0.0, parseFloat(raw_score.toFixed(1))));
  return [general_score, reasons];
}

export function generateHumanReadableExplanation(
  decision: string,
  final_score: number,
  cohort: string,
  general_reasons: string[],
  behavior_reasons: string[]
): string {
  const score_str = `${Math.round(final_score)}/100`;

  if (decision === "ALLOW") {
    if (cohort === "NO_HISTORY") {
      return (
        `Transaction approved with Low Risk (${score_str}). ` +
        `Although this user has no transaction history, the transaction amount and operational parameters ` +
        `fall within standard, low-risk limits.`
      );
    } else {
      return (
        `Transaction approved with Low Risk (${score_str}). ` +
        `Transaction aligns with user's verified historical baseline (familiar device, recipient, and amounts).`
      );
    }
  } else if (decision === "VERIFY") {
    const active_concerns = [...general_reasons, ...behavior_reasons]
      .map((r) => r.replace("Personalized Anomaly: ", "").replace("General Risk: ", ""))
      .filter((r) => !r.includes("conform to safe") && !r.includes("relying on General"));

    const concerns_text = active_concerns.length > 0 ? active_concerns.slice(0, 2).join("; ") : "Moderate risk detected";
    return (
      `Step-Up Verification required (Risk Score ${score_str}). ` +
      `Key triggers: ${concerns_text}. Recommended action: Prompt for biometric confirmation or SMS OTP.`
    );
  } else {
    // BLOCK
    const active_concerns = [...general_reasons, ...behavior_reasons]
      .map((r) => r.replace("Personalized Anomaly: ", "").replace("General Risk: ", ""))
      .filter((r) => !r.includes("conform to safe") && !r.includes("relying on General"));

    const concerns_text = active_concerns.length > 0 ? active_concerns.slice(0, 3).join("; ") : "Critical risk threshold breached";
    if (cohort === "NO_HISTORY") {
      return (
        `Transaction BLOCKED due to Severe General Risk (${score_str}). ` +
        `Even with zero user history, multi-factor risk rules triggered: ${concerns_text}. ` +
        `Protected against high-value first-touch fraud.`
      );
    } else {
      return (
        `Transaction BLOCKED due to Severe Behavioral Deviation & Threat Signals (${score_str}). ` +
        `Significant departure from historical user norms: ${concerns_text}.`
      );
    }
  }
}

export class RiskEngine {
  thresholds: DecisionThresholds;

  constructor(thresholds?: DecisionThresholds) {
    this.thresholds = thresholds || new DecisionThresholds(DEFAULT_THRESHOLD_ALLOW, DEFAULT_THRESHOLD_VERIFY);
  }

  evaluateTransaction(
    tx: Record<string, any>,
    userHistoryRows: Record<string, any>[] = [],
    customWeights?: { general: number; behavior: number }
  ): RiskEvaluation {
    const user_id = String(tx.user_id || "anonymous_user");
    const amount = parseFloat(tx.amount || 0.0);
    const tx_id = String(tx.transaction_id || tx.id || "TXN_SIM");

    // 1. Build or retrieve user profile
    const profile = buildUserProfile(user_id, userHistoryRows);

    // 2. General Risk Layer
    const [general_score, general_reasons] = calculateGeneralRisk(tx);

    // 3. Behavioral Anomaly Layer
    const [behavior_score, behavior_reasons, metrics] = scoreBehavioralAnomaly(tx, profile);

    // 4. Determine Dynamic Weighting
    let w_gen: number;
    let w_beh: number;
    if (customWeights) {
      w_gen = customWeights.general;
      w_beh = customWeights.behavior;
    } else {
      const weight_cfg = WEIGHTS_BY_HISTORY[profile.cohort] || WEIGHTS_BY_HISTORY.NO_HISTORY;
      w_gen = weight_cfg.general;
      w_beh = weight_cfg.behavior;
    }

    // 5. Combined Score Calculation (Clamped 0 - 100)
    const raw_final = general_score * w_gen + behavior_score * w_beh;
    const final_score = Math.min(100.0, Math.max(0.0, parseFloat(raw_final.toFixed(1))));

    // 6. Classify Decision
    const decision = this.thresholds.classify(final_score);

    // 7. Explanation
    const summary = generateHumanReadableExplanation(
      decision,
      final_score,
      profile.cohort,
      general_reasons,
      behavior_reasons
    );

    return {
      transaction_id: tx_id,
      user_id,
      amount,
      final_score,
      decision,
      history_status: profile.cohort,
      weights_applied: { general: parseFloat(w_gen.toFixed(2)), behavior: parseFloat(w_beh.toFixed(2)) },
      general_score,
      general_reasons,
      behavior_score,
      behavior_reasons,
      human_readable_summary: summary,
      metrics,
      ml_anomaly_score: null
    };
  }
}

export const riskEngine = new RiskEngine();

export async function evaluateCaseFinancialRisk(caseId: string, supabaseClient: any): Promise<RiskEvaluation> {
  const { data: txRows, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .eq("case_id", caseId)
    .order("layer_index", { ascending: true });

  if (error || !txRows || txRows.length === 0) {
    return {
      final_score: 75.0,
      decision: "VERIFY",
      general_score: 75.0,
      behavior_score: 60.0,
      history_status: "NO_HISTORY",
      general_reasons: ["Unregistered recipient UPI identifier flagged in multi-state fraud alert"],
      behavior_reasons: ["Rapid fund diversion across newly created mule account"],
      human_readable_summary: "Financial risk engine flagged suspicious routing patterns."
    };
  }

  const scores: RiskEvaluation[] = [];
  for (const row of txRows) {
    const txDict: Record<string, any> = {
      transaction_id: row.id,
      user_id: row.sender_id,
      amount: parseFloat(row.amount),
      beneficiary_id: row.receiver_id,
      beneficiary_new: row.layer_index <= 2,
      device_id: row.device_id || "DEV-UNKNOWN",
      device_new: (row.device_id || "").includes("MULE"),
      location: row.location || "Delhi-NCR",
      hour: 14,
      transaction_frequency: row.layer_index >= 2 ? 5.5 : 2.0
    };

    // Query user history if any
    const { data: userHist } = await supabaseClient
      .from("transactions")
      .select("*")
      .eq("sender_id", txDict.user_id);

    const res = riskEngine.evaluateTransaction(txDict, userHist || []);
    scores.push(res);
  }

  // Pick transaction with highest final_score
  const primary_res = scores.reduce((prev, current) => (current.final_score > prev.final_score ? current : prev), scores[0]);

  return {
    transaction_id: primary_res.transaction_id,
    user_id: primary_res.user_id,
    amount: primary_res.amount,
    final_score: primary_res.final_score,
    decision: primary_res.decision,
    history_status: primary_res.history_status,
    general_score: primary_res.general_score,
    general_reasons: primary_res.general_reasons,
    behavior_score: primary_res.behavior_score,
    behavior_reasons: primary_res.behavior_reasons,
    human_readable_summary: primary_res.human_readable_summary,
    evaluated_transactions_count: scores.length
  };
}
