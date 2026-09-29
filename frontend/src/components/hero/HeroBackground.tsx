"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { NoiseOverlay } from "./NoiseOverlay";

interface HeroBackgroundProps {
  children: React.ReactNode;
}

export const HeroBackground = memo(function HeroBackground({
  children,
}: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!hasFinePointer || prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setParallax({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[88vh] sm:min-h-[92vh] w-full overflow-hidden bg-paper text-ink flex flex-col justify-center border-b border-line"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 90% 70% at 50% 25%, #FFFFFF 0%, #FBFBF7 55%, #F4F3EA 100%)",
      }}
    >
      {/* 1. Subtle Architectural Ledger Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11, 33, 27, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11, 33, 27, 0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* 2. Soft Emerald & Slate Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/4 h-[420px] w-[500px] -translate-x-1/2 rounded-full blur-[120px] opacity-35"
        style={{
          background: "radial-gradient(circle, rgba(8, 123, 72, 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-10 h-[380px] w-[440px] rounded-full blur-[100px] opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(22, 139, 142, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* 3. Subtle Paper Grain */}
      <NoiseOverlay />

      {/* 4. Hero Content */}
      <div
        className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-6 pb-12 sm:pt-10 sm:pb-16 lg:px-12"
        style={{
          transform: `translate3d(${parallax.x * 0.8}px, ${parallax.y * 0.8}px, 0)`,
          transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        {children}
      </div>
    </section>
  );
});
