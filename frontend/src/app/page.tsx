"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LeafletMap } from "@/components/LeafletMap";
import { fetchDashboardStats, fetchCases } from "@/lib/api";
import { DashboardStats, CaseDetail } from "@/lib/types";
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  IndianRupee,
  Layers,
  ArrowUpRight,
  MapPin,
  Clock,
  CheckCircle,
  Activity,
  FileText
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashData, casesData] = await Promise.all([
          fetchDashboardStats(),
          fetchCases(),
        ]);
        setStats(dashData);
        setCases(casesData);
      } catch (err: any) {
        console.error("Dashboard load failed:", err);
        setError(err.message || "Failed to connect to UPIShield API server.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Live Operational Command
            </span>
            <span className="text-xs text-slate-500 font-mono">SIH26184 Cybercrime Framework</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Proactive Financial Cybercrime & Cash-Out Defense
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Real-time NCRP complaint aggregation, dual-layer UPIShield behavioral risk scoring,
            multi-hop mule network graph resolution, and predictive ATM/CSP location interception.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/cases/CASE-2026-4401"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Launch Demo Case #4401</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs flex items-center justify-between">
          <span>API Server Notice: {error} (Ensure backend is running at http://127.0.0.1:8000)</span>
          <button onClick={() => window.location.reload()} className="underline font-mono">Retry</button>
        </div>
      )}

      {/* 4 Stat Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total NCRP Complaints</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {stats ? stats.total_complaints : "—"}
          </div>
          <p className="text-[11px] text-slate-500">Triage across cybercrime categories</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>High Risk Cases</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {stats ? stats.high_risk_cases_count : "—"}
          </div>
          <p className="text-[11px] text-slate-500">Flagged with imminent cashout risk</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Predicted Hotspots</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono">
            {stats ? stats.active_hotspots_count : "—"}
          </div>
          <p className="text-[11px] text-slate-500">High-probability ATM/CSP clusters</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Amount at Risk</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {stats ? `₹${(stats.amount_at_risk / 100000).toFixed(2)} Lakh` : "—"}
          </div>
          <p className="text-[11px] text-slate-500">Under multi-hop surveillance</p>
        </div>
      </div>

      {/* Main Grid: GIS Surveillance Map + Active Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                Live GIS Hotspot Surveillance & ATM Clusters
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Delhi-NCR Region</span>
          </div>

          <LeafletMap
            locations={stats?.hotspot_locations || []}
            height="420px"
            center={[28.6139, 77.2090]}
            zoom={12}
          />

          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                High Risk ATM/CSP (&ge;10 incidents)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Surveilled Financial Node
              </span>
            </div>
            <Link href="/cashout" className="text-emerald-400 hover:underline flex items-center gap-1 font-medium">
              Run Model Predictions &rarr;
            </Link>
          </div>
        </div>

        {/* Active Cases Column (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                High-Priority Investigations
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{cases.length} Cases</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {cases.map((c) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className={`block p-4 rounded-xl border transition-all ${
                  c.id === "CASE-2026-4401"
                    ? "bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-emerald-400">{c.id}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                    {c.status.replace(/_/g, " ")}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">{c.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <span className="text-slate-400">{c.complaints.length} Convergent Complaints</span>
                  <span className="font-bold text-slate-200">₹{c.total_amount_lost.toLocaleString("en-IN")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent NCRP Complaints + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints Feed */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Recent NCRP / 1930 Cybercrime Complaints
            </h3>
            <span className="text-xs font-mono text-slate-400">Live Stream</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Ack #</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Victim UPI</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {stats?.recent_complaints.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{comp.id}</td>
                    <td className="py-2.5 px-3 text-slate-400">{comp.fraud_category}</td>
                    <td className="py-2.5 px-3 text-blue-300 truncate max-w-[120px]">{comp.victim_upi}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-400">
                      ₹{comp.reported_amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transmitted Intelligence Alerts */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Active Tactical Alerts (LEA / Bank / I4C)
            </h3>
            <Link href="/alerts" className="text-xs text-emerald-400 hover:underline font-medium">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recent_alerts.map((al) => (
              <div
                key={al.id}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400">{al.priority}</span>
                    <span className="text-slate-300 font-semibold">{al.case_title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{al.summary}</p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-1">
                    <span>Agencies: {al.target_agencies.join(", ")}</span>
                    <span>•</span>
                    <span>{al.dispatched_at}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono uppercase shrink-0">
                  {al.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

