"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Flame,
  IndianRupee,
  Layers,
  Network,
  Radio,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Workflow,
  Zap,
} from "lucide-react";
import { fetchDashboardStats, fetchCases } from "@/lib/api";
import { CaseDetail, DashboardStats } from "@/lib/types";
import {
  cx,
  ErrorState,
  KpiCard,
  Panel,
  SectionHeader,
  Skeleton,
  StatusBadge,
} from "@/components/ui";
import { LeafletMap } from "@/components/LeafletMap";

function formatMoney(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function CommandDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(2); // 0-indexed: default Mule Account

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchDashboardStats(), fetchCases()])
      .then(([s, c]) => {
        setStats(s);
        setCases(c);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Intelligence network connectivity interrupted.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const priorityCases = useMemo(() => {
    return [...cases]
      .sort(
        (a, b) =>
          (b.risk_evaluation?.final_score || 0) -
          (a.risk_evaluation?.final_score || 0)
      )
      .slice(0, 6);
  }, [cases]);

  const complaints = stats?.recent_complaints || [];

  const flowSteps = [
    {
      num: "01",
      tag: "COMPLAINT",
      title: "Citizen Report",
      desc: "NCRP victim reporting & initial FIR filing via citizen portal",
      stat: "42 Ingested",
      velocity: "< 15m dwell",
      focus: "Victim KYC & Immediate Chargeback Notice",
    },
    {
      num: "02",
      tag: "BENEFICIARY",
      title: "Target VPA",
      desc: "Fraudulent UPI handle receiving unauthorized siphoned funds",
      stat: "₹5.47 L Siphoned",
      velocity: "30s transit",
      focus: "Primary Beneficiary Ingestion & Reverse Lookup",
    },
    {
      num: "03",
      tag: "MULE L1",
      title: "Mule Account",
      desc: "First hop bank account utilized for rapid layering",
      stat: "14 Transactions",
      velocity: "180s fan-out",
      focus: "Multi-Hop Graph Traversal & Rapid Splitting",
    },
    {
      num: "04",
      tag: "DISTRIBUTION",
      title: "Layering L2/L3",
      desc: "High-speed dispersal to micro-mule accounts to evade PAN limits",
      stat: "3 Sub-branches",
      velocity: "Sub-minute split",
      focus: "Centrality Metrics & Runner Token Generation",
    },
    {
      num: "05",
      tag: "EXIT",
      title: "ATM / CSP Exit",
      desc: "Predicted cash liquidation at ATMs or CSP kiosks in Delhi-NCR",
      stat: "26 Hotspots",
      velocity: "Imminent (12m)",
      focus: "Physical Beat Patrol & Terminal Debit Freeze",
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* SECTION 1: EDITORIAL HERO & TELEMETRY STRIP */}
      <section className="relative pt-2 pb-6 border-b border-line">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="editorial-kicker text-ink-faint">
              Operational Command Center · Active Surveillance
            </div>
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] text-ink-faint uppercase font-bold tracking-wider">
                SURVEILLANCE DISPATCH
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-shield-emerald animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1 className="headline-display uppercase text-ink">
              Trace The Money. <br />
              <span className="text-shield-emerald">Predict</span> The{" "}
              <span className="underline decoration-shield-crimson decoration-4 underline-offset-4">
                Cash-Out.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-ink-soft max-w-2xl leading-relaxed">
              Autonomous financial cybercrime surveillance correlating citizen NCRP complaints,
              multi-hop mule accounts, and spatial ATM/CSP risk density across Delhi-NCR.
            </p>
          </div>

          {/* Integrated High-Impact Telemetry Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-line bg-paper-50 divide-x divide-y lg:divide-y-0 divide-line shadow-subtle mt-4">
            <div className="p-5 sm:p-6">
              <div className="editorial-kicker text-ink-faint">Total Value at Risk</div>
              <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-ink mt-2">
                {stats?.amount_at_risk ? formatMoney(stats.amount_at_risk) : "₹5.47 L"}
              </div>
              <div className="mono text-[10px] text-ink-faint mt-1">Across 12 Active Inquiries</div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="editorial-kicker emerald">Critical Cases</div>
              <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-shield-crimson mt-2">
                {stats?.high_risk_cases_count ?? 4}
              </div>
              <div className="mono text-[10px] text-shield-crimson mt-1">Imminent Cash-Out Window</div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="editorial-kicker text-ink-faint">NCRP Complaints</div>
              <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-ink mt-2">
                {stats?.total_complaints ?? 42}
              </div>
              <div className="mono text-[10px] text-ink-faint mt-1">Automated Cluster Ingestion</div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="editorial-kicker text-ink-faint">Monitored Hotspots</div>
              <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-shield-emerald mt-2">
                {stats?.active_hotspots_count ?? 26}
              </div>
              <div className="mono text-[10px] text-shield-emerald mt-1">Delhi-NCR ATMs &amp; CSPs</div>
            </div>
          </div>
        </div>
      </section>

      {error && <ErrorState message={error} retry={loadData} />}

      {/* SECTION 2: INTERACTIVE MONEY TRAIL SEQUENCER */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
          <div>
            <div className="editorial-kicker emerald">Forensic Sequence</div>
            <h2 className="headline-section mt-1 text-ink">
              The 5-Stage Investigative Pipeline
            </h2>
            <p className="text-xs text-ink-soft mt-1">
              Select any stage to inspect analytical velocity, dwell times, and algorithmic intervention points.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="mono text-[10px] text-ink-faint">STEP {activeStep + 1} OF 5</span>
          </div>
        </div>

        {/* Sequencer Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {flowSteps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={cx(
                  "p-5 text-left border transition-all duration-200 relative group flex flex-col justify-between h-40",
                  isActive
                    ? "border-shield-emerald bg-shield-emerald-light/60 shadow-sm"
                    : "border-line bg-paper-50 hover:bg-white hover:border-line-strong"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cx(
                        "mono text-xs font-bold",
                        isActive ? "text-shield-emerald" : "text-ink-faint"
                      )}
                    >
                      {step.num}
                    </span>
                    <span
                      className={cx(
                        "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border",
                        isActive
                          ? "border-shield-emerald/40 bg-shield-emerald-light text-shield-emerald-dark"
                          : "border-line bg-paper-100 text-ink-faint"
                      )}
                    >
                      {step.tag}
                    </span>
                  </div>
                  <div className="font-editorial text-sm font-bold text-ink mt-3">
                    {step.title}
                  </div>
                  <p className="text-[11px] text-ink-soft line-clamp-2 mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
                <div className="border-t border-line-faint pt-2 flex items-center justify-between text-[10px] mono">
                  <span className="text-ink-soft font-semibold">{step.stat}</span>
                  <span className="text-shield-emerald">{step.velocity}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Inspector */}
        <div className="card-editorial p-6 sm:p-7 border-l-4 border-l-shield-emerald bg-paper-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="mono text-xs font-bold text-shield-emerald">
                  STAGE {flowSteps[activeStep].num} ANALYSIS
                </span>
                <span className="text-line-strong">·</span>
                <span className="text-xs font-semibold text-ink">
                  {flowSteps[activeStep].title}
                </span>
              </div>
              <h3 className="headline-sub text-ink">
                {flowSteps[activeStep].focus}
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                UPIShield applies automated graph centrality and velocity metrics to identify
                suspicious clustering within minutes of first complaint ingress, bridging the latency gap before cash-out.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/cases/CASE-2026-4401"
                className="btn-editorial btn-editorial-primary text-xs h-11 px-5"
              >
                Inspect Primary Case <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/cashout"
                className="btn-editorial btn-editorial-quiet text-xs h-11 px-5"
              >
                Simulate Cash-Out <Zap size={14} className="text-shield-amber" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MAP & PRIORITY QUEUE GRID */}
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.55fr)_420px]">
        {/* Geospatial Surveillance Frame */}
        <Panel noPad className="overflow-hidden flex flex-col">
          <SectionHeader
            eyebrow="Spatial Hotspots"
            title="Delhi-NCR Financial Surveillance Grid"
            description="High-density withdrawal nodes mapped against historical cash-out frequency."
            action={
              <Link
                href="/cashout"
                className="mono text-xs font-bold text-shield-emerald hover:underline flex items-center gap-1"
              >
                Open Full Screen Radar <ArrowUpRight size={13} />
              </Link>
            }
          />
          <div className="relative flex-1 min-h-[460px] bg-paper-100">
            {loading ? (
              <Skeleton className="h-full w-full rounded-none" />
            ) : (
              <LeafletMap
                locations={stats?.hotspot_locations || []}
                height="460px"
              />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-paper-100 px-6 py-3.5 text-[10px] text-ink-faint mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-shield-crimson" />
                Critical Threat Hotspot
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-shield-emerald" />
                Active Surveillance
              </span>
            </div>
            <span>26 Monitored Terminals</span>
          </div>
        </Panel>

        {/* Priority Case Queue */}
        <Panel noPad className="overflow-hidden flex flex-col">
          <SectionHeader
            eyebrow="Analyst Triage"
            title="Priority Dockets"
            description="Ranked by multi-hop transaction risk."
            action={
              <span className="mono text-xs font-bold text-ink-faint bg-paper-100 px-2 py-0.5 border border-line">
                {priorityCases.length} Active
              </span>
            }
          />
          <div className="divide-y divide-line flex-1 overflow-y-auto max-h-[480px]">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5">
                  <Skeleton className="h-14 w-full" />
                </div>
              ))
            ) : priorityCases.length ? (
              priorityCases.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="block p-5 transition-colors hover:bg-paper-100 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs font-bold text-shield-emerald">
                      {c.id}
                    </span>
                    <StatusBadge
                      value={c.risk_evaluation?.decision || c.status}
                    />
                  </div>
                  <div className="font-editorial text-xs font-bold text-ink mt-2 group-hover:text-shield-emerald transition-colors line-clamp-1">
                    {c.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-ink-faint mt-2 mono">
                    <span>{formatMoney(c.total_amount_lost)}</span>
                    <span>{c.complaints?.length || 1} complaints</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-ink-faint">
                No active investigations currently indexed.
              </div>
            )}
          </div>
          <div className="border-t border-line p-3 bg-paper-50">
            <Link
              href="/cases/CASE-2026-4401"
              className="btn-editorial btn-editorial-quiet w-full justify-center text-xs h-10"
            >
              Open Lead Case Investigation <ArrowRight size={13} />
            </Link>
          </div>
        </Panel>
      </section>

      {/* SECTION 4: CONVERGED CITIZEN COMPLAINTS FEED */}
      <section className="space-y-4">
        <Panel noPad className="overflow-hidden">
          <SectionHeader
            eyebrow="Telemetry Ingestion"
            title="Converged Citizen Complaints"
            description="Live victim transaction logs flowing through the analytical pipeline."
          />
          <div className="table-editorial-wrap">
            <table className="table-editorial">
              <thead>
                <tr>
                  <th>Complaint Code</th>
                  <th>Victim</th>
                  <th>Category</th>
                  <th>City</th>
                  <th>Reported Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td colSpan={6}>
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : complaints.length ? (
                  complaints.slice(0, 7).map((comp) => (
                    <tr key={comp.id}>
                      <td className="mono font-bold text-shield-emerald">
                        {comp.id}
                      </td>
                      <td className="font-semibold text-ink">
                        {comp.victim_name}
                      </td>
                      <td className="text-ink-soft">{comp.fraud_category}</td>
                      <td className="mono text-ink-faint">{comp.city}</td>
                      <td className="mono font-bold text-ink">
                        ₹{comp.reported_amount.toLocaleString("en-IN")}
                      </td>
                      <td>
                        <StatusBadge value={comp.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-ink-faint">
                      No citizen complaint telemetry received.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </div>
  );
}
