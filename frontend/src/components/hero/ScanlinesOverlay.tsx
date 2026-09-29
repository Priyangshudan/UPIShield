"use client";

import React, { memo } from "react";

export const ScanlinesOverlay = memo(function ScanlinesOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* Moving subtle scanlines */}
      <div
        className="absolute inset-0 h-[200%] w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 0, 0, 0.35) 3px, rgba(0, 0, 0, 0.35) 4px)",
          opacity: 0.045,
          animation: "heroScanline 12s linear infinite",
        }}
      />

      {/* Atmospheric perimeter vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 35%, rgba(6, 11, 8, 0.45) 65%, rgba(6, 11, 8, 0.92) 90%, #060b08 100%)",
        }}
      />

      {/* Embedded CSS keyframe for smooth scanline float */}
      <style jsx>{`
        @keyframes heroScanline {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-40px);
          }
        }
      `}</style>
    </div>
  );
});
