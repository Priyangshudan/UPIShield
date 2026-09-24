"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RiskScoreGauge } from "@/components/RiskScoreGauge";
import { NetworkGraphVisualizer } from "@/components/NetworkGraphVisualizer";
import { AlertModal } from "@/components/AlertModal";
import { fetchCaseById, fetchCaseNetwork, predictCashout } from "@/lib/api";
import { CaseDetail, EntityNetworkGraph, CashoutPredictionResponse } from "@/lib/types";
import {
  ShieldAlert,
  ArrowLeft,
  Layers,
  MapPin,
  Bell,
  Cpu,
  FileCheck,
  CheckCircle2,
  AlertOctagon,
  User,
  CreditCard,
  Building,
  RefreshCw
} from "lucide-react";

export default function CaseInvestigationPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = (params?.id as string) || "CASE-2026-4401";

  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [graphData, setGraphData] = useState<EntityNetworkGraph | null>(null);
  const [predictionData, setPredictionData] = useState<CashoutPredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [predicting, setPredicting] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvestigation() {
      try {
        setLoading(true);
        setError(null);
        const [caseRes, graphRes] = await Promise.all([
          fetchCaseById(caseId),
          fetchCaseNetwork(caseId),
        ]);
        setCaseDetail(caseRes);
        setGraphData(graphRes);
      } catch (err: any) {
        console.error("Failed to load case investigation:", err);
        setError(err.message || "Failed to load case data.");
      } finally {
        setLoading(false);
      }
    }
    loadInvestigation();
  }, [caseId]);

  const handleRunPrediction = async () => {
    try {
      setPredicting(true);
      const res = await predictCashout(caseId);
      setPredictionData(res);
      router.push(`/cashout?caseId=${caseId}`);
    } catch (err: any) {
      alert("Cashout prediction failed: " + err.message);
    } finally {
      setPredicting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Running UPIShield multi-hop investigation pipeline...</p>
      </div>
    );
  }

  if (error || !caseDetail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-4 text-center">
        <AlertOctagon className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-200">Investigation Load Error</h2>
        <p className="text-xs text-slate-400">{error || "Case not found."}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Case Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {caseDetail.id}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-semibold">
              {caseDetail.status.replace(/_/g, " ")}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            {caseDetail.title}
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            {caseDetail.description}
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleRunPrediction}
            disabled={predicting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
          >
            <Cpu className="w-4 h-4" />
            <span>{predicting ? "Predicting..." : "Predict Cash-Out Locations"}</span>
          </button>
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Dispatch Tactical Alert</span>
          </button>
        </div>
      </div>

      {/* Case Metadata Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
          <span className="text-slate-500 block font-mono">Total Converged Loss:</span>
          <span className="text-base font-bold text-emerald-400 font-mono">
            ₹{caseDetail.total_amount_lost.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
          <span className="text-slate-500 block font-mono">Primary Mule UPI:</span>
          <span className="text-sm font-semibold text-red-300 font-mono truncate block">
            {caseDetail.primary_mule_upi || "mule.rahul@okaxis"}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
          <span className="text-slate-500 block font-mono">Primary Mule Account:</span>
          <span className="text-sm font-semibold text-amber-300 font-mono truncate block">
            {caseDetail.primary_mule_account || "ACC-MULE-4401"}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
          <span className="text-slate-500 block font-mono">Linked NCRP Complaints:</span>
          <span className="text-base font-bold text-blue-400 font-mono">
            {caseDetail.complaints.length} Victims
          </span>
        </div>
      </div>

      {/* UPIShield Risk Evaluation Gauge */}
      <RiskScoreGauge evaluation={caseDetail.risk_evaluation} />

      {/* NetworkX Entity & Multi-Hop Mule Visualizer */}
      <NetworkGraphVisualizer graphData={graphData || undefined} />

      {/* Linked NCRP Victim Complaints Table */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-400" />
            Convergent 1930 / NCRP Victim Complaints Associated with this Mule Ring
          </h3>
          <span className="text-xs font-mono text-slate-400">{caseDetail.complaints.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Complaint ID</th>
                <th className="py-2.5 px-3">Victim Name & Phone</th>
                <th className="py-2.5 px-3">Victim UPI / Bank</th>
                <th className="py-2.5 px-3">Fraud Modus</th>
                <th className="py-2.5 px-3 text-right">Amount Lost</th>
                <th className="py-2.5 px-3">Reported Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {caseDetail.complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{c.id}</td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{c.victim_name}</div>
                    <div className="text-[10px] text-slate-500">{c.victim_phone}</div>
                  </td>
                  <td className="py-2.5 px-3 text-blue-300">
                    <div>{c.victim_upi}</div>
                    <div className="text-[10px] text-slate-500">{c.victim_bank}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{c.fraud_category}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-400">
                    ₹{c.reported_amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{c.reported_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        caseId={caseDetail.id}
        predictions={
          predictionData?.predicted_locations || [
            {
              rank: 1,
              location_id: "LOC-ATM-001",
              name: "State Bank of India ATM - Connaught Place",
              type: "ATM",
              bank: "SBI",
              latitude: 28.6315,
              longitude: 77.2167,
              probability_score: 0.92,
              risk_level: "CRITICAL",
              distance_km: 2.1,
              estimated_time_window: "15 - 35 mins",
              reason_factors: ["High historical fraud volume", "Proximity to mule token location"],
            },
          ]
        }
      />
    </div>
  );
}

