"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Clock3,
  Compass,
  Crosshair,
  Footprints,
  Info,
  Layers,
  MapPin,
  MapPinned,
  Radio,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Target,
  Video,
  Zap,
} from "lucide-react";
import { fetchCases, predictCashout } from "@/lib/api";
import {
  CaseDetail,
  CashoutPredictionItem,
  CashoutPredictionResponse,
} from "@/lib/types";
import {
  cx,
  ErrorState,
  Panel,
  SectionHeader,
  Skeleton,
  StatusBadge,
} from "@/components/ui";
import { LeafletMap } from "@/components/LeafletMap";
import { AlertModal } from "@/components/AlertModal";
import { HeroVisual } from "@/components/HeroVisual";

function CashoutContent() {
  const sp = useSearchParams();
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [caseId, setCaseId] = useState(sp.get("caseId") || "");
  const [data, setData] = useState<CashoutPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [boot, setBoot] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCases()
      .then((r) => {
        setCases(r);
        if (!caseId && r[0]) setCaseId(r[0].id);
      })
      .catch((e) =>
        setError(e.message || "Unable to load active investigations.")
      )
      .finally(() => setBoot(false));
  }, []);

  const run = async (id = caseId) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const r = await predictCashout(id);
      setData(r);
      setSelectedId(r.predicted_locations[0]?.location_id || "");
    } catch (e: any) {
      setError(e.message || "Predictive cash-out model execution failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId && !boot) run(caseId);
  }, [caseId, boot]);

  const topPrediction = data?.predicted_locations?.[0];
  const activeLocation = data?.predicted_locations?.find(
    (p) => p.location_id === selectedId
  ) || topPrediction;

  const currentCase = cases.find((c) => c.id === caseId);
  const formattedAmount = currentCase?.total_amount_lost
    ? `₹${(currentCase.total_amount_lost / 100000).toFixed(2)} L`
    : "₹5.47 L";

  return (
    <div className="space-y-12 pb-16">
      {/* SECTION 1: EDITORIAL HEADER WITH 3D MASCOT ANIMATION */}
      <section className="relative pt-2 pb-8 border-b border-line">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link
              href="/app"
              className="text-xs font-bold uppercase tracking-wider text-ink-faint hover:text-shield-emerald transition-colors"
            >
              ← Return to Command Center
            </Link>
            <span className="mono text-xs font-bold text-shield-emerald bg-shield-emerald-light px-2.5 py-1 border border-shield-emerald/30">
              GRADIENT TREE SURVEILLANCE
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_380px] xl:grid-cols-[minmax(0,1.4fr)_420px] items-center">
            <div className="space-y-5">
              <div className="editorial-kicker emerald">
                Physical Cash-Out Interception Console
              </div>
              <h1 className="headline-display uppercase text-ink">
                Where Does The Money Go Next?
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-2xl">
                Rank likely withdrawal endpoints by correlating multi-hop UPI velocity,
                mule device spatial proximity, and historical withdrawal frequency across
                bank ATM and Customer Service Point (CSP) networks.
              </p>

              {/* Investigation Selector & Model Execution CTA */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <select
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="h-12 min-w-[280px] border border-line bg-paper-50 px-3.5 text-xs text-ink font-semibold outline-none focus:border-ink-soft shadow-subtle"
                >
                  <option value="">Select Investigation Docket</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} · {c.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => run()}
                  disabled={!caseId || loading}
                  className="btn-editorial btn-editorial-primary h-12 px-6 text-xs font-bold tracking-wider"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  {loading ? "Computing Spatial Risk..." : "Run Prediction"}
                </button>
              </div>
            </div>

            {/* Embedded 3D Mascot Telemetry Visual */}
            <div className="flex items-center justify-center p-2 border border-line bg-paper-100/60 shadow-subtle">
              <HeroVisual
                amountAtRisk={formattedAmount}
                hotspotsCount={data?.predicted_locations?.length || 4}
                className="max-w-[340px] sm:max-w-[380px]"
              />
            </div>
          </div>
        </div>
      </section>

      {error && <ErrorState message={error} retry={() => run()} />}

      {loading && !data ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_440px]">
          <Skeleton className="h-[580px] w-full" />
          <Skeleton className="h-[580px] w-full" />
        </div>
      ) : data ? (
        <>
          {/* SECTION 2: HIGH-IMPACT PREDICTIVE TELEMETRY STRIP */}
          <section className="grid grid-cols-2 lg:grid-cols-4 border border-line bg-paper-50 divide-x divide-y lg:divide-y-0 divide-line shadow-subtle">
            <div className="p-6">
              <div className="editorial-kicker emerald">Top Candidate Confidence</div>
              <div className="mt-2 font-editorial text-3xl sm:text-4xl font-black text-shield-emerald">
                {((topPrediction?.probability_score || 0) * 100).toFixed(1)}%
              </div>
              <div className="mt-1 text-[11px] text-ink-soft truncate font-semibold">
                {topPrediction?.name || "—"}
              </div>
            </div>

            <div className="p-6">
              <div className="editorial-kicker crimson">Estimated Target Capital</div>
              <div className="mt-2 font-editorial text-3xl sm:text-4xl font-black text-shield-crimson">
                ₹{data.target_amount.toLocaleString("en-IN")}
              </div>
              <div className="mt-1 text-[11px] text-ink-soft">
                Predicted exit sum for this cycle
              </div>
            </div>

            <div className="p-6">
              <div className="editorial-kicker amber">Interception Window</div>
              <div className="mt-2 font-editorial text-2xl sm:text-3xl font-extrabold text-shield-amber">
                {topPrediction?.estimated_time_window || "—"}
              </div>
              <div className="mt-1 text-[11px] text-ink-soft">
                Expected withdrawal timeframe
              </div>
            </div>

            <div className="p-6">
              <div className="editorial-kicker text-ink-faint">Spatial Algorithm</div>
              <div className="mt-2 text-sm sm:text-base font-bold text-ink">
                Gradient-Boosted Tree
              </div>
              <div className="mt-1 mono text-[10px] text-ink-faint">
                {data.model_version.replace("SIH-ML-Cashout-", "")}
              </div>
            </div>
          </section>

          {/* SECTION 3: HERO MAP CANVAS & RANKED CANDIDATES CONSOLE */}
          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.55fr)_440px]">
            {/* Generous Map Workspace */}
            <Panel noPad className="overflow-hidden flex flex-col">
              <SectionHeader
                eyebrow="Tactical Surveillance Grid"
                title="Predicted Cash-Out Terminals"
                description="Spatial risk surface across Delhi-NCR. Select a candidate on the console to smoothly re-center the map."
                action={
                  <span className="mono text-xs font-bold text-ink-faint bg-paper-100 px-3 py-1 border border-line">
                    {data.predicted_locations.length} Ranked Terminals
                  </span>
                }
              />
              <div className="relative flex-1 bg-paper-200">
                <LeafletMap
                  predictions={data.predicted_locations}
                  selectedLocationId={selectedId}
                  onSelectLocation={setSelectedId}
                  height="560px"
                />
              </div>

              {/* Active Location Detail Bar */}
              {activeLocation && (
                <div className="border-t border-line bg-paper-50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="mono text-xs font-bold text-shield-emerald">
                        SELECTED #{activeLocation.rank}
                      </span>
                      <StatusBadge value={activeLocation.risk_level} />
                    </div>
                    <div className="text-sm font-extrabold text-ink">
                      {activeLocation.name}
                    </div>
                    <div className="text-xs text-ink-soft">
                      {activeLocation.type} · {activeLocation.bank}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="btn-editorial btn-editorial-danger text-xs h-10 px-4"
                    >
                      <ShieldAlert size={14} />
                      Dispatch Alert for this Node
                    </button>
                  </div>
                </div>
              )}
            </Panel>

            {/* Ranked Candidates Console List */}
            <Panel noPad className="overflow-hidden flex flex-col">
              <SectionHeader
                eyebrow="Probability Ranking"
                title="Interception Queue"
                description="Ranked candidate endpoints sorted by calculated exit probability."
              />
              <div className="divide-y divide-line flex-1 overflow-y-auto max-h-[660px]">
                {data.predicted_locations.map((p) => {
                  const isSelected = selectedId === p.location_id;
                  const isCritical =
                    p.risk_level === "CRITICAL" || p.probability_score >= 0.85;

                  return (
                    <button
                      key={p.location_id}
                      onClick={() => setSelectedId(p.location_id)}
                      className={cx(
                        "w-full p-5 text-left transition-all duration-150 relative group",
                        isSelected
                          ? "bg-shield-emerald-light/60 border-l-4 border-shield-emerald"
                          : "hover:bg-paper-100 bg-paper-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cx(
                            "flex h-9 w-9 shrink-0 items-center justify-center font-editorial text-sm font-black border",
                            isSelected
                              ? "bg-shield-emerald text-white border-shield-emerald"
                              : isCritical
                              ? "border-red-300 bg-shield-crimson-light text-shield-crimson"
                              : "border-amber-300 bg-shield-amber-light text-shield-amber"
                          )}
                        >
                          {String(p.rank).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-extrabold text-ink group-hover:text-shield-emerald transition-colors">
                              {p.name}
                            </span>
                            <span className="mono text-xs font-bold text-ink">
                              {(p.probability_score * 100).toFixed(1)}%
                            </span>
                          </div>

                          <div className="mt-1 text-[11px] text-ink-soft">
                            {p.type} · {p.bank}
                          </div>

                          <div className="mt-3 flex items-center justify-between text-[10px] text-ink-faint mono border-t border-line-faint pt-2">
                            <span>{p.distance_km.toFixed(1)} km transit</span>
                            <span>{p.estimated_time_window}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Panel>
          </section>

          {/* SECTION 4: PREDICTION REASONING ("WHY THIS LOCATION?") */}
          <section className="space-y-6">
            <Panel noPad className="overflow-hidden">
              <SectionHeader
                eyebrow="Model Explainability"
                title="Why This Location?"
                description="Objective mathematical and spatial evidence returned by the gradient-boosted prediction model."
              />

              <div className="p-7 sm:p-8 bg-paper-50 space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="border border-line bg-paper-100 p-5 space-y-2">
                    <div className="editorial-kicker text-ink-faint flex items-center gap-1.5">
                      <Zap size={13} className="text-shield-amber" />
                      Transaction Velocity
                    </div>
                    <div className="text-xs font-bold text-ink leading-relaxed">
                      Rapid pass-through bursts under 120 seconds between Layer 1 mule and terminal runner account.
                    </div>
                  </div>

                  <div className="border border-line bg-paper-100 p-5 space-y-2">
                    <div className="editorial-kicker text-ink-faint flex items-center gap-1.5">
                      <MapPin size={13} className="text-shield-emerald" />
                      Spatial Proximity
                    </div>
                    <div className="text-xs font-bold text-ink leading-relaxed">
                      Located within {activeLocation?.distance_km.toFixed(1) || "1.2"} km of last authenticated mule device GPS / IP cell tower radius.
                    </div>
                  </div>

                  <div className="border border-line bg-paper-100 p-5 space-y-2">
                    <div className="editorial-kicker text-ink-faint flex items-center gap-1.5">
                      <Target size={13} className="text-shield-crimson" />
                      Historical Fraud Density
                    </div>
                    <div className="text-xs font-bold text-ink leading-relaxed">
                      Elevated repeat cash-out frequency: Identified terminal has recorded prior cybercrime withdrawals.
                    </div>
                  </div>

                  <div className="border border-line bg-paper-100 p-5 space-y-2">
                    <div className="editorial-kicker text-ink-faint flex items-center gap-1.5">
                      <Video size={13} className="text-shield-slate" />
                      Surveillance Status
                    </div>
                    <div className="text-xs font-bold text-ink leading-relaxed">
                      Active CCTV recording available at kiosk; optimal lighting and facial capture telemetry.
                    </div>
                  </div>
                </div>

                {/* Granular Model Factor List */}
                <div className="border-t border-line pt-6 space-y-3">
                  <div className="editorial-kicker text-ink-faint">
                    Itemized Predictive Contributing Factors
                  </div>
                  <div className="space-y-2">
                    {(activeLocation?.reason_factors || []).map((factor, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 border border-line bg-paper-100 p-3.5"
                      >
                        <span className="mono text-xs font-bold text-shield-emerald mt-0.5">
                          0{idx + 1}
                        </span>
                        <span className="text-xs text-ink leading-relaxed">
                          {factor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </section>

          {/* SECTION 5: OPERATIONAL ACTIONS ("FROM PREDICTION TO ACTION") */}
          <section className="space-y-6">
            <Panel noPad className="overflow-hidden">
              <SectionHeader
                eyebrow="Tactical Interdiction"
                title="From Prediction To Action"
                description="Translating predictive intelligence into multi-agency tactical enforcement."
              />

              <div className="p-7 sm:p-8 bg-paper-50 space-y-6">
                {/* Data -> Analysis -> Decision -> Action Stage Line */}
                <div className="grid grid-cols-2 md:grid-cols-4 border border-line bg-paper-100 divide-x divide-y md:divide-y-0 divide-line text-center">
                  <div className="p-4">
                    <div className="editorial-kicker text-ink-faint">Stage 01</div>
                    <div className="mt-1 font-editorial text-sm font-bold text-ink">
                      Data Ingestion
                    </div>
                    <div className="mt-1 text-[10px] text-ink-soft">
                      NCRP Complaint Stream
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="editorial-kicker text-ink-faint">Stage 02</div>
                    <div className="mt-1 font-editorial text-sm font-bold text-ink">
                      Analysis & Topology
                    </div>
                    <div className="mt-1 text-[10px] text-ink-soft">
                      Multi-Hop Mule Graph
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="editorial-kicker text-ink-faint">Stage 03</div>
                    <div className="mt-1 font-editorial text-sm font-bold text-shield-amber">
                      Spatial Decision
                    </div>
                    <div className="mt-1 text-[10px] text-ink-soft">
                      ATM/CSP Probability Rank
                    </div>
                  </div>
                  <div className="p-4 bg-shield-emerald-light">
                    <div className="editorial-kicker emerald">Stage 04</div>
                    <div className="mt-1 font-editorial text-sm font-bold text-shield-emerald-dark">
                      Tactical Action
                    </div>
                    <div className="mt-1 text-[10px] text-shield-emerald-dark font-semibold">
                      Interdiction Alert
                    </div>
                  </div>
                </div>

                {/* Recommended Operational Actions */}
                <div className="space-y-3">
                  <div className="editorial-kicker text-ink-faint">
                    Recommended Enforcement Protocols
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {data.recommended_actions.map((act, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col justify-between border border-line bg-paper-100 p-5 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-shield-emerald-light border border-shield-emerald/40 text-shield-emerald">
                            <CheckCircle2 size={13} />
                          </div>
                          <div className="text-xs text-ink font-semibold leading-relaxed">
                            {act}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispatch Trigger Bar */}
                <div className="border-t border-line pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[11px] text-ink-faint mono max-w-xl">
                    {data.methodology_note}
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="btn-editorial btn-editorial-danger h-12 px-7 text-xs font-bold tracking-wider shrink-0"
                  >
                    <ShieldAlert size={15} />
                    Dispatch Multi-Agency Alert
                  </button>
                </div>
              </div>
            </Panel>
          </section>

          {/* MULTI-AGENCY ALERT MODAL */}
          <AlertModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            caseId={caseId}
            predictions={data.predicted_locations}
            onAlertCreated={() => {}}
          />
        </>
      ) : (
        <Panel>
          <div className="p-16 text-center space-y-3">
            <Compass size={32} className="mx-auto text-ink-faint" />
            <h3 className="headline-sub text-ink">Select an Investigation Docket</h3>
            <p className="max-w-md mx-auto text-xs text-ink-soft">
              Choose an active investigation above to launch the cash-out prediction engine
              and populate the surveillance workspace.
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}

export default function CashoutPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-[560px] w-full" />
        </div>
      }
    >
      <CashoutContent />
    </Suspense>
  );
}

