"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Info,
  Layers,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { RiskEvaluation } from "@/lib/types";
import { cx, Panel, StatusBadge } from "@/components/ui";

export function RiskScoreGauge({
  evaluation,
  networkDepth = 3,
}: {
  evaluation?: RiskEvaluation;
  networkDepth?: number;
}) {
  if (!evaluation) {
    return (
      <Panel>
        <div className="text-xs text-ink-faint">
          No automated risk assessment available for this record.
        </div>
      </Panel>
    );
  }

  const score = Math.round(evaluation.final_score);
  const isBlock = evaluation.decision === "BLOCK" || score >= 80;
  const isVerify = evaluation.decision === "VERIFY" || score >= 50;

  const color = isBlock
    ? "var(--crimson)"
    : isVerify
    ? "var(--amber)"
    : "var(--emerald)";

  const decisionLabel = isBlock
    ? "INTERDICTION RECOMMENDED: ACCOUNT FREEZE"
    : isVerify
    ? "ELEVATED RISK: FORENSIC REVIEW"
    : "BENIGN SIGNAL: WITHIN NORMAL OPERATIONAL PARAMETERS";

  return (
    <Panel noPad className="overflow-hidden">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line bg-paper-100/70 p-6 sm:p-7">
        <div className="space-y-1">
          <div className="editorial-kicker text-ink-faint">
            Automated Risk Interdiction Engine
          </div>
          <h3 className="headline-sub text-ink">
            Dual-Layer Financial Risk Decision
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge
            value={evaluation.decision}
            className="text-xs px-3 py-1 font-extrabold"
          />
        </div>
      </div>

      {/* Hero Decision Composition */}
      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-line bg-paper-50">
        {/* Left: Giant Risk Number Gauge */}
        <div className="lg:col-span-4 p-7 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="editorial-kicker text-ink-faint">Synthesized Risk Score</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span
                className="font-editorial text-6xl sm:text-7xl font-black tracking-tight"
                style={{ color }}
              >
                {score}
              </span>
              <span className="mono text-sm font-bold text-ink-faint uppercase">
                / 100
              </span>
            </div>
            <div className="mt-3 text-xs font-extrabold tracking-wide uppercase" style={{ color }}>
              {decisionLabel}
            </div>
          </div>

          <div className="border border-line bg-paper-100 p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-ink-faint">
              <span>Account History State</span>
              <span className="mono text-ink font-semibold">
                {evaluation.history_status.replaceAll("_", " ")}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-ink-faint">
              <span>Evaluated Transactions</span>
              <span className="mono text-ink font-semibold">
                {evaluation.evaluated_transactions_count || 12} Transits
              </span>
            </div>
          </div>
        </div>

        {/* Right: Three Pillar Visual Breakdown */}
        <div className="lg:col-span-8 p-7 sm:p-8 space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Pillar 1: General Risk */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Scale size={13} className="text-shield-amber" />
                  General Rules
                </span>
                <span className="mono text-xs font-extrabold text-shield-amber">
                  {Math.round(evaluation.general_score)}/100
                </span>
              </div>
              <div className="h-2 bg-paper-200 border border-line-faint">
                <div
                  className="h-full bg-shield-amber transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, evaluation.general_score))}%` }}
                />
              </div>
              <p className="text-[10px] text-ink-soft leading-relaxed">
                Rules-based velocity, dormancy activation, and threshold triggers.
              </p>
            </div>

            {/* Pillar 2: Behavioural Deviation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-shield-crimson" />
                  Behavior Deviation
                </span>
                <span className="mono text-xs font-extrabold text-shield-crimson">
                  {Math.round(evaluation.behavior_score)}/100
                </span>
              </div>
              <div className="h-2 bg-paper-200 border border-line-faint">
                <div
                  className="h-full bg-shield-crimson transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, evaluation.behavior_score))}%` }}
                />
              </div>
              <p className="text-[10px] text-ink-soft leading-relaxed">
                Anomalous transaction hour, pass-through speed, and device anomaly.
              </p>
            </div>

            {/* Pillar 3: Network Evidence */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Network size={13} className="text-shield-emerald" />
                  Network Evidence
                </span>
                <span className="mono text-xs font-extrabold text-shield-emerald">
                  {networkDepth} Layers
                </span>
              </div>
              <div className="h-2 bg-paper-200 border border-line-faint">
                <div
                  className="h-full bg-shield-emerald transition-all duration-500"
                  style={{ width: `${Math.min(100, (networkDepth / 5) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-ink-soft leading-relaxed">
                Direct linkage into identified mule accounts and consolidation clusters.
              </p>
            </div>
          </div>

          {/* Analyst Interpretation Callout */}
          <div className="border border-line bg-paper-100 p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <Info size={14} className="text-shield-emerald" />
              <span>Analyst Forensic Rationale</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-muted">
              {evaluation.human_readable_summary}
            </p>
          </div>
        </div>
      </div>

      {/* Observed Factor Signals List */}
      <div className="border-t border-line bg-paper-100/50 p-6 sm:p-7">
        <div className="editorial-kicker text-ink-faint mb-3">
          Observed Telemetry Signals
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ...evaluation.general_reasons.map((r) => ({
              text: r,
              type: "General Heuristic",
              color: "text-shield-amber",
              dot: "bg-shield-amber",
            })),
            ...evaluation.behavior_reasons.map((r) => ({
              text: r,
              type: "Behavioral Signal",
              color: "text-shield-crimson",
              dot: "bg-shield-crimson",
            })),
          ].map((signal, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 border border-line bg-paper-50 p-3.5"
            >
              <span
                className={cx(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  signal.dot
                )}
              />
              <div className="min-w-0">
                <div className="text-xs text-ink-muted leading-relaxed">
                  {signal.text}
                </div>
                <div className="mt-1 text-[9px] uppercase font-bold text-ink-faint mono">
                  {signal.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

