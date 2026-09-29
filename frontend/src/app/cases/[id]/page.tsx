"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Clock,
  Compass,
  Cpu,
  CreditCard,
  FileCheck2,
  FileText,
  Landmark,
  Layers,
  MapPin,
  Network,
  Phone,
  Radio,
  RefreshCw,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  User,
  WalletCards,
  Zap,
} from "lucide-react";
import { fetchCaseById, fetchCaseNetwork, predictCashout } from "@/lib/api";
import {
  CaseDetail,
  CashoutPredictionResponse,
  EntityNetworkGraph,
} from "@/lib/types";
import {
  cx,
  ErrorState,
  Panel,
  SectionHeader,
  Skeleton,
  StatusBadge,
} from "@/components/ui";
import { RiskScoreGauge } from "@/components/RiskScoreGauge";
import { NetworkGraphVisualizer } from "@/components/NetworkGraphVisualizer";
import { AlertModal } from "@/components/AlertModal";

export default function CasePage() {
  const p = useParams();
  const router = useRouter();
  const id = (p.id as string) || "CASE-2026-4401";

  const [c, setC] = useState<CaseDetail | null>(null);
  const [g, setG] = useState<EntityNetworkGraph | null>(null);
  const [pred, setPred] = useState<CashoutPredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([fetchCaseById(id), fetchCaseNetwork(id)])
      .then(([a, b]) => {
        setC(a);
        setG(b);
        setError("");
      })
      .catch((e) =>
        setError(e.message || "Unable to load case forensic intelligence.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const runPrediction = async () => {
    setBusy(true);
    try {
      const r = await predictCashout(id);
      setPred(r);
      router.push(`/cashout?caseId=${encodeURIComponent(id)}`);
    } catch (e: any) {
      setError(e.message || "Cash-out prediction model failed.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  if (error || !c) {
    return <ErrorState message={error || "Investigation record not found."} retry={load} />;
  }

  return (
    <div className="space-y-12 pb-16">
      {/* SECTION 1: EDITORIAL CASE OPENING */}
      <section className="relative pt-2 pb-6 border-b border-line">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-faint hover:text-shield-emerald transition-colors"
            >
              <ArrowLeft size={14} />
              Return to Command Center
            </Link>
            <div className="flex items-center gap-2">
              <span className="mono text-xs font-bold text-shield-emerald bg-shield-emerald-light px-2.5 py-1 border border-shield-emerald/30">
                {c.id}
              </span>
              <StatusBadge value={c.risk_evaluation?.decision || c.status} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-4xl space-y-3">
              <div className="editorial-kicker emerald">Forensic Investigation Workspace</div>
              <h1 className="headline-display uppercase text-ink">
                Follow The Money.
              </h1>
              <div className="text-base sm:text-lg font-bold text-ink-muted">
                {c.title}
              </div>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-3xl">
                {c.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={runPrediction}
                disabled={busy}
                className="btn-editorial btn-editorial-primary h-12 px-6 text-xs font-bold tracking-wider"
              >
                <Cpu size={15} className={busy ? "animate-spin" : ""} />
                {busy ? "Running Model..." : "Predict Cash-Out Location"}
              </button>
              <button
                onClick={() => setModal(true)}
                className="btn-editorial btn-editorial-danger h-12 px-5 text-xs font-bold tracking-wider"
              >
                <ShieldAlert size={15} />
                Dispatch Multi-Agency Alert
              </button>
            </div>
          </div>

          {/* INTEGRATED METRICS STRIP (Composition rather than 4 isolated cards) */}
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 border border-line bg-paper-50 divide-x divide-y lg:divide-y-0 divide-line shadow-subtle">
            <div className="p-6">
              <div className="editorial-kicker text-ink-faint">Amount Exposed</div>
              <div className="mt-2 font-editorial text-2xl sm:text-3xl font-extrabold text-ink">
                ₹{c.total_amount_lost.toLocaleString("en-IN")}
              </div>
              <div className="mt-1 text-[11px] text-ink-soft">
                Aggregated fraud loss across victims
              </div>
            </div>

            <div className="p-6">
              <div className="editorial-kicker crimson">Primary Mule Nexus</div>
              <div className="mt-2 mono text-sm sm:text-base font-bold text-shield-crimson truncate">
                {c.primary_mule_upi || c.primary_mule_account || "—"}
              </div>
              <div className="mt-1 text-[11px] text-ink-soft">
                Central consolidation beneficiary
              </div>
            </div>

            <div className="p-6">
              <div className="editorial-kicker text-ink-faint">Converged Complaints</div>
              <div className="mt-2 font-editorial text-2xl sm:text-3xl font-extrabold text-ink">
                {String(c.complaints.length).padStart(2, "0")} Records
              </div>
              <div className="mt-1 text-[11px] text-ink-soft">
                Independently reported citizen debits
              </div>
            </div>

            <div className="p-6">
              <div className="editorial-kicker text-ink-faint">Investigation Docket</div>
              <div className="mt-2 mono text-sm font-semibold text-ink">
                {c.created_at}
              </div>
              <div className="mt-1 text-[11px] text-ink-soft">
                Modus: {c.category}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SYNTHESIZED RISK SCORE HERO */}
      <section className="space-y-4">
        <RiskScoreGauge
          evaluation={c.risk_evaluation}
          networkDepth={g?.total_layers || 3}
        />
      </section>

      {/* SECTION 3: NETWORK GRAPH WORKSPACE */}
      <section className="space-y-4">
        <NetworkGraphVisualizer graphData={g || undefined} />
      </section>

      {/* SECTION 4: THE COMPLAINTS CONVERGE (Structured Evidence Dossier) */}
      <section className="space-y-6">
        <Panel noPad className="overflow-hidden">
          <SectionHeader
            eyebrow="Corroborating Evidence"
            title="The Complaints Converge"
            description="Timeline of distinct citizen fraud reports whose funds routed into this specific mule syndicate."
            action={
              <span className="mono text-xs font-bold text-ink-faint bg-paper-100 px-3 py-1 border border-line">
                {c.complaints.length} Converged Dossiers
              </span>
            }
          />

          <div className="divide-y divide-line">
            {c.complaints.map((comp, idx) => (
              <div
                key={comp.id}
                className="p-6 sm:p-7 hover:bg-paper-100/70 transition-colors bg-paper-50"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Victim identity & transaction sum */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="mono text-xs font-bold text-shield-emerald">
                        0{idx + 1}
                      </span>
                      <span className="mono text-xs font-semibold text-ink-soft">
                        {comp.id}
                      </span>
                      <StatusBadge value={comp.status} />
                    </div>

                    <div className="text-base font-extrabold text-ink">
                      {comp.victim_name}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} className="text-ink-faint" />
                        <span className="mono">{comp.victim_phone}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CreditCard size={13} className="text-ink-faint" />
                        <span className="mono">{comp.victim_upi}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Landmark size={13} className="text-ink-faint" />
                        <span>{comp.victim_bank}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Modus and Financial Loss */}
                  <div className="lg:text-right space-y-1.5">
                    <div className="editorial-kicker text-ink-faint">Reported Stolen Sum</div>
                    <div className="font-editorial text-2xl font-black text-shield-crimson">
                      ₹{comp.reported_amount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-ink-soft">
                      {comp.fraud_category} · {comp.city}
                    </div>
                    <div className="mono text-[10px] text-ink-faint">
                      Reported: {comp.reported_time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      {/* SECTION 5: TACTICAL NEXT STEP TRANSITION BANNER */}
      <section className="card-editorial p-8 sm:p-10 bg-paper-100 flex flex-col md:flex-row md:items-center justify-between gap-6 border-line">
        <div className="space-y-2 max-w-2xl">
          <div className="editorial-kicker emerald">Tactical Pipeline Progression</div>
          <h3 className="headline-section text-ink uppercase">
            From Forensics To Predictive Exit
          </h3>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            The mule syndicate topology is mapped. Launch the cash-out surveillance
            engine to rank the most probable physical ATM and CSP withdrawal locations
            within the operational radius.
          </p>
        </div>

        <button
          onClick={runPrediction}
          disabled={busy}
          className="btn-editorial btn-editorial-primary h-13 px-8 text-xs font-bold tracking-wider shrink-0"
        >
          <Cpu size={15} className={busy ? "animate-spin" : ""} />
          {busy ? "Evaluating Locations..." : "Open Cash-Out Surveillance"}
          <ArrowRight size={15} />
        </button>
      </section>

      {/* MULTI-AGENCY ALERT DISPATCH MODAL */}
      <AlertModal
        isOpen={modal}
        onClose={() => setModal(false)}
        caseId={c.id}
        predictions={pred?.predicted_locations || []}
        onAlertCreated={() => {}}
      />
    </div>
  );
}

