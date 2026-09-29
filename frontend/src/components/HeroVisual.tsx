"use client";

import React from "react";
import Image from "next/image";

interface HeroVisualProps {
  amountAtRisk?: string;
  hotspotsCount?: number;
  className?: string;
}

export function HeroVisual({
  amountAtRisk = "₹5.47 L",
  hotspotsCount = 4,
  className = "",
}: HeroVisualProps) {
  return (
    <div
      className={`relative w-full max-w-[460px] aspect-square mx-auto flex items-center justify-center select-none overflow-hidden rounded-full ${className}`}
      style={{
        background: "radial-gradient(circle at 50% 50%, #dcefe3 0%, #f7f6ef 65%, transparent 72%)",
      }}
    >
      {/* Outer Orbit Dashed Ring */}
      <div
        className="absolute inset-[8%] rounded-full border border-dashed border-[#b6c7b9] pointer-events-none animate-[spin_60s_linear_infinite]"
        style={{ opacity: 0.8 }}
      />

      {/* Inner Glow Halo */}
      <div className="absolute inset-[18%] rounded-full bg-[#c8e8d4]/50 blur-xl pointer-events-none" />

      {/* Floating Rupee Coin (Top Left) */}
      <div className="absolute left-[8%] top-[14%] flex flex-col items-start gap-1 z-20 animate-[floatA_7s_ease-in-out_infinite]">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_12px_18px_rgba(8,123,72,0.18)]">
          <img
            src="/upishield/obj-coin.png"
            alt="UPI Transaction Token"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-ink-soft bg-paper-50/90 backdrop-blur-sm px-2 py-0.5 border border-line shadow-sm">
          {amountAtRisk} · AT RISK
        </span>
      </div>

      {/* Floating Location Pin (Top Right) */}
      <div className="absolute right-[8%] top-[12%] flex flex-col items-end gap-1 z-20 animate-[floatB_6s_ease-in-out_infinite]">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_12px_18px_rgba(201,72,61,0.2)]">
          <img
            src="/upishield/obj-pin.png"
            alt="ATM/CSP Extraction Hotspot"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-shield-crimson bg-paper-50/90 backdrop-blur-sm px-2 py-0.5 border border-shield-crimson/20 shadow-sm">
          {hotspotsCount} HOTSPOTS
        </span>
      </div>

      {/* Center 3D Shield Mascot */}
      <div className="relative z-10 w-[54%] max-w-[240px] aspect-square flex items-center justify-center transition-transform hover:scale-105 duration-300">
        <img
          src="/upishield/shield-mascot.png"
          alt="UPIShield Autonomous Intelligence Core"
          className="w-full h-full object-contain drop-shadow-[0_24px_32px_rgba(8,123,72,0.22)]"
        />
      </div>

      {/* Floating ATM / CSP Terminal (Bottom Right) */}
      <div className="absolute right-[8%] bottom-[8%] flex flex-col items-end gap-1 z-20 animate-[floatA_8s_ease-in-out_-2s_infinite]">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_12px_22px_rgba(11,33,27,0.14)]">
          <img
            src="/upishield/obj-atm.png"
            alt="Physical Extraction Terminal"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-ink-soft bg-paper-50/90 backdrop-blur-sm px-2 py-0.5 border border-line shadow-sm">
          ATM / CSP
        </span>
      </div>

      {/* Bottom Status Capsule */}
      <div className="absolute left-[8%] bottom-[12%] z-20">
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-paper-50/95 backdrop-blur-sm px-3 py-1 shadow-editorial">
          <span className="h-1.5 w-1.5 rounded-full bg-shield-emerald animate-pulse" />
          <span className="mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-ink-soft">
            LIVE RISK FIELD · SYNTHETIC TELEMETRY
          </span>
        </div>
      </div>
    </div>
  );
}
