"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  IndianRupee,
  Network,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { EditorialArtworkPlate } from "./EditorialArtworkPlate";

export function HeroSection() {
  const [activePipelineStep, setActivePipelineStep] = useState<number | null>(null);

  const pipelineSteps = [
    {
      num: "01",
      name: "DATA",
      label: "NCRP Complaints",
      detail: "Zero-latency ingestion of distributed citizen cybercrime reports & victim transaction hashes.",
      icon: Database,
    },
    {
      num: "02",
      name: "MONEY",
      label: "Splitting Streams",
      detail: "Detects micro-split evasion amounts (e.g. ₹49,990) moving through intermediate nodal accounts.",
      icon: IndianRupee,
    },
    {
      num: "03",
      name: "NETWORK",
      label: "Mule Topology",
      detail: "Constructs multi-hop directed graphs, revealing hidden syndicates across banks and UPI handles.",
      icon: Network,
    },
    {
      num: "04",
      name: "RISK",
      label: "Anomaly Engine",
      detail: "Dual-layer scoring evaluating velocity spikes, dormant account reactivation, and graph centrality.",
      icon: ShieldAlert,
    },
    {
      num: "05",
      name: "PREDICTION",
      label: "ATM Interdiction",
      detail: "XGBoost spatio-temporal tree ranks likely physical extraction terminals and alerts field beat patrols.",
      icon: Zap,
    },
  ];

  return (
    <HeroBackground>
      <div className="space-y-10 w-full">
        {/* Top Split: Left Editorial Copy & Right Enlarged Archival Dossier Plate */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(480px,580px)] xl:grid-cols-[minmax(0,1.05fr)_640px] lg:gap-12 items-center">
          {/* Left Column: Editorial Display Typography */}
          <div className="space-y-5">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 border border-shield-emerald/30 bg-shield-emerald-light px-3.5 py-1.5 shadow-subtle">
              <span className="h-2 w-2 rounded-full bg-shield-emerald animate-pulse" />
              <span className="mono text-[10px] font-bold uppercase tracking-wider text-shield-emerald-dark">
                Autonomous Cybercrime Intelligence
              </span>
              <span className="text-line-strong">|</span>
              <span className="mono text-[9px] text-ink-faint uppercase font-bold">
                Surveillance Grid Active
              </span>
            </div>

            {/* Central Headline */}
            <div className="space-y-1.5">
              <div className="editorial-kicker text-ink-faint">
                Financial Crime Interception System
              </div>
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-ink leading-[0.94]">
                Follow The Money. <br />
                <span className="text-shield-emerald">Predict</span> The{" "}
                <span className="relative inline-block text-ink">
                  Cash-Out.
                  <span className="absolute left-0 right-0 -bottom-2 h-2 bg-shield-crimson/80 rounded-full" />
                </span>
              </h1>
            </div>

            {/* Explanatory Deck */}
            <p className="max-w-xl text-base sm:text-lg text-ink-soft leading-relaxed font-sans">
              When UPI fraud strikes, money shatters across multi-tier mule accounts in under 180 seconds.
              UPIShield reconstructs the transactional network in real time and predicts physical ATM
              extraction endpoints before the cash exits.
            </p>

            {/* Supporting Metric Telemetry Strip */}
            <div className="flex flex-wrap items-center gap-5 border-y border-line py-3.5 mono text-xs text-ink-soft bg-paper-50/80 px-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink text-sm">₹5.47 L</span>
                <span className="text-ink-faint text-[11px]">Active Influx</span>
              </div>
              <span className="text-line-strong hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-shield-crimson text-sm">&lt; 15 Mins</span>
                <span className="text-ink-faint text-[11px]">Interception Window</span>
              </div>
              <span className="text-line-strong hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-shield-emerald text-sm">26 Hotspots</span>
                <span className="text-ink-faint text-[11px]">Delhi-NCR Terminals</span>
              </div>
              <span className="text-line-strong hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-shield-slate text-sm">94.8%</span>
                <span className="text-ink-faint text-[11px]">Accuracy</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/app"
                className="btn-editorial btn-editorial-primary text-xs h-12 px-7 tracking-wider shadow-subtle hover:shadow-editorial"
              >
                Launch Command Center <ArrowRight size={14} />
              </Link>
              <Link
                href="/cases/CASE-2026-4401"
                className="btn-editorial btn-editorial-quiet text-xs h-12 px-6 tracking-wider"
              >
                Case CR-2026-4401 Dossier <ArrowUpRight size={13} />
              </Link>
              <Link
                href="/about-the-data"
                className="text-xs font-bold uppercase tracking-wider text-ink-faint hover:text-ink transition-colors px-2"
              >
                Methodology →
              </Link>
            </div>
          </div>

          {/* Right Column: Enlarged Editorial Dossier Plate */}
          <div className="flex items-center justify-center lg:justify-end w-full">
            <EditorialArtworkPlate />
          </div>
        </div>

        {/* Bottom Strip: The Visual Identity Pipeline: DATA → MONEY → NETWORK → RISK → PREDICTION */}
        <div className="pt-3 border-t border-line">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="editorial-kicker text-ink-faint">
              Interception Pipeline Workflow
            </div>
            <div className="mono text-[10px] text-ink-faint hidden sm:inline">
              END-TO-END TELEMETRY EXECUTION
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              const isHovered = activePipelineStep === idx;
              return (
                <div
                  key={step.num}
                  onMouseEnter={() => setActivePipelineStep(idx)}
                  onMouseLeave={() => setActivePipelineStep(null)}
                  className={`group relative flex flex-col p-3 border transition-all duration-200 cursor-default bg-paper-50 ${
                    isHovered
                      ? "border-shield-emerald shadow-card -translate-y-0.5"
                      : "border-line hover:border-line-strong shadow-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-shield-emerald font-bold">{step.num}</span>
                    <Icon
                      size={14}
                      className={isHovered ? "text-shield-emerald" : "text-ink-faint"}
                    />
                  </div>
                  <div className="mt-1.5 font-editorial text-sm font-bold uppercase tracking-tight text-ink">
                    {step.name}
                  </div>
                  <div className="text-[11px] text-ink-soft truncate font-mono">
                    {step.label}
                  </div>

                  {/* Informational hover popover */}
                  {isHovered && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 z-40 p-3 bg-paper border border-shield-emerald/40 text-[11px] text-ink-soft leading-relaxed shadow-card">
                      <div className="font-bold text-ink mb-1 font-editorial uppercase">
                        Phase {step.num}: {step.name}
                      </div>
                      {step.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </HeroBackground>
  );
}
