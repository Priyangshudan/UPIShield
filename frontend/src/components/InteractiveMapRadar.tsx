"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Layers,
  MapPin,
  Radio,
  ShieldAlert,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { LeafletMap, TrajectoryPoint } from "./LeafletMap";
import { fetchLocations, predictCashout } from "@/lib/api";
import { CashoutLocation, CashoutPredictionItem } from "@/lib/types";

// Real Delhi-NCR Geocoded Trajectory for Case 4401
const CASE_4401_TRAJECTORY: TrajectoryPoint[] = [
  {
    id: "HOP-01",
    latitude: 28.5244,
    longitude: 77.2167,
    label: "Victim Ingress Gateway",
    sublabel: "South Delhi / Saket Node · ₹1,20,000",
    step: 1,
    amount: "₹1,20,000 Ingress",
    color: "#087b48",
  },
  {
    id: "HOP-02",
    latitude: 28.6315,
    longitude: 77.2167,
    label: "L1 Primary Mule Hub",
    sublabel: "Axis Bank VPA (suspect_9837) · Connaught Place",
    step: 2,
    amount: "₹5,47,000 Siphon",
    color: "#c17d20",
  },
  {
    id: "HOP-03",
    latitude: 28.6500,
    longitude: 77.1800,
    label: "L2 Distribution Node",
    sublabel: "3 Multi-Tier Sub-Accounts · Karol Bagh",
    step: 3,
    amount: "3 Micro-Splits",
    color: "#c9483d",
  },
  {
    id: "HOP-04",
    latitude: 28.7041,
    longitude: 77.1200,
    label: "Predicted Exit: ATM-DEL-028",
    sublabel: "SBI Terminal · Rohini Sector 7 Hub (< 14m Window)",
    step: 4,
    amount: "94.8% Exit Prob",
    color: "#087b48",
  },
];

export function InteractiveMapRadar() {
  const [activeTab, setActiveTab] = useState<"CORRIDOR" | "ALL">("CORRIDOR");
  const [locations, setLocations] = useState<CashoutLocation[]>([]);
  const [predictions, setPredictions] = useState<CashoutPredictionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("HOP-04");
  const [selectedHopIndex, setSelectedHopIndex] = useState<number>(3);
  const [filterType, setFilterType] = useState<"ALL" | "ATM" | "CSP">("ALL");

  useEffect(() => {
    fetchLocations().then((locs) => {
      setLocations(locs);
    }).catch(() => {});

    predictCashout("CASE-2026-4401").then((res) => {
      if (res && res.predicted_locations) {
        setPredictions(res.predicted_locations);
      }
    }).catch(() => {});
  }, []);

  const handleSelectHop = (index: number) => {
    setSelectedHopIndex(index);
    setSelectedId(CASE_4401_TRAJECTORY[index].id);
  };

  const filteredLocations = locations.filter((loc) => {
    if (filterType === "ATM") return loc.type === "ATM";
    if (filterType === "CSP") return loc.type === "CSP";
    return true;
  });

  const selectedTarget = predictions.find((p) => p.location_id === "LOC-DEL-028") || predictions[0];

  return (
    <div className="relative w-full rounded-2xl border border-line bg-paper-100 overflow-hidden shadow-elevated">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-50 px-5 py-3.5 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shield-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-shield-emerald" />
          </span>
          <span className="mono text-[11px] font-bold uppercase tracking-wider text-ink">
            GIS SURVEILLANCE RADAR · OPERATION SHADOWMULE (CASE-2026-4401)
          </span>
          <span className="text-line-strong hidden sm:inline">|</span>
          <span className="mono text-[10px] text-ink-faint hidden sm:inline">
            26 HOTSPOT TERMINALS MONITORED
          </span>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2 mono text-[10px]">
          <button
            onClick={() => setActiveTab("CORRIDOR")}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all ${
              activeTab === "CORRIDOR"
                ? "border-shield-emerald bg-shield-emerald-light text-shield-emerald-dark font-bold shadow-subtle"
                : "border-line bg-paper-100 text-ink-soft hover:bg-white"
            }`}
          >
            <Zap size={12} className={activeTab === "CORRIDOR" ? "text-shield-emerald" : "text-ink-faint"} />
            <span>Active Corridor Trajectory</span>
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all ${
              activeTab === "ALL"
                ? "border-shield-emerald bg-shield-emerald-light text-shield-emerald-dark font-bold shadow-subtle"
                : "border-line bg-paper-100 text-ink-soft hover:bg-white"
            }`}
          >
            <MapPin size={12} className={activeTab === "ALL" ? "text-shield-emerald" : "text-ink-faint"} />
            <span>All 26 Terminals</span>
          </button>
        </div>
      </div>

      {/* Main Split Interface: Dedicated Timeline Inspector + Clean GIS Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] bg-paper-50 min-h-[500px]">
        {/* Left Inspector Panel: Siphon Timeline OR Hotspot Surveillance */}
        <div className="border-b lg:border-b-0 lg:border-r border-line p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono border-b border-line pb-2">
              <span className="font-bold text-ink uppercase tracking-wider">
                {activeTab === "CORRIDOR" ? "Corridor Hop Inspection" : "Surveillance Hotspots"}
              </span>
              <span className="text-shield-emerald font-bold">
                {activeTab === "CORRIDOR" ? "180s Hop Siphon" : `${filteredLocations.length} Terminals Active`}
              </span>
            </div>

            {/* If Corridor View: Show 4 Hops */}
            {activeTab === "CORRIDOR" ? (
              <div className="space-y-2.5">
                {CASE_4401_TRAJECTORY.map((hop, idx) => {
                  const isSelected = selectedHopIndex === idx;
                  const stageName =
                    hop.step === 1
                      ? "INGRESS GATEWAY"
                      : hop.step === 2
                      ? "L1 PRIMARY MULE"
                      : hop.step === 3
                      ? "L2 DISTRIBUTION"
                      : "PREDICTED EXIT";

                  return (
                    <button
                      key={hop.id}
                      onClick={() => handleSelectHop(idx)}
                      className={`w-full text-left p-3 border transition-all relative ${
                        isSelected
                          ? "border-shield-emerald bg-shield-emerald-light/60 shadow-subtle ring-1 ring-shield-emerald"
                          : "border-line bg-paper-100/60 hover:bg-white text-ink-soft"
                      }`}
                    >
                      {/* Row 1: Step Badge + Stage Tag + Amount Badge */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: hop.color }}
                          >
                            {hop.step}
                          </span>
                          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-ink-faint truncate">
                            HOP 0{hop.step} · {stageName}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] font-bold text-shield-emerald bg-shield-emerald-light/80 px-2 py-0.5 border border-shield-emerald/20 shrink-0">
                          {hop.amount}
                        </span>
                      </div>

                      {/* Row 2: Node Name & Details */}
                      <div className="pl-7">
                        <div className="font-editorial text-xs font-bold text-ink leading-tight">
                          {hop.label}
                        </div>
                        <div className="text-[10px] text-ink-soft font-mono mt-0.5 leading-snug">
                          {hop.sublabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* If All Terminals View: Show Top High-Risk ML Nodes */
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {predictions.slice(0, 5).map((p) => {
                  const isSelected = selectedId === p.location_id;
                  const isCrit = p.risk_level === "CRITICAL" || p.probability_score >= 0.85;
                  return (
                    <button
                      key={p.location_id}
                      onClick={() => setSelectedId(p.location_id)}
                      className={`w-full text-left p-2.5 border transition-all ${
                        isSelected
                          ? "border-shield-emerald bg-shield-emerald-light/60 shadow-subtle ring-1 ring-shield-emerald"
                          : "border-line bg-paper-100/60 hover:bg-white text-ink-soft"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[9px] font-bold text-shield-emerald">
                          RANK #{p.rank} · {p.type}
                        </span>
                        <span className={`font-mono text-[9px] font-bold ${isCrit ? "text-shield-crimson" : "text-shield-amber"}`}>
                          {(p.probability_score * 100).toFixed(1)}% Prob
                        </span>
                      </div>
                      <div className="font-editorial text-xs font-bold text-ink truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-ink-soft font-mono mt-0.5 truncate">
                        {p.bank} · {p.estimated_time_window}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actionable Interdiction Box */}
          <div className="border border-line bg-paper p-3.5 space-y-2 shadow-subtle mt-4">
            <div className="flex items-center justify-between text-[9px] font-mono">
              <span className="font-bold uppercase text-ink-faint">Interdiction Lead</span>
              <span className="text-shield-crimson font-bold uppercase">&lt; 14 Mins Window</span>
            </div>
            <div className="text-xs font-bold text-ink">
              ATM-DEL-028 (SBI Rohini Sector 7)
            </div>
            <p className="text-[10px] text-ink-soft leading-relaxed font-sans">
              PCR Van 1930 &amp; SBI Branch Nodal officer dispatched to lock ATM dispenser cassettes.
            </p>
            <div className="pt-2 border-t border-line flex items-center justify-between">
              <Link
                href="/cases/CASE-2026-4401"
                className="text-[10px] font-bold font-mono text-shield-emerald hover:underline inline-flex items-center gap-1"
              >
                Inspect Case Dossier <ArrowUpRight size={11} />
              </Link>
              <Link
                href="/cashout"
                className="text-[10px] font-bold font-mono text-ink-soft hover:text-ink inline-flex items-center gap-1"
              >
                Full Console <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Map View: Clean Leaflet GIS Map */}
        <div className="relative w-full h-[460px] sm:h-[520px] bg-paper-200">
          <LeafletMap
            locations={filteredLocations}
            predictions={predictions}
            selectedLocationId={selectedId}
            onSelectLocation={(id) => {
              setSelectedId(id);
              const hopIdx = CASE_4401_TRAJECTORY.findIndex((h) => h.id === id);
              if (hopIdx >= 0) setSelectedHopIndex(hopIdx);
            }}
            height="100%"
            center={[28.6448, 77.1500]}
            zoom={11}
            trajectory={CASE_4401_TRAJECTORY}
            showTrajectory={activeTab === "CORRIDOR"}
          />

          {/* Floating Filter Pills on Top Left of Map */}
          {activeTab === "ALL" && (
            <div className="absolute top-4 left-4 z-[400] flex items-center gap-1.5 bg-paper/95 backdrop-blur-md border border-line p-1 shadow-card mono text-[10px]">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-2.5 py-1 transition-colors ${
                  filterType === "ALL"
                    ? "bg-ink text-white font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                All (26)
              </button>
              <button
                onClick={() => setFilterType("ATM")}
                className={`px-2.5 py-1 transition-colors ${
                  filterType === "ATM"
                    ? "bg-shield-emerald text-white font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                ATMs (14)
              </button>
              <button
                onClick={() => setFilterType("CSP")}
                className={`px-2.5 py-1 transition-colors ${
                  filterType === "CSP"
                    ? "bg-shield-slate text-white font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                CSP Kiosks (12)
              </button>
            </div>
          )}

          {/* Floating Target Card on Top Right */}
          {selectedTarget && (
            <div className="hidden sm:block absolute top-4 right-4 z-[400] max-w-[280px] bg-paper/95 backdrop-blur-md border border-line p-3 shadow-elevated text-xs font-mono">
              <div className="flex items-center justify-between border-b border-line pb-1.5 mb-1.5">
                <span className="text-[9px] uppercase tracking-wider text-ink-faint font-bold flex items-center gap-1">
                  <Compass size={11} className="text-shield-emerald" />
                  Target Interdiction
                </span>
                <span className="text-shield-crimson font-bold text-[10px]">
                  94.8% RANK #1
                </span>
              </div>
              <div className="font-editorial text-xs font-bold text-ink truncate">
                {selectedTarget.name}
              </div>
              <div className="text-[10px] text-ink-soft mt-0.5">
                Rohini Sector 7 Hub · &lt; 14 Mins Window
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Surveillance Status Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-paper-50 px-5 py-3 text-xs mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-ink-soft">
            <span className="font-bold text-ink">ACTIVE CASE:</span>
            <span className="text-shield-emerald font-bold">CASE-2026-4401</span>
          </div>
          <span className="text-line-strong hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-ink-soft">
            <span>TARGET CLUSTER:</span>
            <span className="text-ink font-semibold">Rohini Sector 7 / North-West</span>
          </div>
        </div>

        <Link
          href="/cashout"
          className="inline-flex items-center gap-1.5 text-shield-emerald hover:underline font-bold text-[11px]"
        >
          <span>Open Full Interactive Surveillance Console</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
