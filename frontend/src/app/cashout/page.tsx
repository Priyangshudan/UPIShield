"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LeafletMap } from "@/components/LeafletMap";
import { AlertModal } from "@/components/AlertModal";
import { fetchCases, predictCashout } from "@/lib/api";
import { CaseDetail, CashoutPredictionResponse, CashoutPredictionItem } from "@/lib/types";
import {
  MapPin,
  Cpu,
  ShieldAlert,
  Clock,
  Compass,
  Building2,
  CheckCircle2,
  RefreshCw,
  Bell,
  Sparkles,
  Info
} from "lucide-react";

function CashoutPredictionContent() {
  const searchParams = useSearchParams();
  const initialCaseId = searchParams?.get("caseId") || "CASE-2026-4401";

  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId);
  const [predictionData, setPredictionData] = useState<CashoutPredictionResponse | null>(null);
  const [selectedLocId, setSelectedLocId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [predicting, setPredicting] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const casesList = await fetchCases();
        setCases(casesList);

        // Run initial prediction for default case
        const pred = await predictCashout(selectedCaseId);
        setPredictionData(pred);
        if (pred.predicted_locations.length > 0) {
          setSelectedLocId(pred.predicted_locations[0].location_id);
        }
      } catch (err: any) {
        console.error("Failed to load cashout page:", err);
        setError(err.message || "Failed to execute prediction.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleCaseChange = async (newCaseId: string) => {
    setSelectedCaseId(newCaseId);
    try {
      setPredicting(true);
      const pred = await predictCashout(newCaseId);
      setPredictionData(pred);
      if (pred.predicted_locations.length > 0) {
        setSelectedLocId(pred.predicted_locations[0].location_id);
      }
    } catch (err: any) {
      alert("Prediction failed: " + err.message);
    } finally {
      setPredicting(false);
    }
  };

  const selectedLocation = predictionData?.predicted_locations.find(
    (p) => p.location_id === selectedLocId
  ) || predictionData?.predicted_locations[0];

  return (
    <div className="space-y-8">
      {/* Header & Case Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Gradient-Boosted Predictive Model
            </span>
            <span className="text-xs text-slate-500 font-mono">SIH26184 Cash-Out Interception</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            ATM & CSP Cash-Out Location Predictor
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Ranks candidate physical withdrawal points (ATMs, Micro-ATMs, BC Agent CSPs) based on multi-hop mule routing velocity, spatial proximity, and historical fraud density.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">Select Active Case:</label>
            <select
              value={selectedCaseId}
              onChange={(e) => handleCaseChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - ₹{(c.total_amount_lost / 1000).toFixed(0)}k ({c.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleCaseChange(selectedCaseId)}
            disabled={predicting}
            className="mt-4 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all disabled:opacity-50"
            title="Rerun ML Inference"
          >
            <RefreshCw className={`w-4 h-4 ${predicting ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Prediction Pipeline Summary Banner */}
      {predictionData && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
              {predictionData.model_version}
            </div>
            <div className="text-slate-300">
              <span className="font-semibold text-slate-100">Target Diversion Pool: </span>
              <span className="font-mono text-emerald-400 font-bold">
                ₹{predictionData.target_amount.toLocaleString("en-IN")}
              </span>
              <span className="text-slate-400 ml-2">
                • {predictionData.predicted_locations.length} Candidate Withdrawal Nodes Evaluated
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Dispatch Tactical Alert</span>
          </button>
        </div>
      )}

      {/* 2-Column Layout: Ranked Candidates List & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ranked Candidates (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Ranked Candidate Cash-Out Nodes
            </h2>
            <span className="text-[11px] font-mono text-slate-400">ML Confidence Sorted</span>
          </div>

          <div className="space-y-3">
            {predictionData?.predicted_locations.map((loc) => {
              const isSelected = selectedLocId === loc.location_id;
              const isCritical = loc.risk_level === "CRITICAL" || loc.probability_score >= 0.8;

              return (
                <div
                  key={loc.location_id}
                  onClick={() => setSelectedLocId(loc.location_id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCritical
                            ? "bg-red-500/20 text-red-300 border border-red-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        {loc.rank}
                      </span>
                      <div>
                        <h3 className="text-xs font-bold text-slate-200">{loc.name}</h3>
                        <p className="text-[11px] text-slate-400">
                          {loc.bank} • <span className="font-mono">{loc.type}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-sm font-extrabold font-mono ${
                          isCritical ? "text-red-400" : "text-amber-400"
                        }`}
                      >
                        {(loc.probability_score * 100).toFixed(1)}%
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Probability</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Est. Window: <strong className="text-slate-300">{loc.estimated_time_window}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 justify-end">
                      <Compass className="w-3.5 h-3.5 text-slate-500" />
                      <span>Distance: <strong className="text-slate-300">{loc.distance_km.toFixed(1)} km</strong></span>
                    </div>
                  </div>

                  {/* Reason Factors */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {loc.reason_factors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                      >
                        • {factor}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: GIS Map & Focus Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-400" />
              GIS Spatial Interception Map
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Live Pins & Geofencing</span>
          </div>

          <LeafletMap
            predictions={predictionData?.predicted_locations || []}
            selectedLocationId={selectedLocId}
            onSelectLocation={(id) => setSelectedLocId(id)}
            height="450px"
            center={
              selectedLocation
                ? [selectedLocation.latitude, selectedLocation.longitude]
                : [28.6139, 77.2090]
            }
            zoom={13}
          />

          {/* Selected Location Tactical Card */}
          {selectedLocation && (
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    Targeted Surveillance Pin #{selectedLocation.rank}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{selectedLocation.name}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase font-mono ${
                    selectedLocation.risk_level === "CRITICAL"
                      ? "bg-red-500/20 text-red-300 border border-red-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {selectedLocation.risk_level} Priority
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-300 pt-1">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Location Type:</span>
                  <span>{selectedLocation.type} ({selectedLocation.bank})</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Predicted Window:</span>
                  <span>{selectedLocation.estimated_time_window}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Distance:</span>
                  <span>{selectedLocation.distance_km.toFixed(1)} km from mule</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Coordinates:</span>
                  <span>{selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <p className="text-xs text-slate-400">
                  Recommended: Dispatch physical mobile unit or trigger CCTV capture at this terminal.
                </p>
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shrink-0 shadow-md"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Dispatch Alert for this Pin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Dispatch Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        caseId={selectedCaseId}
        predictions={predictionData?.predicted_locations || []}
      />
    </div>
  );
}

export default function CashoutPredictionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono">Loading prediction workbench...</div>}>
      <CashoutPredictionContent />
    </Suspense>
  );
}

