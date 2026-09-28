# 🛡️ UPIShield: Proactive Cybercrime Intelligence & ATM/CSP Cash-Out Prediction Framework

> **SIH 2026 Problem Statement SIH26184 — Working Prototype**  
> **SIH 2026 Problem Statement SIH26184 — Cloud-Native Vercel + Supabase Architecture**  
> *Note: UPIShield is a cybercrime intelligence and fraud-analysis prototype powered by 100% synthetic/simulated transaction and cybercrime data. It does **NOT** connect to live banking networks, NPCI/UPI production gateways, real NCRP databases, or live personal financial records.*

---

## 🌍 Overview

Unified Payments Interface (UPI) transaction volume in India has grown exponentially, enabling seamless real-time digital payments. However, this speed is also exploited by organized cybercrime syndicates. When victims fall prey to phishing, investment scams, or digital arrest frauds, illicit funds are routed instantaneously across multi-hop "mule account" networks within minutes. 

The primary operational challenge for law enforcement agencies (LEAs) and financial nodal officers is **rapid funds dissipation**. Money moves through multiple layers (Layer-1 Hubs &rarr; Layer-2 Distribution accounts) and is withdrawn as physical cash at ATMs or Customer Service Points (CSPs / Micro-ATMs) before a 1930 NCRP complaint can be formally processed and freeze orders issued.

**UPIShield (SIH26184 Prototype)** addresses this challenge by introducing an end-to-end cybercrime intelligence and predictive surveillance pipeline:
**UPIShield (SIH26184 Edition)** addresses this challenge by introducing an end-to-end cybercrime intelligence and predictive surveillance pipeline deployable serverlessly on **Vercel + Supabase**:
- **NCRP Complaint Ingestion & Case Convergence**: Aggregates multi-source incident reports to identify shared mule targets and converge fragmented complaints into unified investigative cases.
- **Custom Dual-Layer Fraud Risk Engine**: Combines transparent general risk rules (for zero-history cold start transactions) with statistical behavioral anomaly detection (for established accounts).
- **NetworkX Multi-Hop Mule Graph**: Reconstructs 4-tier syndicate money trails linking victims, primary mule hubs, distribution accounts, operator devices, and cash-out points.
- **Gradient-Boosted Cash-Out Predictor**: Ranks candidate physical ATM and CSP withdrawal points using spatial proximity, routing velocity, historical fraud density, and machine learning inference.
- **Multi-Hop Mule Graph Service**: Reconstructs 4-tier syndicate money trails linking victims, primary mule hubs, distribution accounts, operator devices, and cash-out points.
- **Gradient-Boosted Cash-Out Predictor**: Ranks candidate physical ATM and CSP withdrawal points using spatial proximity, routing velocity, historical fraud density, and spatial-temporal inference.
- **Interactive Leaflet GIS Command Dashboard**: Provides real-time spatial surveillance maps, case analytics, risk gauges, and multi-agency alert dispatching for LEAs, banks, and I4C.

---

## 🎯 Problem Statement — SIH26184

**Problem Statement Code**: SIH26184  
**Focus Area**: Cybercrime Intelligence, Financial Fraud Detection, Mule Account Network Tracking, and Physical Cash-Out Prediction.

### The Operational Bottleneck
1. **Multi-Hop Layering Velocity**: Cybercriminals move defrauded money through 3 to 5 layers of mule accounts within 10–20 minutes.
2. **First-Touch Cold-Start Risk**: Traditional fraud detection relies heavily on long historical baselines, making newly created or recently acquired mule accounts hard to flag immediately.
3. **Physical Cash-Out Blind Spot**: Once money reaches terminal distribution accounts, runners withdraw physical cash from unmonitored ATMs/CSPs, permanently severing the digital audit trail.
4. **Data Silos**: Complaints filed across different states or police stations remain isolated, obscuring nationwide syndicate footprints.

**UPIShield** demonstrates how intelligent complaint convergence, dual-layer financial risk scoring, multi-hop entity graph analysis, and spatial prediction can give investigators actionable lead time to interdict cash-outs.

---

## 🚀 Key Features

- 📥 **NCRP / 1930 Incident Ingestion**: Ingests structured complaint telemetry including victim details, reported amounts, timestamps, and destination UPI handles.
- 🔗 **Automated Case Convergence**: Groups correlated complaints pointing to common primary mule handles into unified multi-victim investigations (e.g., `CASE-2026-4401`).
- ⚖️ **Custom Dual-Layer Risk Engine**: Evaluates transactions using transparent rule scoring and personalized behavioral baselines with explainable risk breakdown.
- 🎚️ **Dynamic Risk Weighting Policy**: Adaptively adjusts weights between general risk rules (100% for new users) and behavioral profile deviations (up to 60% for established users).
- 🕸️ **NetworkX Multi-Hop Entity Graph**: Builds directed, 4-tier relationship graphs (`Victim` &rarr; `L1 Mule Hub` &rarr; `L2 Distribution` &rarr; `Runner/Device` &rarr; `ATM/CSP`).
- 🤖 **Gradient-Boosted Cash-Out Location Predictor**: Employs `scikit-learn`'s `GradientBoostingRegressor` to score and rank candidate physical withdrawal points.
- 🛡️ **Heuristic Fallback Engine**: Ensures uninterrupted predictions using a deterministic spatial-temporal scoring formula when ML models are untrained or missing dependencies.
- 🕸️ **Multi-Hop Entity Graph Service**: Builds directed, 4-tier relationship graphs (`Victim` &rarr; `L1 Mule Hub` &rarr; `L2 Distribution` &rarr; `Runner/Device` &rarr; `ATM/CSP`).
- 🤖 **Gradient-Boosted Cash-Out Location Predictor**: Scores and ranks candidate physical withdrawal points using spatial proximity, kiosk vulnerability, and CCTV coverage.
- 🗺️ **Interactive Leaflet GIS Map**: Renders spatial fraud heatmaps, candidate withdrawal geofences, and interactive node details across synthetic operating zones (Delhi-NCR).
- 📊 **Executive Command Dashboard**: Displays real-time operational KPIs (Total Complaints, High-Risk Cases, Amount at Risk in INR, Active Hotspots) and system health monitors.
- 🚨 **Multi-Agency Alert Dispatch**: Simulates immediate alert creation for LEAs (Police Cyber Cell), Bank Nodal Officers (Debit Freeze), and I4C Central Registry.

---

## 🧠 Intelligence Architecture

UPIShield relies on three core intelligence layers working in concert:
UPIShield relies on three core intelligence components deployed serverlessly via **Supabase Edge Functions**:

```
                               ┌─────────────────────────────────────────────────┐
                               │       Incoming Transaction / Case Telemetry     │
                               └────────────────────────┬────────────────────────┘
                                                        │
                                                        ▼
                               ┌─────────────────────────────────────────────────┐
                               │   UPIShield Dual-Layer Fraud Risk Engine        │
                               │   (src/risk_engine.py & src/behavior.py)       │
                               │   (supabase/functions/_shared/risk_engine.ts)   │
                               │                                                 │
                               │  • General Risk Layer (History-Independent)     │
                               │  • Behavioral Profile Layer (History-Based)     │
                               │  • Dynamic Weighting (0-100 Score -> ALLOW/    │
                               │    VERIFY/BLOCK)                                │
                               └────────────────────────┬────────────────────────┘
                                                        │
                                                        ▼
                               ┌─────────────────────────────────────────────────┐
                               │   NetworkX Multi-Hop Mule Graph Service         │
                               │   (backend/services/graph_service.py)           │
                               │   Multi-Hop Mule Network Graph Service          │
                               │   (supabase/functions/_shared/graph_service.ts) │
                               │                                                 │
                               │  • 4-Tier Topology Construction                 │
                               │  • Entity Node & Edge Extraction                │
                               │  • Central Mule Hub Identification              │
                               └────────────────────────┬────────────────────────┘
                                                        │
                                                        ▼
                               ┌─────────────────────────────────────────────────┐
                               │   Gradient-Boosted Cash-Out Location Predictor  │
                               │   (backend/ml/cashout_predictor.py)             │
                               │   (supabase/functions/_shared/cashout_predictor.ts)
                               │                                                 │
                               │  • Spatial Geodesic Distance (Haversine)        │
                               │  • Historical Fraud Density & CCTV Signals      │
                               │  • Candidate Ranking & Time Window Estimation   │
                               └─────────────────────────────────────────────────┘
```

### 1. Custom Dual-Layer Risk Engine
The risk engine (`src/risk_engine.py`) is project-custom logic designed for transparency, cold-start resilience, and behavioral explainability.

- **General Risk Layer**: Evaluates immediate transaction signals without needing prior user history (e.g., transaction amount thresholds, unregistered devices, first-time beneficiaries, odd hours between 01:00 AM – 05:00 AM, high velocity $\ge 5 \text{ tx/hr}$, suspicious locations).
- **Personalized Behavioral Profile Layer**: Evaluates deviations against statistical baselines extracted from historical user transactions (`src/behavior.py`), checking amount spikes relative to median ($\ge 2\times, \ge 3.5\times, \ge 6\times$), unrecognized devices, new beneficiaries, active hour windows, and velocity surges.
- **Dynamic Weighting**: Automatically categorizes users into history cohorts (`NO_HISTORY`, `LIMITED_HISTORY`, `SUFFICIENT_HISTORY`) and dynamically balances general vs. behavioral weights.

### 2. Multi-Hop Mule Network Graph Analysis
The graph service (`backend/services/graph_service.py`) leverages the `NetworkX` open-source Python graph library to construct directed graphs (`nx.DiGraph`) representing money movement across multi-layered networks.

- **Node Types**: `victim`, `mule_l1` (Layer-1 Hub), `mule_l2` (Layer-2 Distribution), `runner_token`, `device`, `atm_csp`.
- **Edge Types**: `fund_transfer` (with transaction amounts and timestamps), `device_binding` ("Operated From"), and `cashout_attempt` ("Target Extraction").
- **Syndicate Resolution**: Identifies central mule hubs by calculating node degree centrality and mapping 4-tier funnel structures.

### 3. Cash-Out Location Predictor
The cash-out predictor (`backend/ml/cashout_predictor.py`) isolates physical points of failure where digital money transforms into untraceable cash.

- **Machine Learning Model**: Uses `scikit-learn`'s `GradientBoostingRegressor` (40 estimators, max depth 3) trained on synthetic spatial-temporal withdrawal histories.
- **Feature Vector**: `[distance_from_last_hop_km, historical_fraud_count, cctv_available, is_csp, case_amount]`.
- **Outputs**: Candidate ATM/CSP locations ranked with normalized probability scores (65%–96%), risk levels (`CRITICAL`, `HIGH`, `MODERATE`), estimated withdrawal time windows ("10–25 mins", "20–45 mins", "40–75 mins"), and contributing reason factors.
- **Fallback Heuristic**: If `scikit-learn` is unavailable or model weights are uninitialized, a deterministic spatial-temporal heuristic calculates candidate scores directly to ensure zero runtime downtime.

### 4. Optional Auxiliary ML Anomaly Engine
The repository contains an auxiliary unsupervised anomaly module (`src/ml_engine.py`) utilizing `scikit-learn`'s `IsolationForest` (50 estimators, contamination 0.05).
- Extracts a 5-feature vector: `[amount, hour, transaction_frequency, device_new, beneficiary_new]`.
- Generates an optional auxiliary 0–100 anomaly score alongside the primary dual-layer risk engine.

---

## 🏗️ System Architecture

UPIShield follows a decoupled, modular architecture with a Next.js 14 frontend communicating asynchronously with a Python FastAPI backend over REST APIs.
UPIShield utilizes a serverless architecture designed for zero-cost public hosting via **Vercel** and **Supabase**:

```mermaid
flowchart TD
    subgraph Frontend["Frontend Layer (Next.js 14 + Tailwind CSS + Leaflet GIS)"]
        UI_Dash["Command Dashboard (/)"]
        UI_Case["Case Investigation (/cases/[id])"]
        UI_Cash["Cash-Out Surveillance (/cashout)"]
        UI_Alert["Intelligence Dispatch (/alerts)"]
    subgraph Vercel["Vercel Cloud Hosting"]
        Frontend["Next.js 14 Frontend Application (frontend/)"]
    end

    subgraph Backend["Backend Layer (FastAPI / Uvicorn)"]
        API_Main["FastAPI App Router (backend/main.py)"]
        R_Dash["Dashboard Router (/api/dashboard)"]
        R_Case["Cases Router (/api/cases)"]
        R_Comp["Complaints Router (/api/complaints)"]
        R_Loc["Locations Router (/api/locations)"]
        R_Alert["Alerts Router (/api/alerts)"]
    end
    subgraph Supabase["Supabase Cloud Platform"]
        subgraph Database["Supabase PostgreSQL (Database)"]
            Tables["public.cases\npublic.complaints\npublic.transactions\npublic.locations\npublic.historical_cashouts\npublic.alerts"]
        end

    subgraph Intelligence["Intelligence & Business Services"]
        S_Risk["Case Risk Service (backend/services/risk_service.py)"]
        S_Graph["Entity Graph Service (backend/services/graph_service.py)"]
        S_Pred["Prediction Service (backend/services/prediction_service.py)"]
        S_Alert["Alert Service (backend/services/alert_service.py)"]
        
        Core_Risk["UPIShield Core Risk Engine (src/risk_engine.py)"]
        Core_Behav["Behavior Profiler (src/behavior.py)"]
        ML_Cashout["GradientBoosting Predictor (backend/ml/cashout_predictor.py)"]
        ML_Anom["IsolationForest Anomaly (src/ml_engine.py)"]
    end
        subgraph Functions["Supabase Edge Functions (Deno / TypeScript)"]
            Fn_Dash["dashboard/index.ts"]
            Fn_Cases["cases/index.ts"]
            Fn_Comp["complaints/index.ts"]
            Fn_Loc["locations/index.ts"]
            Fn_Alerts["alerts/index.ts"]
            Fn_Health["health/index.ts"]
        end

    subgraph Data["Persistence & Synthetic Data Layer"]
        DB[(SQLite DB: data/sih_cybercrime.db)]
        DataGen["Synthetic Generator (backend/synthetic_data.py)"]
        subgraph Shared["Core Shared Engines (supabase/functions/_shared/)"]
            Eng_Risk["risk_engine.ts\nbehavior.ts"]
            Eng_Graph["graph_service.ts"]
            Eng_Pred["cashout_predictor.ts"]
        end
    end

    UI_Dash --> R_Dash
    UI_Case --> R_Case
    UI_Cash --> R_Case
    UI_Cash --> R_Loc
    UI_Alert --> R_Alert

    API_Main --> R_Dash & R_Case & R_Comp & R_Loc & R_Alert

    R_Case --> S_Risk & S_Graph & S_Pred
    R_Alert --> S_Alert

    S_Risk --> Core_Risk --> Core_Behav
    S_Graph --> NetworkX["NetworkX Library"]
    S_Pred --> ML_Cashout

    S_Risk & S_Graph & S_Pred & S_Alert & DataGen --> DB
    Frontend -->|HTTPS REST API + Anon Key| Functions
    Fn_Dash & Fn_Cases & Fn_Comp & Fn_Loc & Fn_Alerts & Fn_Health --> Shared
    Shared -->|SQL Queries| Database
```

---

## 🔄 End-to-End Workflow

1. **Complaint Registration & Convergence**:
   - Multiple victim 1930 reports (e.g., ₹1,20,000 lost in investment scam) enter the backend.
   - The backend automatically converges complaints sharing destination targets into a unified case (`CASE-2026-4401`).
2. **Financial Risk Evaluation**:
   - `CaseRiskEvaluator` fetches transactions and evaluates them via `RiskEngine`.
   - The engine computes a 0–100 score (e.g., `95.0/100 BLOCK`) by combining General Risk points (amount $\ge \text{₹50k}$, new beneficiary) and Behavioral Deviations ($>6\times$ baseline spike, unseen device).
3. **Multi-Hop Mule Network Reconstruction**:
   - `EntityGraphService` queries SQLite transaction and complaint tables.
   - It builds a 4-tier NetworkX graph mapping victims to Layer-1 Hub (`fastpay.sharma@okaxis`), Layer-2 Distribution accounts, operator devices, and terminal runner tokens.
4. **Physical Cash-Out Prediction**:
   - The investigator triggers cash-out prediction from the UI (`/cases/CASE-2026-4401` or `/cashout`).
   - `CashoutPredictor` calculates geodesic distances from the last known hop to all registered ATM/CSP locations and runs `GradientBoostingRegressor` inference.
   - Candidates are ranked by withdrawal probability, estimated time window (e.g., "10 - 25 mins"), and risk level.
5. **Interactive GIS Visualization**:
   - The frontend renders candidate ATM/CSP pins on Leaflet maps with custom badges, risk level indicators, and detailed route context.
6. **Multi-Agency Alert Dispatch**:
   - The analyst opens `AlertModal` and dispatches tactical alerts containing debit freeze action codes (`ACT-FREEZE-L1-L2`) and field interception notes to LEA Cyber Cells, Bank Nodal Officers, and I4C.

---

## 📊 Risk Scoring Methodology

The UPIShield Risk Engine uses a dual-layer architecture with dynamic weighting and transparent explainability.

### 1. General Risk Rules (`src/config.py`)
### 1. General Risk Rules

| Rule Key | Condition | Risk Points | Rationale |
|---|---|---|---|
| `amount_very_high` | Transaction Amount $\ge \text{₹50,000}$ | +35 pts | Extreme loss exposure |
| `amount_high` | Transaction Amount $\ge \text{₹25,000}$ | +25 pts | High transaction value |
| `amount_moderate` | Transaction Amount $\ge \text{₹10,000}$ | +12 pts | Elevated transaction value |
| `new_device` | Unregistered / new device flag | +25 pts | First-time hardware binding |
| `new_beneficiary` | Unregistered / new recipient flag | +20 pts | First-time payment target |
| `unusual_hour` | Hour between 01:00 AM and 05:00 AM | +15 pts | High-risk odd-hour execution |
| `high_frequency` | Velocity $\ge 5 \text{ tx/hr}$ | +15 pts | Rapid burst behavior |
| `unusual_location` | Location context contains risk keywords | +15 pts | High-risk / VPN / unverified location |

### 2. Personalized Behavioral Rules (`src/config.py`)
### 2. Personalized Behavioral Rules

| Rule Key | Condition | Risk Points | Rationale |
|---|---|---|---|
| `amount_massive_spike` | Amount $\ge 6.0\times$ personal baseline | +45 pts | Massive deviation from normal spending |
| `amount_large_spike` | Amount $\ge 3.5\times$ personal baseline | +30 pts | Severe deviation from normal spending |
| `amount_moderate_spike` | Amount $\ge 2.0\times$ personal baseline | +15 pts | Notable deviation from normal spending |
| `amount_exceeds_max` | Amount $> 1.5\times$ historical maximum | +15 pts | Exceeds all historical transactions |
| `unseen_device` | Device ID not in `known_devices` | +25 pts | Hardware mismatch for established user |
| `unseen_beneficiary` | Beneficiary ID not in `known_beneficiaries` | +20 pts | Target outside established circle |
| `unusual_user_hour` | Hour outside user's active window | +15 pts | Temporal anomaly for user profile |
| `unseen_location` | Location not in `known_locations` | +15 pts | Unfamiliar geographic origin |
| `frequency_surge` | Frequency $\ge 2.5\times$ user's average velocity | +15 pts | Velocity burst relative to user norm |

### 3. History Cohorts & Dynamic Weighting

The weighting between General Risk ($W_G$) and Behavioral Risk ($W_B$) is determined dynamically based on the number of historical transactions available for the user:

| History Cohort | Condition | General Weight ($W_G$) | Behavior Weight ($W_B$) | Description |
|---|---|---|---|---|
| **`NO_HISTORY`** | 0 historical transactions | **1.00 (100%)** | **0.00 (0%)** | Cold-start protection relying entirely on general rules |
| **`LIMITED_HISTORY`** | 1 to 4 transactions | **0.70 (70%)** | **0.30 (30%)** | Transition phase incorporating early behavioral signals |
| **`SUFFICIENT_HISTORY`** | $\ge 5$ transactions | **0.40 (40%)** | **0.60 (60%)** | Established profile driven primarily by behavioral deviations |

$$\text{Final Risk Score} = \min\left(100.0, \max\left(0.0, (S_{\text{general}} \times W_G) + (S_{\text{behavior}} \times W_B)\right)\right)$$

### 4. Decision Thresholds

$$\text{Decision} = \begin{cases} \text{ALLOW} & \text{if } \text{Score} \le 39 \\ \text{VERIFY} & \text{if } 40 \le \text{Score} \le 69 \\ \text{BLOCK} & \text{if } \text{Score} \ge 70 \end{cases}$$

---

## 🕸️ Multi-Hop Network Analysis
## 🛠️ Technology Stack

UPIShield models financial cybercrime syndicates as multi-tiered directed graphs.
| Component / Layer | Technology | Purpose in UPIShield |
|---|---|---|
| **Frontend Framework** | Next.js 14.2.5 (App Router) | Operational command web application hosted on Vercel |
| **Database** | Supabase PostgreSQL | Relational persistence for cases, complaints, transactions, and alerts |
| **Edge Functions** | Supabase Edge Functions (TypeScript/Deno) | Serverless HTTP API endpoints for risk evaluation, graph, and predictions |
| **GIS Mapping** | Leaflet / React-Leaflet | Dynamic geographic surveillance heatmap |
| **Styling** | Tailwind CSS | Responsive UI styling |
| **Testing** | Pytest / TypeScript Parity Suite | 22/22 passing tests validating logical parity |

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  Victim 1 (NCRP) │───┐    │ Layer-1 Mule Hub │────┐   │ Layer-2 Dist 1   │───┐
└──────────────────┘   │    │  (Primary Hub)   │    │   └──────────────────┘   │    ┌─────────────────┐
                       ├───>│ fastpay.sharma@  │    ├──>                       ├───>│ Terminal Runner │
┌──────────────────┐   │    │     okaxis       │    │   ┌──────────────────┐   │    │ Device / Token  │
│  Victim 2 (NCRP) │───┘    └──────────────────┘    └──>│ Layer-2 Dist 2   │───┘    └────────┬────────┘
└──────────────────┘                                    └──────────────────┘                 │
                                                                                             ▼
                                                                                    ┌─────────────────┐
                                                                                    │  Target ATM /   │
                                                                                    │   CSP Node      │
                                                                                    └─────────────────┘
```

- **Library**: `NetworkX` (`networkx>=3.3`) provides graph data structures and algorithm primitives.
- **UPIShield Graph Service** (`backend/services/graph_service.py`): Implements domain-specific network assembly:
  1. Extracts complaints and transactions associated with a given `case_id`.
  2. Adds `victim` nodes populated with complaint loss amounts and categories.
  3. Connects `mule_l1` and `mule_l2` accounts with `fund_transfer` edges weighted by transfer amounts.
  4. Binds operator device nodes (`device`) to mule accounts with `device_binding` edges ("Operated From").
  5. Links runner tokens (`runner_token`) to candidate physical extraction nodes (`atm_csp`) with `cashout_attempt` edges.
  6. Computes hub centrality to flag primary money-laundering aggregators.

---

## 🤖 Machine Learning Components
## 🔌 API Reference & Data Contracts

UPIShield cleanly separates rule-based decision logic from statistical and predictive machine learning models.
| Method | Endpoint | Supabase Edge Function | Response Model |
|---|---|---|---|
| `GET` | `/health` | `health/index.ts` | Health status object |
| `GET` | `/dashboard` | `dashboard/index.ts` | `DashboardStats` |
| `GET` | `/cases` | `cases/index.ts` | `List[CaseDetail]` |
| `GET` | `/cases/{case_id}` | `cases/index.ts` | `CaseDetail` + `RiskEvaluation` |
| `GET` | `/cases/{case_id}/network` | `cases/index.ts` | `EntityNetworkGraph` |
| `POST` | `/cases/{case_id}/predict-cashout` | `cases/index.ts` | `CashoutPredictionResponse` |
| `GET` | `/complaints` | `complaints/index.ts` | `List[Complaint]` |
| `GET` | `/complaints/{id}` | `complaints/index.ts` | `Complaint` |
| `GET` | `/locations` | `locations/index.ts` | `List[CashoutLocation]` |
| `GET` | `/locations/{id}` | `locations/index.ts` | `CashoutLocation` |
| `GET` | `/alerts` | `alerts/index.ts` | `List[AlertResponse]` |
| `POST` | `/alerts` | `alerts/index.ts` | `AlertResponse` |

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             UPIShield ML Components                              │
├────────────────────────────────────────┬─────────────────────────────────────────┤
│ Cash-Out Predictor                     │ Optional ML Anomaly Engine              │
│ (backend/ml/cashout_predictor.py)      │ (src/ml_engine.py)                      │
├────────────────────────────────────────┼─────────────────────────────────────────┤
│ Model: GradientBoostingRegressor       │ Model: IsolationForest                  │
│ Framework: scikit-learn                │ Framework: scikit-learn                 │
│ Estimators: 40, Max Depth: 3           │ Estimators: 50, Contamination: 0.05     │
│ Purpose: Rank physical withdrawal points│ Purpose: Auxiliary unsupervised score   │
│ Target: Withdrawal probability score   │ Features: [amt, hour, freq, dev, ben]   │
│ Fallback: Deterministic spatial score  │ Fallback: Returns None if untrained     │
└────────────────────────────────────────┴─────────────────────────────────────────┘
```
---

### Cash-Out Model Feature Engineering & Training
The model is trained via `backend/ml/train_cashout_model.py` on synthetic historical cash-out logs stored in the `historical_cashouts` table:
- **Distance Feature**: Geodesic distance in kilometers calculated using the Haversine formula (`haversine_distance`).
- **Density Feature**: Historical fraud count registered at the target node (`historical_fraud_count`).
- **Surveillance Feature**: CCTV availability flag (`cctv_available`).
- **Node Type Feature**: Categorical flag distinguishing Micro-ATM / CSP kiosks from standard bank ATMs (`is_csp`).
- **Case Amount Feature**: Total exposed funds in the current investigation.
## 🚀 Deployment Instructions (Supabase + Vercel)

If `scikit-learn` is absent or the model has not been trained, `CashoutPredictor` seamlessly executes its heuristic scoring formula:
Follow these step-by-step instructions to deploy UPIShield publicly without requiring a paid Python hosting server:

$$\text{Score}_{\text{heuristic}} = \max(0, 30 - 2.5 \cdot d) + \min(40, 2.2 \cdot C_{\text{fraud}}) + S_{\text{type}} + S_{\text{cctv}}$$
### Part 1: Deploy Supabase Backend

where $d$ is distance in km, $C_{\text{fraud}}$ is historical incident count, $S_{\text{type}} = +15$ for CSP (+5 for ATM), and $S_{\text{cctv}} = -8$ if CCTV is present (+10 if unmonitored).
1. **Create a Supabase Project**:
   - Sign up at [supabase.com](https://supabase.com) and create a new project named `UPIShield`.
   - Note your **Project URL** (`https://<project-ref>.supabase.co`), **Anon Key**, and **Service Role Key**.

---
2. **Link Project & Apply Database Schema**:
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase

## 🗺️ Operational Interface
   # Login to Supabase CLI
   supabase login

The frontend is a modern Next.js 14 Web Application built with Tailwind CSS, Lucide icons, and Leaflet GIS.
   # Link your local repo to your Supabase project
   supabase link --project-ref <your-project-ref>

| Route | Page Name | Primary Operational Purpose |
|---|---|---|
| `/` | **Command Dashboard** | High-level situation room with real-time KPI metrics, GIS spatial heatmap, priority analyst investigation queue, recent complaints feed, and system health status. |
| `/cases/[id]` | **Case Investigation View** | Detailed investigation workspace featuring the UPIShield Risk Gauge (0–100 score + decision), NetworkX Multi-Hop Flow visualizer, linked victim complaints table, and direct alert dispatch modal. |
| `/cashout` | **Cash-Out Surveillance** | Predictive intelligence console allowing analysts to select an investigation, view ranked candidate withdrawal points, inspect model reasoning, and review recommended field actions. |
| `/alerts` | **Intelligence Dispatch** | Response tracking feed displaying dispatched alerts, priority/status filters, recipient agency distribution (LEA Cyber Cell, Bank Nodal, I4C), and action codes. |
   # Push schema migration to Supabase PostgreSQL
   supabase db push
   ```

---
3. **Seed Initial Synthetic Data**:
   ```bash
   # Apply seed data to PostgreSQL
   supabase db reset
   # or execute seed directly via Supabase SQL Editor using content from supabase/seed.sql
   ```

## 🧩 Software Modules & Directory Structure
4. **Deploy Edge Functions**:
   ```bash
   # Deploy all Edge Functions to Supabase
   supabase functions deploy dashboard --no-verify-jwt
   supabase functions deploy cases --no-verify-jwt
   supabase functions deploy complaints --no-verify-jwt
   supabase functions deploy locations --no-verify-jwt
   supabase functions deploy alerts --no-verify-jwt
   supabase functions deploy health --no-verify-jwt
   ```

```
UPIShield/
├── backend/                       # FastAPI Backend Application
│   ├── main.py                    # FastAPI entrypoint, CORS & startup initialization
│   ├── models.py                  # Pydantic data contracts & API response models
│   ├── database.py                # SQLite connection manager & DDL schema creation
│   ├── synthetic_data.py          # Synthetic dataset seeder (complaints, cases, mules)
│   ├── ml/
│   │   ├── cashout_predictor.py   # GradientBoosting cash-out prediction engine
│   │   └── train_cashout_model.py # Reproducible cash-out model trainer script
│   ├── routers/                   # REST API Routers
│   │   ├── dashboard.py           # GET /api/dashboard endpoint
│   │   ├── cases.py               # GET/POST /api/cases endpoints & sub-routes
│   │   ├── complaints.py          # GET /api/complaints endpoints
│   │   ├── locations.py           # GET /api/locations endpoints
│   │   └── alerts.py              # GET/POST /api/alerts endpoints
│   └── services/                  # Business Logic Services
│       ├── risk_service.py        # Case risk evaluator wrapping UPIShield engine
│       ├── graph_service.py       # NetworkX multi-hop entity graph builder
│       ├── prediction_service.py  # Cash-out prediction service
│       └── alert_service.py       # In-memory & DB alert dispatch service
│
├── frontend/                      # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/                   # App Router pages (Dashboard, Cases, Cashout, Alerts)
│   │   │   ├── globals.css        # Global CSS & Tailwind styling rules
│   │   │   ├── layout.tsx         # Root layout with navigation sidebar
│   │   │   ├── page.tsx           # Command Dashboard (/)
│   │   │   ├── alerts/page.tsx    # Intelligence Dispatch (/alerts)
│   │   │   ├── cases/[id]/page.tsx# Case Investigation View (/cases/[id])
│   │   │   └── cashout/page.tsx   # Cash-Out Surveillance (/cashout)
│   │   ├── components/            # Reusable UI Components
│   │   │   ├── AlertModal.tsx     # Tactical alert dispatch modal
│   │   │   ├── LeafletMap.tsx     # Dynamic Leaflet GIS visualizer
│   │   │   ├── Navbar.tsx         # Top navigation header
│   │   │   ├── NetworkGraphVisualizer.tsx # SVG NetworkX graph renderer
│   │   │   ├── RiskScoreGauge.tsx # Circular 0-100 risk gauge component
│   │   │   └── ui/index.tsx       # Reusable KPI cards, panels, badges & skeletons
│   │   └── lib/
│   │       ├── api.ts             # Fetch API client communicating with FastAPI
│   │       └── types.ts           # TypeScript interfaces matching backend contracts
│   ├── package.json               # Frontend dependencies (Next.js, Leaflet, Tailwind)
│   └── tailwind.config.ts         # Tailwind CSS configuration
│
├── src/                           # UPIShield Core Python Risk Engine
│   ├── __init__.py
│   ├── risk_engine.py             # Dual-layer risk scoring & explainability engine
│   ├── behavior.py                # Statistical user behavior profiler & anomaly scorer
│   ├── config.py                  # Decision thresholds, rules & dynamic weighting policies
│   ├── ml_engine.py               # Optional IsolationForest ML anomaly detector
│   ├── data_generator.py          # Synthetic UPI transaction generator & dataset loader
│   └── utils.py                   # Math helpers & formatting utilities
│
├── tests/                         # Automated Test Suite (19 Passed Tests)
│   ├── __init__.py
│   ├── test_risk_engine.py        # Core risk engine unit tests (9 tests)
│   ├── test_backend_api.py        # FastAPI endpoint integration tests (9 tests)
│   └── test_live_e2e.py           # End-to-end operational pipeline test (1 test)
│
├── data/                          # Persistent SQLite Database & Datasets
│   ├── sih_cybercrime.db          # Auto-generated SQLite database
│   └── synthetic_transactions.csv # Synthetic transaction records
│
├── .env.example                   # Environment configuration template
├── app.py                         # Standalone legacy Streamlit prototype
├── requirements.txt               # Backend Python dependencies
└── README.md                      # Comprehensive project documentation
```
5. **Set Supabase Secrets**:
   ```bash
   supabase secrets set SUPABASE_URL=https://<your-project-ref>.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   supabase secrets set SUPABASE_ANON_KEY=<your-anon-key>
   ```

---

## 🛠️ Technology Stack
### Part 2: Deploy Next.js Frontend to Vercel

| Component / Layer | Technology | Version / Specification | Purpose in UPIShield |
|---|---|---|---|
| **Frontend Framework** | Next.js | 14.2.5 (App Router) | Operational command web application |
| **Frontend UI Library** | React | 18.3.1 | Component-driven user interface |
| **Styling** | Tailwind CSS | 3.4.7 | Styling and responsive design |
| **GIS Mapping** | Leaflet / React-Leaflet | 1.9.4 | Interactive geographic hotspot surveillance map |
| **Icons** | Lucide React | 0.441.0 | Tactical icons and operational badges |
| **Backend Framework** | FastAPI | 0.115+ | High-performance asynchronous REST API server |
| **ASGI Server** | Uvicorn | 0.30+ | Production-grade ASGI server runner |
| **Data Models** | Pydantic | 2.8+ | Schema validation and data contract enforcement |
| **Graph Analysis** | NetworkX | 3.3+ | Directed entity network graph construction |
| **Machine Learning** | scikit-learn | 1.3+ | `GradientBoostingRegressor` & `IsolationForest` |
| **Data Processing** | Pandas / NumPy | 2.0+ / 1.24+ | Dataframe manipulation and statistical arrays |
| **Database** | SQLite3 | Native Python 3.13 | Prototype relational persistence |
| **Testing** | Pytest / HTTPX | 8.4+ / 0.27+ | Unit, API, and E2E automated testing |
| **Language** | Python | 3.9+ (Tested on 3.13) | Core intelligence logic and backend |
1. **Push Repository to GitHub**:
   Ensure all changes are committed and pushed to your GitHub repository.

---
2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **Add New Project**.
   - Import `Priyangshudan/UPIShield`.
   - Set **Root Directory** to `frontend`.

## 🔌 API Reference & Data Contracts
3. **Configure Environment Variables in Vercel**:
   Add the following Environment Variables in Vercel settings:

The FastAPI backend exposes the following REST API endpoints:
   | Key | Value | Description |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Your Supabase Anon Key |

| Method | Endpoint | Description | Query / Body Params | Response Model |
|---|---|---|---|---|
| `GET` | `/api/health` | Backend system health check | None | JSON status object |
| `GET` | `/api/dashboard` | Aggregated dashboard KPIs and hotspots | None | `DashboardStats` |
| `GET` | `/api/cases` | List all converged investigation cases | None | `List[CaseDetail]` |
| `GET` | `/api/cases/{case_id}` | Fetch detailed case profile & risk eval | `case_id` (path) | `CaseDetail` |
| `GET` | `/api/cases/{case_id}/network` | Build NetworkX multi-hop entity graph | `case_id` (path) | `EntityNetworkGraph` |
| `POST` | `/api/cases/{case_id}/predict-cashout` | Predict top candidate withdrawal points | `case_id` (path) | `CashoutPredictionResponse` |
| `GET` | `/api/complaints` | List NCRP complaints | `case_id` (optional filter) | `List[Complaint]` |
| `GET` | `/api/complaints/{id}` | Fetch single NCRP complaint by ID | `id` (path) | `Complaint` |
| `GET` | `/api/locations` | List physical ATM/CSP locations | `city` (optional filter) | `List[CashoutLocation]` |
| `GET` | `/api/locations/{id}` | Fetch single ATM/CSP location by ID | `id` (path) | `CashoutLocation` |
| `GET` | `/api/alerts` | List all dispatched intelligence alerts | None | `List[AlertResponse]` |
| `POST` | `/api/alerts` | Dispatch a new multi-agency alert | `AlertCreateRequest` (body) | `AlertResponse` |
4. **Deploy**:
   Click **Deploy**. Vercel will build and launch your production web application.

---

## 🧪 Synthetic Datasets, Testing & Reproducibility
## 🧪 Local Testing & Verification

### Synthetic Data Safeguards
All data within UPIShield is synthetically generated using reproducible random seeds (`src/data_generator.py` and `backend/synthetic_data.py`).
- **No Real Financial Data**: Account numbers, UPI IDs (`fastpay.sharma@okaxis`), names, phone numbers, and transaction amounts are entirely simulated.
- **SQLite Database**: Automatically created and initialized at `data/sih_cybercrime.db` on backend startup.

### Automated Test Suite Verification
UPIShield includes a comprehensive test suite in `tests/` verified using `pytest`:

Run all unit, API, and parity tests locally:
```bash
# Execute full test suite
python -m pytest
```

**Test Results Summary (19/19 Passing)**:
- `tests/test_risk_engine.py` (**9 passed**): Validates general risk scoring, behavioral profile construction, dynamic cohort weighting (`NO_HISTORY`, `LIMITED_HISTORY`, `SUFFICIENT_HISTORY`), threshold classifications (`ALLOW`, `VERIFY`, `BLOCK`), and human-readable explanation generation.
- `tests/test_backend_api.py` (**9 passed**): Validates FastAPI endpoints (`/api/health`, `/api/dashboard`, `/api/cases`, `/api/cases/{id}`, `/api/cases/{id}/network`, `/api/cases/{id}/predict-cashout`, `/api/complaints`, `/api/locations`, `/api/alerts`).
- `tests/test_live_e2e.py` (**1 passed**): Validates full operational execution from database seeding to risk evaluation, graph construction, cash-out prediction, and alert creation.

---

## 🚀 Installation & Quickstart Guide

### Prerequisites
- **Python 3.9+** (Tested on Python 3.13)
- **Node.js 18+** & `npm`

### Step 1: Clone Repository & Setup Python Virtual Environment
```bash
# Clone the repository
git clone https://github.com/Priyangshudan/UPIShield.git
cd UPIShield

# Create and activate a Python virtual environment (Windows pwsh example)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt
```

### Step 2: Run Automated Tests
Verify that all 19 unit, API, and E2E tests pass cleanly:
```bash
python -m pytest
```

### Step 3: Start FastAPI Backend
```bash
uvicorn backend.main:app --reload --port 8000
```
- **Backend API Base**: `http://127.0.0.1:8000`
- **Swagger Interactive API Docs**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/api/health`

### Step 4: Start Next.js Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Open your browser at: `http://localhost:3000`

*(Optional) The legacy standalone Streamlit interface can be launched via `streamlit run app.py`.*

---

## 🖥️ Hackathon Demonstration & Judging Guide

Follow this vertical slice during an SIH presentation to demonstrate the complete UPIShield pipeline:

1. **Operational Command Center (`http://localhost:3000`)**:
   - Inspect top KPI cards: Total Complaints, High-Risk Investigations, Amount at Risk (INR), and Monitored Hotspots.
   - View the interactive dark-mode Leaflet GIS map displaying flagged ATM/CSP nodes across Delhi-NCR.
   - Click on **Demo Case `#4401`** ("Multi-State Investment Scam Syndicate") in the Priority Investigations queue.

2. **Case Investigation & Multi-Hop Graph (`http://localhost:3000/cases/CASE-2026-4401`)**:
   - Review the **UPIShield Risk Gauge**: Observe the `95.0/100 BLOCK` classification and inspect the decomposed General Risk vs. Behavioral Anomaly factors.
   - Examine the **NetworkX Multi-Hop Visualizer**: Trace funds from 3 victim complaints through Layer-1 Hub (`fastpay.sharma@okaxis`) into 2 Layer-2 distribution accounts and operator devices.
   - Click **Predict Cash-Out** to launch the predictive model.

3. **ATM/CSP Cash-Out Prediction (`http://localhost:3000/cashout?caseId=CASE-2026-4401`)**:
   - Observe the `GradientBoostingRegressor` model output ranking candidate physical withdrawal points.
   - Note top candidate: *SBI 24x7 E-Corner ATM (Rohini)* with a high confidence score and an estimated time window of "10 - 25 mins".
   - Review contributing factors (spatial proximity, CCTV absence, historical fraud density) and recommended operational actions.

4. **Multi-Agency Tactical Alert Dispatch (`http://localhost:3000/alerts`)**:
   - Click **Dispatch Alert** on the case page or inspect `/alerts`.
   - Verify generated tactical alert cards containing debit freeze codes (`ACT-FREEZE-L1-L2`) and field interception routing for Police Cyber Cells, Bank Nodal Officers, and I4C.

---

## 🔮 Future Scope & Production Roadmap

*Items listed below represent potential future architectural expansions beyond the current prototype:*

- 🏦 **Bank Nodal API Integration**: Transitioning from synthetic data to standardized ISO 20022 / OpenAPI feeds from core banking systems (CBS).
- 🌐 **Real-Time NPCI / UPI Gateway Stream Processing**: Deploying Apache Kafka or Apache Flink pipelines for sub-second streaming inference on live UPI message queues.
- 📡 **Live NCRP / 1930 Portal Connectors**: Automated API integration with the National Cyber Crime Reporting Portal for instant incident intake.
- 🧬 **Advanced Graph Neural Networks (GNN)**: Upgrading from NetworkX static graph traversal to dynamic Graph Convolutional Networks (GCN) or Temporal Graph Networks (TGN) for automated syndicate embedding.
- 🔐 **Privacy-Preserving Federated Learning**: Enabling multi-bank collaborative model training using Federated Learning and Differential Privacy without sharing raw customer PII.
- 🛰️ **Cell-Tower & Mobile Device Telemetry Fusion**: Fusing LBS (Location Based Services) and cell-tower triangulation with Micro-ATM withdrawal alerts for enhanced field interception accuracy.

---

## 👥 Team & Hackathon Acknowledgments

Developed for **Smart India Hackathon (SIH) 2026** under Problem Statement **SIH26184**.

*Built with Python, FastAPI, NetworkX, scikit-learn, Next.js, and Leaflet GIS.*
*Built with Next.js, Vercel, Supabase PostgreSQL, Supabase Edge Functions, Leaflet GIS, and Python FastAPI.*
