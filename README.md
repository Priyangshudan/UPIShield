# UPIShield

### Proactive Cybercrime Intelligence & Cash-Out Prediction Framework

> SIH 2026 — Problem Statement SIH26184  
> Cybercrime Intelligence & Fraud Analysis Prototype

UPIShield is an operational prototype for identifying suspicious UPI transaction patterns, tracing multi-hop mule account networks, and predicting likely physical cash-out locations using supervised machine learning.

---

## Architecture Overview

The production architecture is completely serverless and self-contained within Vercel and Supabase:

```text
    Next.js / React (Vercel)
              ↓
    Supabase Edge Function (Deno / TypeScript)
              ↓
    Exported ML Model Engine (cashout_model.json / cashout_model.ts)
              ↓
    Ranked ATM & CSP Locations
```

- **Offline Development & Training**: Python (`scikit-learn`, `pandas`, `numpy`) is used for training, leakage-safe evaluation, feature importance analysis, and model serialization.
- **Production Inference**: Executed deterministically inside Supabase Edge Functions via an exported JSON tree ensemble engine in TypeScript. No external Python server or paid ML API hosting is required.

---

## Machine Learning Cash-Out Prediction

### 1. Prediction Target
The model predicts the conditional probability:
$$\text{P}(\text{candidate location is the actual cash-out location})$$
for every candidate ATM / Customer Service Point (CSP) location associated with a cybercrime case.

### 2. Candidate-Ranking Problem Definition
For each historical cash-out event:
- Actual cash-out location = positive example ($y = 1$)
- Every other eligible ATM/CSP candidate = negative example ($y = 0$)

The candidate locations are ranked by the model's predicted probability $P(y = 1 \mid X)$.

### 3. Feature Matrix
The model utilizes a versioned, shared 7-feature vector calculated identically across offline training, evaluation, and production inference:

| Feature Name | Description | Type |
|---|---|---|
| `distance_km` | Geodesic Haversine distance from runner hop coordinates to candidate location | `float` |
| `historical_fraud_count` | Total past fraud cash-out incidents recorded at kiosk | `float` |
| `cctv_available` | Binary indicator ($1.0$ if active CCTV available, else $0.0$) | `float` |
| `is_csp` | Binary indicator ($1.0$ if Micro-ATM / CSP agent, $0.0$ if bank ATM) | `float` |
| `case_amount` | Total fraud capital amount lost in transaction cycle ($\text{INR}$) | `float` |
| `cashout_hour` | Hour of incident / withdrawal ($0 - 23$) | `float` |
| `distance_rank` | $1$-based rank of candidate distance among all evaluated candidates | `float` |

### 4. Model Architecture & Export
- **Model**: `sklearn.ensemble.GradientBoostingClassifier` ($n\_estimators=50, max\_depth=3, learning\_rate=0.1$)
- **Model Version**: `SIH-ML-Cashout-GBClassifier-v2.0.0`
- **Export Artifacts**: `supabase/functions/_shared/models/cashout_model.json` and `cashout_model.ts`
- **Parity Tolerance**: $< 10^{-6}$ numerical difference verified between Python `predict_proba()` and TypeScript Edge Function engine.

---

## Offline Evaluation & Scientific Ablation Results

Evaluation was performed using a leakage-safe temporal split (older 80% events for training, newer 20% events for testing) over 250 historical events and 2,000 candidate sample rows.

### Performance vs Baselines & Feature Ablations

| Model / Feature Set | Features Included | Recall@1 | Recall@3 | Recall@4 | MRR | ROC-AUC | PR-AUC |
|---|---|---|---|---|---|---|---|
| **Baseline (Pure Dist Rank)** | `distance_km` (Pure Rank) | 0.9000 | 1.0000 | 1.0000 | 0.9467 | N/A | N/A |
| **Baseline (Old Heuristic)** | `dist + fraud + csp - cctv` | 0.2400 | 0.4600 | 0.7800 | 0.4587 | N/A | N/A |
| **Set A (GBDT Distance-Only)**| `distance_km` | **0.9200** | 1.0000 | 1.0000 | **0.9567** | 0.9780 | 0.9167 |
| **Set B (+ Fraud Count)** | `distance_km`, `historical_fraud_count` | 0.8400 | 1.0000 | 1.0000 | 0.9167 | 0.9848 | 0.9312 |
| **Set C (+ Kiosk Security)** | `distance_km`, `fraud_cnt`, `cctv`, `is_csp` | 0.8400 | 1.0000 | 1.0000 | 0.9167 | 0.9847 | 0.9312 |
| **Set D (Without dist_rank)** | `distance_km`, `fraud_cnt`, `cctv`, `is_csp`, `amt`, `hour` | 0.8400 | 1.0000 | 1.0000 | 0.9133 | 0.9856 | 0.9332 |
| **Set E (Full Current Model)**| `distance_km`, `fraud_cnt`, `cctv`, `is_csp`, `amt`, `hour`, `dist_rank` | 0.9000 | 1.0000 | 1.0000 | 0.9467 | **0.9910** | **0.9517** |

### Scientific Findings & Correct Interpretation
1. **Spatial Proximity Dominance**: Geodesic distance (`distance_km` / `distance_rank`) is the primary governing signal in candidate ranking. Pure distance ranking achieves 90.0% Recall@1, and GBDT trained on `distance_km` alone achieves 92.0% Recall@1.
2. **Discrimination vs Calibration**: High ROC-AUC (0.9910) and PR-AUC (0.9517) in the full model demonstrate strong binary discrimination, but multi-feature addition does not increase top-1 ranking Recall@1 beyond pure distance ranking on this dataset.
3. **Synthetic Spatial Bias**: Across the 250 historical events, the ground-truth cash-out kiosk is the single nearest candidate (Rank 1) in **86.0%** of events, 2nd nearest in **9.6%**, and 3rd nearest in **4.4%** (mean actual location distance = 2.55 km).

---

## Repositories & Execution Commands

### Train Model & Export
```bash
python -m training.train_cashout_model
```

### Run Evaluation Experiment
```bash
python -m evaluation.run_experiment
```

### Run Offline Scientific Ablation Suite
```bash
python -m evaluation.run_ablation_experiments
```

### Run Synthetic Bias Analysis
```bash
python -m evaluation.analyze_synthetic_bias
```

### Run Unit & Parity Test Suite
```bash
python -m unittest discover tests
```

### Build Production Web Application
```bash
cd frontend
npm run build
```

---

## Synthetic Data Disclaimer

> **Disclaimer**: UPIShield is a prototype developed for SIH 2026. Data generation and validation are conducted using synthetic cybercrime transaction topologies and Delhi-NCR kiosk locations. It does not interface with live banking APIs or production NPCI networks. Production deployment with real NCRP records would require integration with NPCI / I4C data streams.