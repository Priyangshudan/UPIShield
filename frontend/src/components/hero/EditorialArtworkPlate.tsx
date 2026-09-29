"use client";

import React, { memo } from "react";
import { Compass, Radio, ArrowUpRight, ShieldAlert, Cpu } from "lucide-react";
import Link from "next/link";

export const EditorialArtworkPlate = memo(function EditorialArtworkPlate() {
  return (
    <div className="relative flex items-center justify-center w-full max-w-[560px] lg:max-w-[640px] xl:max-w-[700px]">
      {/* Ambient soft glow underneath plate */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-shield-emerald/15 via-transparent to-shield-slate/15 blur-2xl -z-10" />

      {/* Main Archival Dossier Plate */}
      <div className="plate-float relative w-full border border-line bg-paper-50 p-4 sm:p-6 shadow-elevated">
        {/* Corner registration crosshairs */}
        <span className="absolute top-2.5 left-2.5 text-xs font-mono text-ink-faint leading-none select-none">+</span>
        <span className="absolute top-2.5 right-2.5 text-xs font-mono text-ink-faint leading-none select-none">+</span>
        <span className="absolute bottom-2.5 left-2.5 text-xs font-mono text-ink-faint leading-none select-none">+</span>
        <span className="absolute bottom-2.5 right-2.5 text-xs font-mono text-ink-faint leading-none select-none">+</span>

        {/* Top Header Strip */}
        <div className="flex items-center justify-between border-b border-line pb-3 mb-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shield-emerald opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-shield-emerald" />
            </span>
            <span className="font-bold text-ink uppercase tracking-wider">
              OPERATION SHADOWMULE // CASE-2026-4401
            </span>
          </div>
          <span className="text-shield-crimson font-bold uppercase tracking-wider text-[11px] bg-shield-crimson-light border border-shield-crimson/30 px-2 py-0.5">
            PRE-EXIT WINDOW &lt; 15M
          </span>
        </div>

        {/* Enlarged Centered Classical Artwork Frame */}
        <div className="relative overflow-hidden border border-line bg-paper-100 flex items-center justify-center aspect-square max-h-[460px] sm:max-h-[520px] lg:max-h-[560px]">
          {/* Subtle grid watermark */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(11,33,27,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,33,27,0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <img
            src="/logo.png"
            alt="UPIShield Classical Cybercrime Intelligence Plate"
            className="h-full w-full object-contain p-2 sm:p-4 select-none drop-shadow-subtle"
            loading="eager"
          />

          {/* Floating Interdiction Prediction Tag (Top Right) */}
          <div className="absolute top-4 right-4 bg-paper/95 backdrop-blur-md border border-line p-2.5 shadow-card text-xs font-mono max-w-[220px]">
            <div className="text-[9px] uppercase tracking-wider text-ink-faint font-bold flex items-center gap-1.5 mb-0.5">
              <Compass size={11} className="text-shield-emerald animate-spin [animation-duration:10s]" />
              Target Terminal
            </div>
            <div className="font-bold text-ink text-xs">ATM-DEL-028 · Rohini</div>
            <div className="text-[10px] text-shield-emerald font-semibold pt-0.5">94.8% Interception Rank</div>
          </div>

          {/* Floating GPS & Influx Tag (Bottom Left) */}
          <div className="absolute bottom-4 left-4 bg-paper/95 backdrop-blur-md border border-line p-2.5 shadow-card text-xs font-mono">
            <div className="text-[9px] uppercase tracking-wider text-ink-faint font-bold mb-0.5">
              Tower Telemetry
            </div>
            <div className="font-bold text-shield-emerald">28.6139°N, 77.2090°E</div>
            <div className="text-[10px] text-ink-soft">DEL-SOUTH GRID SECTOR</div>
          </div>

          {/* Tactical Speed Badge (Bottom Right) */}
          <div className="hidden sm:block absolute bottom-4 right-4 bg-paper/95 backdrop-blur-md border border-line p-2 shadow-card text-[10px] font-mono text-right">
            <span className="text-ink-faint uppercase tracking-wider text-[8px] block">Laundering Velocity</span>
            <span className="font-bold text-shield-crimson">180s Hop Siphon</span>
          </div>
        </div>

        {/* Bottom Dossier Meta Strip */}
        <div className="mt-3.5 pt-3.5 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-ink-soft">
          <div className="flex items-center gap-4">
            <span>SYNDICATE: <strong className="text-ink">MULE-L2-CLUSTER</strong></span>
            <span className="text-line-strong hidden sm:inline">|</span>
            <span>INFLUX: <strong className="text-shield-emerald">₹5,47,200</strong></span>
          </div>
          <Link
            href="/cases/CASE-2026-4401"
            className="inline-flex items-center gap-1.5 font-bold text-shield-emerald hover:underline text-xs"
          >
            Inspect Active Dossier <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes subtlePlateFloat {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .plate-float {
          animation: subtlePlateFloat 8s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .plate-float {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
});
