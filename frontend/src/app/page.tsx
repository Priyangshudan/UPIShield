"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileCheck,
  FileText,
  Flame,
  GitFork,
  HelpCircle,
  IndianRupee,
  Layers,
  MapPin,
  Network,
  Radio,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Terminal,
} from "lucide-react";
import { InteractiveMapRadar } from "@/components/InteractiveMapRadar";
import { HeroSection } from "@/components/hero/HeroSection";

export default function MarketingLandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"SILOED" | "UPISHIELD">("UPISHIELD");

  const faqs = [
    {
      q: "What problem does UPIShield solve?",
      a: "UPIShield addresses the physical extraction gap in financial cybercrime. While traditional banking fraud systems only monitor isolated transactions, cybercrime syndicates rapidly split siphoned UPI funds across multiple mule account layers within minutes and withdraw physical cash at nearby ATMs or Customer Service Points (CSPs). UPIShield correlates multi-victim complaints in real-time, traces the mule network, and predicts likely physical withdrawal locations before the money is liquidated.",
    },
    {
      q: "How does the cash-out prediction engine work?",
      a: "The prediction engine combines transaction velocity vectors, device tower spatial proximity, historical withdrawal density, and ATM cash availability through an explainable gradient-boosted decision tree. It ranks candidate ATM and CSP terminals across Delhi-NCR and estimates the physical runner's arrival window (typically 12–35 minutes).",
    },
    {
      q: "Does UPIShield connect to live NPCI or production bank databases?",
      a: "No. In strict accordance with regulatory guidelines and privacy laws, this deployment operates in a deterministic synthetic environment. It uses seeded scenarios modeled from realistic NCRP (National Cybercrime Reporting Portal) complaints, synthetic mule transaction topologies, and public commercial ATM locations without accessing live customer accounts.",
    },
    {
      q: "How are alerts formatted and dispatched to stakeholder agencies?",
      a: "Alerts are automatically packaged into standardized tactical records containing the case docket, primary mule account, attached withdrawal endpoints with coordinates, and recommended action codes (such as ATM debit-freeze or police beat interdiction). These payloads are formatted for state Police Cyber Cells, Bank Fraud Nodal officers, and the Indian Cyber Crime Coordination Centre (I4C).",
    },
    {
      q: "What makes the risk scoring explainable for law enforcement analysts?",
      a: "Rather than treating machine learning as an opaque black box, UPIShield deconstructs risk into three distinct pillars: Rule-Based Heuristics (velocity spikes, PAN evasion), Behavioral Anomaly (dormant account reactivation, withdrawal bursts), and Graph Centrality (multi-hop fan-out depth). Each pillar displays the exact mathematical contribution and observed evidence.",
    },
    {
      q: "Can this system be deployed by state police cyber cells?",
      a: "Yes. The modular architecture is designed to ingest standard NCRP CSV/API feeds, interface with existing cybercell dispatch terminals, and export JSON tactical payloads directly to field patrol teams and bank nodal desks.",
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-shield-emerald-light selection:text-shield-emerald-dark">
      {/* 1. STICKY MINIMAL NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper-100 shadow-subtle overflow-hidden">
              <img src="/logo.png" alt="UPIShield" width={40} height={40} className="h-10 w-10 object-cover" />
            </div>
            <div>
              <span className="font-editorial text-xl font-extrabold tracking-tight text-ink">
                UPI<span className="text-shield-emerald">Shield</span>
              </span>
            </div>
          </Link>

          {/* Anchor Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-ink-soft">
            <a href="#problem" className="hover:text-ink transition-colors">
              The Insight
            </a>
            <a href="#pillars" className="hover:text-ink transition-colors">
              Pillars
            </a>
            <a href="#simulation" className="hover:text-ink transition-colors">
              Radar
            </a>
            <a href="#faq" className="hover:text-ink transition-colors">
              FAQ
            </a>
            <Link
              href="/about-the-data"
              className="text-ink-faint hover:text-ink transition-colors"
            >
              Methodology
            </Link>
          </div>

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="btn-editorial btn-editorial-primary text-xs h-11 px-6 shadow-subtle hover:shadow-editorial"
            >
              Launch demo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. PREMIUM INTERACTIVE HERO SECTION */}
      <HeroSection />

      {/* 3. PROBLEM VS. INSIGHT SECTION */}
      <section id="problem" className="border-b border-line py-20 sm:py-28 bg-paper">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="editorial-kicker crimson">The Structural Blindspot</div>
            <h2 className="headline-display uppercase text-ink">
              Siloed Statements vs. Linked Intelligence
            </h2>
            <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
              Why do existing bank rule engines fail to stop UPI fraud? Because cybercriminals never
              leave stolen funds in one account. They shatter transactions across multiple institutions.
            </p>
          </div>

          {/* Interactive Contrast Switcher */}
          <div className="flex items-center gap-2 border-b border-line pb-4">
            <button
              onClick={() => setActiveTab("SILOED")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                activeTab === "SILOED"
                  ? "border-shield-crimson bg-shield-crimson-light text-shield-crimson"
                  : "border-line bg-paper-50 text-ink-soft hover:bg-white"
              }`}
            >
              What Legacy Systems See
            </button>
            <button
              onClick={() => setActiveTab("UPISHIELD")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                activeTab === "UPISHIELD"
                  ? "border-shield-emerald bg-shield-emerald-light text-shield-emerald-dark"
                  : "border-line bg-paper-50 text-ink-soft hover:bg-white"
              }`}
            >
              What UPIShield Sees
            </button>
          </div>

          {/* Split Content Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            <div
              className={`card-editorial p-8 space-y-4 border-2 transition-all ${
                activeTab === "SILOED"
                  ? "border-shield-crimson bg-paper-50 shadow-md"
                  : "border-line opacity-60 bg-paper-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="mono text-xs font-bold text-shield-crimson">
                  FRAGMENTED VIEW
                </span>
                <span className="text-[10px] uppercase font-bold text-ink-faint">
                  Isolated Bank Silo
                </span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-ink">
                Disconnected Bank Narrations
              </h3>
              <ul className="space-y-3 text-xs text-ink-soft leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-shield-crimson font-bold mt-0.5">✕</span>
                  <span>
                    Individual transactions under ₹50,000 evade mandatory PAN thresholds and high-risk triggers.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-shield-crimson font-bold mt-0.5">✕</span>
                  <span>
                    Bank A has no visibility when funds jump to Bank B, Bank C, and e-wallets within 90 seconds.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-shield-crimson font-bold mt-0.5">✕</span>
                  <span>
                    By the time an FIR or manual notice is drafted, physical cash has already been liquidated at an ATM.
                  </span>
                </li>
              </ul>
            </div>

            <div
              className={`card-editorial p-8 space-y-4 border-2 transition-all ${
                activeTab === "UPISHIELD"
                  ? "border-shield-emerald bg-paper-50 shadow-md"
                  : "border-line opacity-60 bg-paper-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="mono text-xs font-bold text-shield-emerald">
                  CONVERGED INTELLIGENCE
                </span>
                <span className="text-[10px] uppercase font-bold text-shield-emerald">
                  UPIShield Graph Engine
                </span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-ink">
                Multi-Hop Graph &amp; Predictive Spatial Exit
              </h3>
              <ul className="space-y-3 text-xs text-ink-soft leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-shield-emerald shrink-0 mt-0.5" />
                  <span>
                    Instantly converges distinct citizen complaints matching the same mule syndicate cluster.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-shield-emerald shrink-0 mt-0.5" />
                  <span>
                    Traces multi-hop fan-out across L1, L2, and L3 mule bank accounts to reveal the root beneficiary.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-shield-emerald shrink-0 mt-0.5" />
                  <span>
                    Predicts physical ATM and CSP cash-out hotspots and automatically transmits tactical freeze alerts.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE NUMBERED PILLARS */}
      <section id="pillars" className="border-b border-line py-20 sm:py-28 bg-paper-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-14">
          <div className="max-w-2xl space-y-3">
            <div className="editorial-kicker emerald">Architecture Pillars</div>
            <h2 className="headline-display uppercase text-ink">
              Three Steps To Cash-Out Containment
            </h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              A continuous, automated pipeline from victim report ingestion to multi-agency physical interdiction.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Pillar 01 */}
            <div className="card-editorial p-8 space-y-5 bg-paper-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="font-editorial text-3xl font-extrabold text-shield-emerald">
                    01
                  </span>
                  <span className="mono text-[10px] font-bold uppercase text-ink-faint">
                    Ingestion Layer
                  </span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-ink">
                  Detect &amp; Converge
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Real-time ingestion of NCRP citizen complaints. The system clusters unrelated victim
                  reports sharing identical payee VPAs, phone numbers, or device fingerprints within seconds.
                </p>
              </div>
              <div className="mono text-[10px] font-bold text-shield-emerald border-t border-line-faint pt-4">
                LATENCY: SUB-MINUTE INGESTION
              </div>
            </div>

            {/* Pillar 02 */}
            <div className="card-editorial p-8 space-y-5 bg-paper-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="font-editorial text-3xl font-extrabold text-shield-amber">
                    02
                  </span>
                  <span className="mono text-[10px] font-bold uppercase text-ink-faint">
                    Graph Traversal
                  </span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-ink">
                  Trace Mule Topologies
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  NetworkX multi-hop entity traversal tracks funds as they split from Primary Mule (L1)
                  to Secondary Mules (L2/L3) and runner tokens, calculating centrality and layer velocity.
                </p>
              </div>
              <div className="mono text-[10px] font-bold text-shield-amber border-t border-line-faint pt-4">
                DEPTH: 4 HIERARCHICAL LAYERS
              </div>
            </div>

            {/* Pillar 03 */}
            <div className="card-editorial p-8 space-y-5 bg-paper-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="font-editorial text-3xl font-extrabold text-shield-crimson">
                    03
                  </span>
                  <span className="mono text-[10px] font-bold uppercase text-ink-faint">
                    Interception
                  </span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-ink">
                  Predict &amp; Intervene
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  A spatial gradient-boosted decision tree scores nearby bank ATMs and CSP kiosks,
                  ranking highest withdrawal probability and dispatching immediate freeze alerts to police and bank nodals.
                </p>
              </div>
              <div className="mono text-[10px] font-bold text-shield-crimson border-t border-line-faint pt-4">
                DISPATCH: MULTI-AGENCY SYNC
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE MAP & RADAR ANIMATION SECTION */}
      <section id="simulation" className="border-b border-line py-20 sm:py-28 bg-paper">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="editorial-kicker emerald">Spatial-Temporal Surveillance</div>
              <h2 className="headline-display uppercase text-ink">
                Live Transaction Radar Simulation
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Watch how suspicious UPI velocity vectors traverse from compromised victim accounts through
                intermediate mule nodes to ranked physical Delhi-NCR withdrawal endpoints in real-time.
              </p>
            </div>
            <Link
              href="/cashout"
              className="btn-editorial btn-editorial-primary text-xs h-11 px-5 shrink-0"
            >
              Open Full Surveillance Console <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Embedded Interactive Radar Canvas */}
          <InteractiveMapRadar />
        </div>
      </section>

      {/* 6. ILLUSTRATIVE METRICS STRIP */}
      <section className="border-b border-line py-16 bg-paper-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1">
              <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-ink">
                84%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-shield-emerald">
                Prediction Accuracy
              </div>
              <div className="text-[10px] text-ink-faint mono">
                Top-3 ATM exit ranking on synthetic benchmark
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-ink">
                &lt; 18m
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Triage-to-Dispatch
              </div>
              <div className="text-[10px] text-ink-faint mono">
                Automated multi-agency alert transmission
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-ink">
                100%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-shield-amber">
                Explainable Risk
              </div>
              <div className="text-[10px] text-ink-faint mono">
                Rules + Behavioral Anomaly + Graph Centrality
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-ink">
                0
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Live Data Retained
              </div>
              <div className="text-[10px] text-ink-faint mono">
                Zero-PII synthetic modeling environment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ACCESSIBLE FAQ ACCORDION */}
      <section id="faq" className="border-b border-line py-20 sm:py-28 bg-paper">
        <div className="mx-auto max-w-4xl px-6 lg:px-12 space-y-12">
          <div className="text-center space-y-3">
            <div className="editorial-kicker text-ink-faint">Frequently Answered Inquiries</div>
            <h2 className="headline-display uppercase text-ink">
              Understanding The Methodology
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft max-w-xl mx-auto">
              Clear answers regarding machine learning explainability, synthetic data disclosures, and operational deployment.
            </p>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div key={idx} className="py-6">
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="flex w-full items-start justify-between gap-4 text-left group"
                  >
                    <span className="font-editorial text-base sm:text-lg font-bold text-ink group-hover:text-shield-emerald transition-colors">
                      {faq.q}
                    </span>
                    <span
                      className={`p-1 border border-line bg-paper-100 text-ink-soft shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-ink-soft pr-8 animate-fadeIn">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CLOSING CTA BAND */}
      <section className="py-20 sm:py-28 bg-paper-100 text-center">
        <div className="mx-auto max-w-4xl px-6 lg:px-12 space-y-8">
          <div className="space-y-4">
            <div className="editorial-kicker crimson">Immediate Action Required</div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-ink leading-tight">
              Stop The Siphon Before The Cash Exits.
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-ink-soft leading-relaxed">
              Experience the full interactive workspace, investigate Operation ShadowMule, and simulate
              predictive ATM cash-out interdiction with deterministic synthetic telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/app"
              className="btn-editorial btn-editorial-primary text-xs h-12 px-8 tracking-wider shadow-editorial"
            >
              Launch Interactive Demo <ArrowRight size={15} />
            </Link>
            <Link
              href="/cases/CASE-2026-4401"
              className="btn-editorial btn-editorial-quiet text-xs h-12 px-7 tracking-wider"
            >
              Inspect Case 4401 Dossier
            </Link>
          </div>
        </div>
      </section>

      {/* 9. INSTITUTIONAL FOOTER */}
      <footer className="border-t border-line bg-paper py-12 text-xs text-ink-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-line bg-paper-100 overflow-hidden">
              <img src="/logo.png" alt="UPIShield" width={32} height={32} className="h-8 w-8 object-cover" />
            </div>
            <div>
              <div className="font-editorial text-sm font-extrabold text-ink">
                UPI<span className="text-shield-emerald">Shield</span>
              </div>
              <div className="text-[9px] mono text-ink-faint">
                Autonomous Cybercrime Intelligence
              </div>
            </div>
          </div>


          <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-wider">
            <Link href="/about-the-data" className="hover:text-ink">
              Methodology Disclosure
            </Link>
            <Link href="/app" className="text-shield-emerald hover:underline">
              Enter Workspace →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
