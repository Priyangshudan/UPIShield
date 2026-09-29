# UPIShield

### Proactive Cybercrime Intelligence & Cash-Out Prediction Framework

> SIH 2026 — Problem Statement SIH26184  
> Cybercrime Intelligence & Fraud Analysis Prototype

UPIShield is a prototype for identifying suspicious UPI transaction patterns, tracing multi-hop mule account networks, and predicting likely physical cash-out locations.

---

## Overview

Financial cyber fraud often involves rapid movement of money through multiple mule accounts before the funds are withdrawn as cash. By the time a complaint is processed and a freeze order is issued, the money may already have moved through several accounts and reached an ATM or Customer Service Point (CSP).

UPIShield is designed to help investigators connect these events into a single intelligence picture.

The system combines:

1. **NCRP complaint convergence**  
   Groups related victim complaints into unified investigative cases.

2. **Dual-layer fraud risk analysis**  
   Combines rule-based risk scoring with behavioral anomaly analysis.

3. **Multi-hop mule network analysis**  
   Maps relationships between victims, mule accounts, devices, runners, and cash-out locations.

4. **Cash-out location prediction**  
   Ranks possible ATM and CSP locations using spatial, historical, and case-related features.

5. **Operational dashboard**  
   Provides investigators with case information, network graphs, risk scores, maps, and alert dispatch capabilities.

> **Note:** UPIShield is a prototype and currently works with synthetic/simulated cybercrime and transaction data. It does not connect to live banking systems, NPCI/UPI production infrastructure, or real NCRP records.

---

## Key Features

- NCRP / 1930 complaint ingestion
- Automated convergence of related complaints
- Dual-layer transaction risk scoring
- Behavioral profiling of transaction patterns
- Multi-hop mule account network visualization
- Cash-out location prediction
- Interactive Leaflet-based GIS maps
- Case investigation dashboard
- Multi-agency alert dispatch simulation
- Global intelligence search across cases and entities

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js, React | Operational web application |
| UI | Tailwind CSS, Lucide Icons | Interface and reusable components |
| Mapping | Leaflet / React-Leaflet | Geographic surveillance and hotspot visualization |
| Backend | Supabase Edge Functions, Deno, TypeScript | Serverless API layer |
| Database | Supabase PostgreSQL | Persistent application data |
| Python Backend | FastAPI, Uvicorn, Pydantic | Alternative local REST API |
| Graph Analysis | NetworkX / TypeScript graph builder | Multi-hop entity relationships |
| Machine Learning | scikit-learn | Risk and cash-out prediction models |
| Testing | Pytest / TypeScript tests | Automated testing |

---

## System Architecture

UPIShield currently supports a serverless deployment using Vercel and Supabase, along with a local development setup.

```text
                    UPIShield Frontend
                     Next.js / React
                           |
                           v
                Supabase Edge Functions
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
         PostgreSQL     Case APIs    Alert APIs
             |
             v
       Synthetic Dataset