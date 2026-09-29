"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck,
  FileText,
  Lock,
  Network,
  Scale,
  Shield,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AboutTheDataPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-shield-emerald-light selection:text-shield-emerald-dark">
      {/* Navigation Bar */}
      <nav className="border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper-100 shadow-subtle overflow-hidden">
              <img src="/logo.png" alt="UPIShield" width={40} height={40} className="h-10 w-10 object-cover" />
            </div>
            <div>
              <span className="font-editorial text-xl font-extrabold tracking-tight text-ink">
                UPI<span className="text-shield-emerald">Shield</span>
              </span>
              <span className="ml-2 border border-line-strong px-1.5 py-0.2 mono text-[8px] font-bold text-ink-faint uppercase">
                DISCLOSURE
              </span>
            </div>
          </Link>

          <Link
            href="/app"
            className="btn-editorial btn-editorial-primary text-xs h-10 px-5"
          >
            Launch workspace <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Main Content Article */}
      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24 space-y-12">
        <div className="space-y-4 border-b border-line pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-faint hover:text-shield-emerald transition-colors"
          >
            <ArrowLeft size={13} /> Return to Home
          </Link>
          <div className="editorial-kicker emerald">
            Institutional Methodology &amp; Compliance Statement
          </div>
          <h1 className="headline-display uppercase text-ink">
            About The Data &amp; Mathematical Heuristics
          </h1>
          <p className="text-sm sm:text-base text-ink-soft leading-relaxed max-w-3xl">
            A comprehensive overview of our synthetic data generation pipeline, privacy safeguards,
            and machine learning model explainability engineered for proactive cybercrime interception.
          </p>
        </div>

        {/* Section 1: Synthetic Data Pipeline */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="mono text-xs font-bold text-shield-emerald">01</span>
            <h2 className="headline-sub text-ink">Synthetic Data Generation Principles</h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            UPIShield operates in a strictly isolated, deterministic synthetic intelligence environment.
            In compliance with Reserve Bank of India (RBI) guidelines, Indian IT Act regulations, and
            strict banking secrecy norms, <strong>no production bank account information, NPCI UPI switch data,
            or real citizen Personally Identifiable Information (PII) is accessed or stored.</strong>
          </p>
          <div className="card-editorial p-6 bg-paper-50 space-y-3">
            <div className="editorial-kicker text-ink-faint">Seeded Data Composition</div>
            <ul className="grid gap-2 sm:grid-cols-2 text-xs text-ink-soft leading-relaxed">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-shield-emerald shrink-0" />
                <span>42 Seeded NCRP Citizen Complaint Dossiers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-shield-emerald shrink-0" />
                <span>12 Coordinated Investigation Topologies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-shield-emerald shrink-0" />
                <span>26 Verified Delhi-NCR Commercial ATM / CSP Terminals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-shield-emerald shrink-0" />
                <span>32 Tactical Intelligence Dispatch Records</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Mathematical Risk Evaluation */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="mono text-xs font-bold text-shield-emerald">02</span>
            <h2 className="headline-sub text-ink">Dual-Layer Explainable Scoring Model</h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            To prevent arbitrary algorithmic bias, each case is assessed across three transparent pillars:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-editorial p-5 bg-paper-50 space-y-2">
              <div className="mono text-[10px] font-bold text-shield-emerald">PILLAR A</div>
              <div className="font-editorial text-sm font-bold text-ink">General Heuristics</div>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                Evaluates inbound velocity bursts, transfer timing spikes, PAN evasion amounts (e.g. ₹49,990), and geographic mismatches.
              </p>
            </div>
            <div className="card-editorial p-5 bg-paper-50 space-y-2">
              <div className="mono text-[10px] font-bold text-shield-amber">PILLAR B</div>
              <div className="font-editorial text-sm font-bold text-ink">Behavioral Anomaly</div>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                Measures deviation from historical baseline activity, such as dormant student accounts suddenly funneling lakhs within minutes.
              </p>
            </div>
            <div className="card-editorial p-5 bg-paper-50 space-y-2">
              <div className="mono text-[10px] font-bold text-shield-crimson">PILLAR C</div>
              <div className="font-editorial text-sm font-bold text-ink">Network Centrality</div>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                Applies NetworkX graph algorithms to compute in-degree fan-out, multi-hop layering depth, and runner token generation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Cash-Out Spatial Modeling */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="mono text-xs font-bold text-shield-emerald">03</span>
            <h2 className="headline-sub text-ink">Predictive Spatial Ranking Trees</h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            The cash-out prediction engine relies on an XGBoost decision tree trained on spatio-temporal features:
          </p>
          <div className="card-editorial p-6 bg-paper-50 space-y-3 mono text-xs text-ink-soft leading-relaxed">
            <div className="text-ink font-bold font-editorial">Ranking Objective:</div>
            <div>Score = w1·(1 / Distance_km) + w2·(Historical_Fraud_Density) + w3·(Liquidity_Alignment) - w4·(CCTV_Presence)</div>
            <p className="font-sans text-[11px] text-ink-faint">
              Terminals with high historical fraud counts, no functional CCTV recording capability, and close proximity to the suspect device tower receive maximum priority for beat patrol interdiction.
            </p>
          </div>
        </section>

        {/* Callout Footer */}
        <div className="border-t border-line pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-ink">Ready to explore the intelligence platform?</div>
            <div className="text-[11px] text-ink-soft">Launch the interactive environment without authentication.</div>
          </div>
          <Link
            href="/app"
            className="btn-editorial btn-editorial-primary text-xs h-11 px-6 shrink-0"
          >
            Launch Command Center <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-line bg-paper-100 py-8 text-center text-[10px] text-ink-faint mono">
        UPIShield · Financial Cybercrime Intelligence &amp; Cash-Out Prediction
      </footer>
    </div>
  );
}
