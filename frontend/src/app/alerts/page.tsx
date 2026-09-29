"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Clock3,
  ExternalLink,
  FileCheck,
  FileText,
  Landmark,
  MapPin,
  Radio,
  RefreshCw,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Terminal,
} from "lucide-react";
import { fetchAlerts } from "@/lib/api";
import { AlertResponse } from "@/lib/types";
import {
  cx,
  ErrorState,
  Panel,
  SectionHeader,
  Skeleton,
  StatusBadge,
} from "@/components/ui";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<AlertResponse | null>(null);

  const load = () => {
    setLoading(true);
    fetchAlerts()
      .then((r) => {
        setAlerts(r);
        if (r[0]) setSelected((s) => s || r[0]);
      })
      .catch((e) =>
        setError(e.message || "Unable to load intelligence dispatch feed.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") return alerts;
    const f = filter.toUpperCase();
    return alerts.filter((x) => {
      const p = (x.priority || "").toUpperCase();
      const s = (x.status || "").toUpperCase();
      if (f === "CRITICAL") return p === "CRITICAL";
      if (f === "HIGH") return p === "HIGH";
      if (f === "MODERATE" || f === "MEDIUM") return p === "MODERATE" || p === "MEDIUM";
      if (f === "DISPATCHED") return s === "DISPATCHED";
      if (f === "ACKNOWLEDGED") return s === "ACKNOWLEDGED";
      if (f === "RESOLVED") return s === "RESOLVED";
      return p === f || s === f;
    });
  }, [alerts, filter]);

  // Keep selected record in sync with filtered list
  useEffect(() => {
    if (filtered.length > 0) {
      if (!selected || !filtered.some((x) => x.id === selected.id)) {
        setSelected(filtered[0]);
      }
    } else {
      setSelected(null);
    }
  }, [filtered]);

  return (
    <div className="space-y-12 pb-16">
      {/* SECTION 1: EDITORIAL HEADER */}
      <section className="relative pt-2 pb-6 border-b border-line">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link
              href="/app"
              className="text-xs font-bold uppercase tracking-wider text-ink-faint hover:text-shield-emerald transition-colors"
            >
              ← Return to Command Center
            </Link>
            <span className="mono text-xs font-bold text-shield-emerald bg-shield-emerald-light px-2.5 py-1 border border-shield-emerald/30">
              TACTICAL INTERCEPTION NETWORK
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-4xl space-y-3">
              <div className="editorial-kicker crimson">
                Multi-Agency Tactical Command
              </div>
              <h1 className="headline-display uppercase text-ink">
                Intelligence Ready For Dispatch.
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-3xl">
                Standardized multi-agency dispatch records transmitted to state Police Cyber
                Cells, bank fraud nodal officers, and the Indian Cyber Crime Coordination
                Centre (I4C) for rapid debit-freezes and physical ATM beat interdiction.
              </p>
            </div>

            <button
              onClick={load}
              className="btn-editorial h-12 px-5 text-xs font-bold tracking-wider shrink-0"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh Dispatch Stream
            </button>
          </div>
        </div>
      </section>

      {error && <ErrorState message={error} retry={load} />}

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
        {[
          "ALL",
          "CRITICAL",
          "HIGH",
          "MODERATE",
          "DISPATCHED",
          "ACKNOWLEDGED",
          "RESOLVED",
        ].map((f) => {
          const isSelected = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cx(
                "px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors",
                isSelected
                  ? "border-shield-emerald bg-shield-emerald-light text-shield-emerald-dark"
                  : "border-line bg-paper-50 text-ink-soft hover:bg-white hover:border-line-strong"
              )}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* SECTION 2: DISPATCH QUEUE & OFFICIAL RECORD VIEW */}
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_480px]">
        {/* Generated Alerts Queue */}
        <Panel noPad className="overflow-hidden flex flex-col">
          <SectionHeader
            eyebrow="Active Dispatch Stream"
            title="Generated Intelligence Alerts"
            description="Live tactical records derived from forensic case investigations."
            action={
              <span className="mono text-xs font-bold text-ink-faint bg-paper-100 px-3 py-1 border border-line">
                {filtered.length} Events
              </span>
            }
          />

          <div className="divide-y divide-line flex-1 overflow-y-auto">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6">
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : filtered.length ? (
              filtered.map((item) => {
                const isSelected = selected?.id === item.id;
                const isCritical = item.priority === "CRITICAL";

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={cx(
                      "w-full p-6 text-left transition-all duration-150 relative group",
                      isSelected
                        ? "bg-shield-emerald-light/60 border-l-4 border-shield-emerald"
                        : "hover:bg-paper-100 bg-paper-50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cx(
                          "flex h-10 w-10 shrink-0 items-center justify-center border",
                          isCritical
                            ? "border-red-300 bg-shield-crimson-light text-shield-crimson"
                            : "border-amber-300 bg-shield-amber-light text-shield-amber"
                        )}
                      >
                        <ShieldAlert size={18} />
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="mono text-xs font-bold text-shield-emerald">
                              {item.id}
                            </span>
                            <span className="mono text-[10px] text-ink-faint">
                              {item.case_id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <StatusBadge value={item.priority} />
                            <StatusBadge value={item.status} />
                          </div>
                        </div>

                        <div className="text-xs font-bold text-ink line-clamp-2 leading-relaxed">
                          {item.summary}
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-[10px] text-ink-faint mono border-t border-line-faint pt-2">
                          <span>{item.target_agencies.length} Stakeholder Agencies</span>
                          <span>{item.predicted_locations.length} Exit Targets</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-12 text-center bg-paper-50 flex flex-col items-center justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center border border-line bg-paper-100 text-ink-faint shadow-subtle">
                  <ShieldAlert size={22} className="text-shield-amber" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-ink uppercase tracking-wider">
                    No Alerts In Queue for &quot;{filter}&quot;
                  </div>
                  <p className="text-[11px] text-ink-soft max-w-xs leading-relaxed">
                    No active tactical records currently match this filter criteria. Telemetry remains operational across all other priorities.
                  </p>
                </div>
                <button
                  onClick={() => setFilter("ALL")}
                  className="btn-editorial btn-editorial-quiet h-9 px-4 text-[10px] font-bold tracking-wider"
                >
                  Reset Filter to All Alerts
                </button>
              </div>
            )}
          </div>
        </Panel>

        {/* Selected Alert Official Intelligence Record */}
        <Panel noPad className="overflow-hidden flex flex-col">
          {selected ? (
            <AlertDetailRecord alert={selected} />
          ) : (
            <div className="p-12 text-center bg-paper-50 flex flex-col items-center justify-center space-y-3 h-full min-h-[360px]">
              <div className="flex h-10 w-10 items-center justify-center border border-line bg-paper-100 text-ink-faint">
                <Radio size={18} />
              </div>
              <div className="text-xs font-semibold text-ink-soft">
                Select an alert from the queue to inspect official dispatch telemetry.
              </div>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}

function AlertDetailRecord({ alert: a }: { alert: AlertResponse }) {
  const isCritical = a.priority === "CRITICAL";

  return (
    <div className="flex flex-col h-full bg-paper-50">
      {/* Official Header */}
      <div className="border-b border-line bg-paper-100 p-6 sm:p-7 space-y-2">
        <div className="flex items-center justify-between">
          <div className="editorial-kicker text-ink-faint">
            Official Intelligence Record
          </div>
          <StatusBadge value={a.status} />
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-editorial text-xl font-black text-ink">
            {a.id}
          </h3>
          <span className="mono text-xs font-bold text-shield-crimson">
            {a.action_code}
          </span>
        </div>
        <div className="mono text-[10px] text-ink-faint">
          Case Reference: {a.case_id} · Dispatched: {a.dispatched_at}
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-6 flex-1 overflow-y-auto">
        {/* Executive Summary Card */}
        <div className="border border-line bg-paper-100 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="editorial-kicker text-ink-faint">
              Tactical Summary
            </span>
            <StatusBadge value={a.priority} />
          </div>
          <p className="text-xs leading-relaxed text-ink font-medium">
            {a.summary}
          </p>
        </div>

        {/* Tactical Parameters Table */}
        <div className="grid grid-cols-2 gap-4 border border-line bg-paper-100 p-4 text-xs">
          <div>
            <div className="editorial-kicker text-ink-faint">Action Code</div>
            <div className="mono text-xs font-bold text-ink mt-0.5">
              {a.action_code}
            </div>
          </div>
          <div>
            <div className="editorial-kicker text-ink-faint">Priority Level</div>
            <div className="mono text-xs font-bold text-shield-crimson mt-0.5">
              {a.priority}
            </div>
          </div>
          <div>
            <div className="editorial-kicker text-ink-faint">Associated Docket</div>
            <div className="mono text-xs font-semibold text-ink mt-0.5">
              {a.case_id}
            </div>
          </div>
          <div>
            <div className="editorial-kicker text-ink-faint">Surveillance Targets</div>
            <div className="mono text-xs font-semibold text-ink mt-0.5">
              {a.predicted_locations.length} Locations Attached
            </div>
          </div>
        </div>

        {/* Recipient Stakeholder Agencies */}
        <div className="space-y-3">
          <div className="editorial-kicker text-ink-faint">
            Addressed Stakeholder Agencies ({a.target_agencies.length})
          </div>
          <div className="space-y-2">
            {a.target_agencies.map((agency) => (
              <div
                key={agency}
                className="flex items-center justify-between border border-line bg-paper-100 p-3.5"
              >
                <div className="text-xs font-bold text-ink">
                  {agency === "LEA_POLICE_CYBERCELL"
                    ? "State Police Cyber Crime Cell"
                    : agency === "BANK_FRAUD_NODAL"
                    ? "Bank Fraud Nodal Coordination Team"
                    : agency === "I4C_REGISTRY"
                    ? "Indian Cyber Crime Coordination Centre (I4C)"
                    : agency}
                </div>
                <span className="mono text-[9px] font-bold uppercase text-shield-emerald flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-shield-emerald" />
                  Dispatched
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attached Predicted Withdrawal Targets */}
        {a.predicted_locations.length > 0 && (
          <div className="space-y-3">
            <div className="editorial-kicker text-ink-faint">
              Attached Physical Interception Nodes
            </div>
            <div className="space-y-2">
              {a.predicted_locations.map((loc: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-line bg-paper-100 p-3.5"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-ink truncate">
                      {loc.name || loc.location_id || `Location #${idx + 1}`}
                    </div>
                    <div className="mono text-[10px] text-ink-faint">
                      {loc.type || "ATM/CSP"} · {loc.bank || "Nodal Node"}
                    </div>
                  </div>
                  {loc.probability_score && (
                    <span className="mono text-xs font-bold text-shield-emerald shrink-0 ml-2">
                      {(loc.probability_score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t border-line bg-paper-100 p-6 flex items-center gap-3">
        <Link
          href={`/cases/${a.case_id}`}
          className="btn-editorial btn-editorial-primary flex-1 justify-center text-xs h-11"
        >
          Open Investigation Docket <ExternalLink size={13} />
        </Link>
        <button
          onClick={() => {
            const dataStr =
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(a, null, 2));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `${a.id}-record.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="btn-editorial text-xs h-11 px-4"
          title="Export JSON Telemetry Record"
        >
          <Send size={13} />
          Export JSON
        </button>
      </div>
    </div>
  );
}

