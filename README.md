# UPIShield: Adaptive Dual-Layer UPI Fraud Prevention Prototype

> **Simulated Proof-of-Concept for College & Hackathon Review**  
> *Note: This software uses 100% synthetic/simulated transaction data. It does **NOT** connect to UPI, NPCI, real banks, payment gateways, or real personal financial data.*

---

## 📌 Project Overview & Problem Statement

Unified Payments Interface (UPI) processes billions of instant, peer-to-peer and merchant transactions each month. However, real-time transaction risk scoring faces a classic dilemma:

1. **Cold-Start Problem (New Users)**: Users with little or no transaction history cannot be evaluated by statistical or machine learning behavioral models because no personal baseline exists.
2. **Account Takeover & Anomaly Misses (Established Users)**: Static, rule-based systems struggle to detect nuanced account takeovers when an attacker makes payments that seem normal in absolute terms but drastically deviate from the genuine user's habits.

### The UPIShield Solution

**UPIShield** bridges this gap using an **Adaptive Dual-Layer Risk Architecture**:
- **Layer 1 (General Risk Engine)**: Evaluates absolute, immediate risk signals (e.g., high transaction amount, unregistered device, first-time beneficiary, odd midnight hours, rapid velocity) without needing prior history.
- **Layer 2 (Personalized Behavioral Profiler)**: Establishes statistical baselines for users with sufficient history (median amount, spending range, familiar devices, trusted beneficiaries, typical active hours, average frequency) and flags abnormal behavioral deviations.
- **Dynamic Weighting & Explainability Layer**: Dynamically balances the two layers based on user profile depth, generates an interpretable combined risk score (0–100), and outputs human-readable rationales alongside actionable decisions (`ALLOW`, `VERIFY`, `BLOCK`).

---

## 🏗️ System Architecture

```
                      ┌──────────────────────────────────────────┐
                      │    Incoming Synthetic UPI Transaction    │
                      └────────────────────┬─────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       ┌─────────────────────────┐                   ┌─────────────────────────┐
       │   General Risk Engine   │                   │   Behavioral Profiler   │
       │  (History-Independent)  │                   │   (History-Dependent)   │
       │                         │                   │                         │
       │ • High Value Tiers      │                   │ • Deviation from Median │
       │ • Unregistered Device   │                   │ • Unseen Device Alert   │
       │ • New Beneficiary       │                   │ • Unseen Beneficiary    │
       │ • Odd Hours (1-5 AM)    │                   │ • Out-of-Profile Hours  │
       │ • High Velocity Burst   │                   │ • Unfamiliar Location   │
       └────────────┬────────────┘                   └────────────┬────────────┘
                    │ (General Score: 0-100)                      │ (Behavior Score: 0-100)
                    └──────────────────────┬──────────────────────┘
                                           │
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │       Dynamic Weighting Combiner         │
                      │  • NO_HISTORY:    100% Gen +  0% Beh     │
                      │  • LIMITED_HIST:   70% Gen + 30% Beh     │
                      │  • SUFFICIENT:     40% Gen + 60% Beh     │
                      └────────────────────┬─────────────────────┘
                                           │ (Combined Score: 0-100)
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │      Decision & Explainability Layer     │
                      │  • 00 – 39: ALLOW                        │
                      │  • 40 – 69: VERIFY (Step-Up 2FA / OTP)   │
                      │  • 70 – 100: BLOCK                       │
                      └──────────────────────────────────────────┘
```

---

## 🧮 Risk Scoring Methodology

### 1. General Risk Scoring (0–100)
Evaluates absolute threat signals regardless of user history:
- **Amount Tiers**: $\ge ₹50,000$ (+35 pts), $\ge ₹25,000$ (+25 pts), $\ge ₹10,000$ (+12 pts)
- **New Device**: +25 pts
- **New Beneficiary**: +20 pts
- **High-Risk Time Window (01:00 AM – 05:00 AM)**: +15 pts
- **Rapid Velocity ($\ge 5 \text{ tx/hr}$)**: +15 pts
- **Flagged / Unknown Location**: +15 pts

### 2. Personalized Behavioral Scoring (0–100)
Measures deviations against user's verified historical baseline:
- **Amount Anomaly**:
  - $> 6.0\times$ personal median/average (+45 pts)
  - $> 3.5\times$ personal median/average (+30 pts)
  - $> 2.0\times$ personal median/average (+15 pts)
  - Exceeds historical personal maximum by $>50\%$ (+15 pts)
- **Unseen Device for Established User**: +25 pts
- **Unseen Beneficiary for Established User**: +20 pts
- **Temporal Deviation (Outside active hours)**: +15 pts
- **Unfamiliar Location**: +15 pts
- **Velocity Surge ($> 2.5\times$ user frequency)**: +15 pts

### 3. Dynamic Weighting Formula
$$\text{Final Score} = (\text{General Score} \times W_{\text{gen}}) + (\text{Behavioral Score} \times W_{\text{beh}})$$

Where weights $(W_{\text{gen}}, W_{\text{beh}})$ are dynamically assigned:
- **No History ($0 \text{ tx}$)**: $W_{\text{gen}} = 1.0$, $W_{\text{beh}} = 0.0$
- **Limited History ($1\text{--}4 \text{ tx}$)**: $W_{\text{gen}} = 0.70$, $W_{\text{beh}} = 0.30$
- **Sufficient History ($\ge 5 \text{ tx}$)**: $W_{\text{gen}} = 0.40$, $W_{\text{beh}} = 0.60$

### 4. Decision Mapping
- **`0 – 39` $\rightarrow$ ALLOW** (Green) — Safe transaction within baseline parameters.
- **`40 – 69` $\rightarrow$ VERIFY** (Yellow/Orange) — Step-Up authentication recommended (Biometric / SMS OTP).
- **`70 – 100` $\rightarrow$ BLOCK** (Red) — Severe threat or heavy behavioral deviation.

---

## 🎯 Required Demo Scenarios

The dashboard provides 1-click preset buttons to demonstrate key evaluation scenarios:

| Scenario | User Cohort | Parameters | Engine Triggered | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **Scenario 1: Normal Routine** | Established User (`user_std_01`) | ₹800, Known Device, Known Beneficiary, 14:00 | Both engines confirm safe parameters | **ALLOW** (Low Risk $\le 39$) |
| **Scenario 2: Behavioral Anomaly** | Established User (`user_std_01`) | ₹25,000 (normal is ₹200–₹1,800), New Device, 03:30 AM | Behavioral Profiler flags major spike & unseen device | **BLOCK** / **VERIFY** (High Score) |
| **Scenario 3: Brand New User** | Zero-History User (`user_new_01`) | ₹35,000, New Device, New Beneficiary, 02:45 AM | General Risk Engine applies 100% weight | **BLOCK** (Severe General Risk) |

---

## 🧪 Synthetic Dataset

The synthetic dataset (`data/synthetic_transactions.csv`) includes user cohorts modeled after realistic personas:
- **Standard Regular User (`user_std_01`)**: ₹200–₹1,800 routine payments, Mumbai, active 08:00–22:00.
- **College Student (`user_std_02`)**: Micro-transactions ₹30–₹650, Bengaluru, active 10:00–23:00.
- **High-Net-Worth / Business (`user_hni_01`)**: ₹3,000–₹45,000 business transactions, Delhi/Gurugram.
- **Limited History User (`user_lim_01`)**: Only 2 past transactions.
- **Brand New User (`user_new_01`)**: 0 past transactions.

---

## 💻 Tech Stack

- **UI Dashboard**: Streamlit
- **Data Manipulation & Math**: Pandas, NumPy
- **Auxiliary ML**: scikit-learn (Isolation Forest baseline with graceful fallback)
- **Testing**: Python `unittest` framework

---

## 🚀 Installation & Running the Dashboard

### Prerequisites
- Python 3.9+ (Tested on Python 3.13)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Automated Tests
```bash
python -m unittest discover -s tests -p "test_*.py" -v
```

### 3. Launch Streamlit Dashboard
```bash
streamlit run app.py
```

Open your browser at `http://localhost:8501`.

---

## 📂 Project Structure

```
UPIShield/
│
├── app.py                         # Streamlit interactive UI & simulator
├── requirements.txt               # Dependencies
├── README.md                      # Documentation & review guide
├── .gitignore                     # Git ignore rules
│
├── src/
│   ├── __init__.py
│   ├── config.py                  # Thresholds, rules & dynamic weights
│   ├── data_generator.py          # Synthetic dataset generator
│   ├── behavior.py                # Behavioral profiler & anomaly scoring
│   ├── risk_engine.py             # General risk engine, hybrid combiner & explainability
│   ├── ml_engine.py               # Optional Isolation Forest ML baseline
│   └── utils.py                   # Demo presets, badges & formatting helpers
│
├── data/
│   └── synthetic_transactions.csv # Pre-generated synthetic transaction dataset
│
└── tests/
    ├── __init__.py
    └── test_risk_engine.py        # Comprehensive test suite covering all 8 criteria
```

---

## ⚠️ Current Scope & Limitations

- **Prototype Scope**: Designed as an interpretable research proof-of-concept (30–40% vertical slice).
- **Synthetic Data**: Transactions are simulated; device fingerprints and geo-locations are synthetic tokens.
- **Single-Node Execution**: Runs locally in memory without distributed databases or cloud message queues.

---

## 🔮 Future Work & Next Phases

1. **Graph-Based Fraud Ring Detection**: Integrate graph neural networks (GNNs) or NetworkX to spot mule account clusters and cyclic payment flows.
2. **Federated Learning for Edge Risk**: Train decentralized behavioral models on mobile devices to preserve user privacy.
3. **NPCI / ISO 20022 Integration**: Map synthetic schemas to official UPI 2.0 message formats for bank-grade staging integration.

