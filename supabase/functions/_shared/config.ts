// Configuration and Thresholds for UPIShield Risk Engine in TypeScript

export const DEFAULT_THRESHOLD_ALLOW = 39;
export const DEFAULT_THRESHOLD_VERIFY = 69;

export class DecisionThresholds {
  allowMax: number;
  verifyMax: number;

  constructor(allowMax = DEFAULT_THRESHOLD_ALLOW, verifyMax = DEFAULT_THRESHOLD_VERIFY) {
    this.allowMax = allowMax;
    this.verifyMax = verifyMax;
  }

  classify(score: number): "ALLOW" | "VERIFY" | "BLOCK" {
    const clampedScore = Math.max(0.0, Math.min(100.0, Number(score)));
    if (clampedScore <= this.allowMax) {
      return "ALLOW";
    } else if (clampedScore <= this.verifyMax) {
      return "VERIFY";
    } else {
      return "BLOCK";
    }
  }
}

export const HISTORY_SUFFICIENT_MIN_TX = 5;

export const WEIGHTS_BY_HISTORY: Record<string, { general: number; behavior: number; label: string }> = {
  NO_HISTORY: {
    general: 1.0,
    behavior: 0.0,
    label: "No History (100% General Risk)"
  },
  LIMITED_HISTORY: {
    general: 0.70,
    behavior: 0.30,
    label: "Limited History (70% General / 30% Behavioral)"
  },
  SUFFICIENT_HISTORY: {
    general: 0.40,
    behavior: 0.60,
    label: "Sufficient History (40% General / 60% Behavioral)"
  }
};

export const GENERAL_RISK_RULES = {
  amount_very_high: { threshold: 50000, points: 35, reason: "Extremely high transaction amount (>= ₹50,000)" },
  amount_high: { threshold: 25000, points: 25, reason: "High transaction amount (>= ₹25,000)" },
  amount_moderate: { threshold: 10000, points: 12, reason: "Elevated transaction amount (>= ₹10,000)" },
  new_device: { points: 25, reason: "Transaction initiated from an unregistered/new device" },
  new_beneficiary: { points: 20, reason: "Payment to a newly encountered beneficiary" },
  unusual_hour: { start_hour: 1, end_hour: 5, points: 15, reason: "Transaction at high-risk odd hours (01:00 AM - 05:00 AM)" },
  high_frequency: { threshold: 5, points: 15, reason: "Rapid succession of transactions (High frequency >= 5 tx/hr)" },
  unusual_location: { points: 15, reason: "Transaction from an unusual or unverified location" }
};

export const BEHAVIOR_RISK_RULES = {
  amount_massive_spike: { multiplier: 6.0, points: 45, reason: "Amount is >6x higher than personal average" },
  amount_large_spike: { multiplier: 3.5, points: 30, reason: "Amount is >3.5x higher than personal average" },
  amount_moderate_spike: { multiplier: 2.0, points: 15, reason: "Amount is >2x higher than personal average" },
  amount_exceeds_max: { points: 15, reason: "Amount exceeds historical personal maximum" },
  unseen_device: { points: 25, reason: "Device was never previously used by this user" },
  unseen_beneficiary: { points: 20, reason: "Beneficiary is not in user's established beneficiary circle" },
  unusual_user_hour: { points: 15, reason: "Transaction time deviates from user's active historical hours" },
  unseen_location: { points: 15, reason: "Transaction originates from a location never visited in user history" },
  frequency_surge: { multiplier: 2.5, points: 15, reason: "Transaction frequency is >2.5x higher than user's normal pace" }
};
