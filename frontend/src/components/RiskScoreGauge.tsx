"use client";

import React from "react";
import { RiskEvaluation } from "@/lib/types";
import { AlertTriangle, CheckCircle, ShieldAlert, Info } from "lucide-react";

interface RiskScoreGaugeProps {
  evaluation?: RiskEvaluation;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ evaluation }) => {
  if (!evaluation) {
    return (
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 text-center text-sm">
        No risk assessment available for this case.
      </div>
    );
  }

  const score = Math.round(evaluation.final_score);
  
  // Color selection based on score & decision
  const getBadgeStyle = () => {
    if (evaluation.decision === "BLOCK" || score >= 80) {
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        ring: "#ef4444",
        label: "CRITICAL RISK - BLOCK",
        icon: ShieldAlert
      };
    }
    if (evaluation.decision === "VERIFY" || score >= 50) {
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-400",
        ring: "#f59e0b",
        label: "HIGH RISK - INTERVENE / VERIFY",
        icon: AlertTriangle
      };
    }
    return {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      ring: "#10b981",
      label: "LOW RISK - ALLOW",
      icon: CheckCircle
    };
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
            UPIShield Financial Risk Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated via Dual-Layer Architecture (General Rules + Behavioral Anomaly)
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${style.bg} ${style.border} ${style.text}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{style.label}</span>
        </div>
      </div>

      {/* Main Score Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Circular Gauge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke={style.ring}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold tracking-tight ${style.text}`}>
                {score}
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400">/ 100</span>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-300 mt-2">Aggregated Risk Index</span>
        </div>

        {/* Dual Layer Breakdown */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Layer 1: General Risk Rules (Zero-History Resilient)</span>
              <span className="font-mono text-amber-400 font-semibold">{Math.round(evaluation.general_score)}/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, evaluation.general_score))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Layer 2: Behavioral Profile Anomaly (Mule Drift)</span>
              <span className="font-mono text-red-400 font-semibold">{Math.round(evaluation.behavior_score)}/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, evaluation.behavior_score))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
              Profile: {evaluation.history_status}
            </span>
            <span>•</span>
            <span>Evaluated across multi-layer mule hops</span>
          </div>
        </div>
      </div>

      {/* Explainable Factor Tags */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Explainable Risk Triggers & Factor Decomposition
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {evaluation.general_reasons.map((r, idx) => (
            <div
              key={`gen-${idx}`}
              className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-start gap-2 text-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span className="text-slate-300">{r}</span>
            </div>
          ))}
          {evaluation.behavior_reasons.map((r, idx) => (
            <div
              key={`beh-${idx}`}
              className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-start gap-2 text-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
              <span className="text-slate-300">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

