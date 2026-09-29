"use client";

import React, { memo } from "react";
import { ShieldAlert, Compass, Activity, Radio, Cpu } from "lucide-react";

interface ForegroundTelemetryProps {
  parallaxX?: number; // 4-6px
  parallaxY?: number;
}

export const HeroForegroundTelemetry = memo(function HeroForegroundTelemetry({
  parallaxX = 0,
  parallaxY = 0,
}: ForegroundTelemetryProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{
        transform: `translate3d(${parallaxX * 5.2}px, ${parallaxY * 5.2}px, 0)`,
        transition: "transform 0.18s cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      {/* Top Left: Active Case Tactical HUD */}
      <div className="hidden xl:flex absolute top-12 left-10 flex-col gap-1 rounded-sm border border-emerald-500/20 bg-[#09120D]/85 p-3.5 shadow-2xl backdrop-blur-md max-w-xs">
        <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-emerald-400/90 uppercase">
          <span className="flex items-center gap-1.5">
            <Radio size={11} className="animate-pulse text-emerald-400" />
            NCRP Case Stream
          </span>
          <span className="text-white/40">CR-2026-4401</span>
        </div>
        <div className="text-xs font-semibold text-white/90">
          Layer-2 Mule Funnel Detected
        </div>
        <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-white/60">
          <span className="text-emerald-400 font-bold">₹5,47,200 Influx</span>
          <span className="text-white/30">|</span>
          <span>180s Velocity</span>
        </div>
      </div>

      {/* Top Right: Real-time Cash-Out Prediction HUD */}
      <div className="hidden xl:flex absolute top-12 right-10 flex-col gap-1 rounded-sm border border-cyan-500/20 bg-[#09120D]/85 p-3.5 shadow-2xl backdrop-blur-md max-w-xs text-right">
        <div className="flex items-center justify-end gap-1.5 text-[9px] font-mono tracking-widest text-cyan-400/90 uppercase">
          <span>ATM Extraction Prediction</span>
          <Compass size={11} className="animate-spin text-cyan-400 [animation-duration:8s]" />
        </div>
        <div className="text-xs font-semibold text-white/90">
          ATM-DEL-028 · Rohini Sector 7
        </div>
        <div className="flex items-center justify-end gap-3 pt-1 text-[10px] font-mono text-white/60">
          <span className="text-rose-400 font-bold">&lt; 14m Window</span>
          <span className="text-white/30">|</span>
          <span className="text-emerald-400">94.8% Conf.</span>
        </div>
      </div>

      {/* Bottom Left: Spatial Grid Status */}
      <div className="hidden lg:flex absolute bottom-10 left-10 items-center gap-2.5 rounded-sm border border-white/[0.08] bg-[#09120D]/80 px-3 py-2 text-[10px] font-mono text-white/60 shadow-xl backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-white/80">GRID: 26 DEL-NCR TERMINALS MONITORED</span>
      </div>

      {/* Bottom Right: ML Inference Protocol */}
      <div className="hidden lg:flex absolute bottom-10 right-10 items-center gap-2 rounded-sm border border-white/[0.08] bg-[#09120D]/80 px-3 py-2 text-[10px] font-mono text-white/60 shadow-xl backdrop-blur-sm">
        <Cpu size={12} className="text-cyan-400" />
        <span>MODEL: XGBOOST-SPATIAL // V2.4 DETERMINISTIC</span>
      </div>
    </div>
  );
});
