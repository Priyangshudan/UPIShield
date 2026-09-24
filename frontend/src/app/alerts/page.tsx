"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAlerts } from "@/lib/api";
import { AlertResponse } from "@/lib/types";
import {
  Bell,
  ShieldAlert,
  Radio,
  Send,
  CheckCircle,
  Building2,
  Clock,
  MapPin,
  Filter,
  ArrowUpRight
} from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [filterAgency, setFilterAgency] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (err: any) {
      console.error("Failed to load alerts:", err);
      setError(err.message || "Failed to load alerts feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filterPriority !== "ALL" && a.priority !== filterPriority) return false;
    if (filterAgency !== "ALL") {
      const matchAgency = a.target_agencies.some((ag) => ag.includes(filterAgency));
      if (!matchAgency) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 mr-1 animate-pulse text-red-400" />
              Live Multi-Agency Broadcast Feed
            </span>
            <span className="text-xs text-slate-500 font-mono">LEA / Banks / I4C Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Actionable Intelligence & Rapid Interception Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time alert dispatch registry enabling synchronized action between Police Cyber Cells, Bank Fraud Nodal Officers, and the I4C central repository.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/cases/CASE-2026-4401"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <span>Investigation Desk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Filter Agency:
          </span>
          {[
            { id: "ALL", label: "All Agencies" },
            { id: "LEA", label: "Police Cyber Cell (LEA)" },
            { id: "BANK", label: "Bank Fraud Nodal" },
            { id: "I4C", label: "I4C Registry" },
          ].map((ag) => (
            <button
              key={ag.id}
              onClick={() => setFilterAgency(ag.id)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                filterAgency === ag.id
                  ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {ag.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono mr-1">Priority:</span>
          {["ALL", "CRITICAL", "HIGH", "MODERATE"].map((pr) => (
            <button
              key={pr}
              onClick={() => setFilterPriority(pr)}
              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-all ${
                filterPriority === pr
                  ? "bg-slate-800 border-slate-600 text-slate-200 font-bold"
                  : "bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              {pr}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
            No alerts found matching the current filters.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.priority === "CRITICAL";

            return (
              <div
                key={alert.id}
                className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold uppercase ${
                        isCritical
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {alert.priority}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-semibold">{alert.id}</span>
                    <span className="text-slate-600">•</span>
                    <Link
                      href={`/cases/${alert.case_id}`}
                      className="text-xs font-bold text-slate-200 hover:text-emerald-400 underline font-mono"
                    >
                      {alert.case_id}
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{alert.dispatched_at}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold">
                      {alert.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100">{alert.case_title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.summary}</p>
                </div>

                {/* Target Agencies & Action Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase block">Designated Stakeholders:</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {alert.target_agencies.map((ag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]"
                        >
                          {ag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase block">Tactical Action Code:</span>
                    <div className="text-emerald-400 font-bold text-[11px] truncate">
                      {alert.action_code}
                    </div>
                  </div>
                </div>

                {/* Attached Predicted ATM Pins */}
                {alert.predicted_locations && alert.predicted_locations.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      Attached Interception Geofence Targets ({alert.predicted_locations.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {alert.predicted_locations.map((loc: any, idx: number) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                          <span className="font-semibold">{loc.name || loc.location_id || "ATM Target"}</span>
                          {loc.bank && <span className="text-slate-500 font-mono">({loc.bank})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

