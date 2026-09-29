"use client";

import React, { useEffect, useRef, memo } from "react";

interface DataCanvasProps {
  parallaxX?: number; // ~1px offset
  parallaxY?: number;
}

interface TelemetryItem {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  baseOpacity: number;
  colorType: "slate" | "emerald" | "cyan" | "crimson";
  mutates?: boolean;
  variants?: string[];
  variantIndex?: number;
  lastMutated?: number;
}

const SEED_TELEMETRY: Array<{
  text: string;
  colorType: "slate" | "emerald" | "cyan" | "crimson";
  mutates?: boolean;
  variants?: string[];
}> = [
  { text: "CASE-2026-4401", colorType: "emerald", mutates: true, variants: ["CASE-2026-4401", "CASE-2026-4402", "CASE-2026-4408"] },
  { text: "UPI/9837/DELHI", colorType: "cyan" },
  { text: "₹92,400", colorType: "emerald", mutates: true, variants: ["₹92,400", "₹1,84,500", "₹49,990", "₹5,47,200"] },
  { text: "ATM-DEL-028", colorType: "emerald", mutates: true, variants: ["ATM-DEL-028", "ATM-ROHINI-04", "ATM-DWARKA-19"] },
  { text: "RISK 95", colorType: "crimson", mutates: true, variants: ["RISK 95", "RISK 88", "RISK 92", "RISK 97"] },
  { text: "MULE-L1", colorType: "slate" },
  { text: "LAYER-2", colorType: "slate", mutates: true, variants: ["LAYER-2", "LAYER-3", "LAYER-1"] },
  { text: "28.6139°N, 77.2090°E", colorType: "cyan", mutates: true, variants: ["28.6139°N, 77.2090°E", "28.7041°N, 77.1025°E", "28.5355°N, 77.3910°E"] },
  { text: "TXN-4491", colorType: "slate" },
  { text: "1930 DISPATCH", colorType: "emerald" },
  { text: "CASH-OUT", colorType: "crimson" },
  { text: "NETWORK", colorType: "slate" },
  { text: "PREDICTION", colorType: "emerald" },
  { text: "ALERT", colorType: "crimson" },
  { text: "HOP-03", colorType: "slate" },
  { text: "ICICI-MULE-88", colorType: "slate" },
  { text: "SPEED 180s", colorType: "emerald" },
  { text: "CSP-ROHINI", colorType: "cyan" },
  { text: "TRACED", colorType: "emerald" },
  { text: "INTERCEPT-PENDING", colorType: "crimson" },
  { text: "CONFIDENCE 94.8%", colorType: "emerald" },
  { text: "T-00:14:28", colorType: "crimson", mutates: true, variants: ["T-00:14:28", "T-00:14:20", "T-00:14:12", "T-00:14:05"] },
  { text: "DELHI-NCR SOUTH", colorType: "slate" },
  { text: "PAN-EVASION", colorType: "slate" },
  { text: "NODE-DORMANT", colorType: "slate" },
  { text: "SHADOWMULE-SYNC", colorType: "emerald" },
  { text: "VELOCITY 4.8x", colorType: "emerald" },
  { text: "CSP-EXTRACTION", colorType: "cyan" },
  { text: "RBI-CIRCULAR-REF", colorType: "slate" },
  { text: "TOPOLOGY-GRAPH", colorType: "slate" },
];

export const DataCanvas = memo(function DataCanvas({
  parallaxX = 0,
  parallaxY = 0,
}: DataCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isRunning = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Responsive item pool
    let items: TelemetryItem[] = [];

    const initItems = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // On mobile screens (< 768px), reduce telemetry density
      const isMobile = width < 768;
      const count = isMobile ? 18 : 34;

      items = [];
      for (let i = 0; i < count; i++) {
        const seed = SEED_TELEMETRY[i % SEED_TELEMETRY.length];
        items.push({
          text: seed.text,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.08 : 0.16),
          vy: (Math.random() - 0.5) * (isMobile ? 0.08 : 0.16),
          opacity: 0.1 + Math.random() * 0.14,
          baseOpacity: 0.1 + Math.random() * 0.14,
          colorType: seed.colorType,
          mutates: seed.mutates,
          variants: seed.variants,
          variantIndex: 0,
          lastMutated: Date.now() + Math.random() * 8000,
        });
      }
    };

    initItems();

    const handleResize = () => {
      initItems();
    };

    window.addEventListener("resize", handleResize);

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else {
        isRunning = true;
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isRunning) return;

      const dt = Math.min(50, time - lastTime);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background coordinate crosshairs & grid points
      const gridSize = width < 768 ? 140 : 120;
      ctx.fillStyle = "rgba(16, 185, 129, 0.06)";
      ctx.font = "8px monospace";

      for (let gx = gridSize / 2; gx < width; gx += gridSize) {
        for (let gy = gridSize / 2; gy < height; gy += gridSize) {
          // Tiny coordinate mark
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();

          // Occasional faint crosshair
          if ((gx + gy) % (gridSize * 2) === 0) {
            ctx.strokeStyle = "rgba(148, 163, 184, 0.04)";
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(gx - 4, gy);
            ctx.lineTo(gx + 4, gy);
            ctx.moveTo(gx, gy - 4);
            ctx.lineTo(gx, gy + 4);
            ctx.stroke();
          }
        }
      }

      // 2. Faint connection threads between close proximity telemetry nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const dx = items[i].x - items[j].x;
          const dy = items[i].y - items[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.045;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(items[i].x, items[i].y);
            ctx.lineTo(items[j].x, items[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Render telemetry tokens
      ctx.font = "10px 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";
      ctx.textBaseline = "middle";

      const now = Date.now();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Drift unless reduced motion is on
        if (!prefersReducedMotion) {
          item.x += item.vx * (dt / 16);
          item.y += item.vy * (dt / 16);

          if (item.x < -60) item.x = width + 60;
          if (item.x > width + 60) item.x = -60;
          if (item.y < -30) item.y = height + 30;
          if (item.y > height + 30) item.y = -30;

          // Subtle mutation
          if (item.mutates && item.variants && now - (item.lastMutated || 0) > 4500) {
            item.variantIndex =
              ((item.variantIndex || 0) + 1) % item.variants.length;
            item.text = item.variants[item.variantIndex];
            item.lastMutated = now + Math.random() * 4000;
          }
        }

        // Color selection
        let colorStr = "rgba(148, 163, 184, ";
        if (item.colorType === "emerald") colorStr = "rgba(16, 185, 129, ";
        else if (item.colorType === "cyan") colorStr = "rgba(6, 182, 212, ";
        else if (item.colorType === "crimson") colorStr = "rgba(244, 63, 94, ";

        ctx.fillStyle = `${colorStr}${item.opacity})`;
        ctx.fillText(item.text, item.x, item.y);
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(render);
    } else {
      render(performance.now());
    }

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        transform: `translate3d(${parallaxX * 1.0}px, ${parallaxY * 1.0}px, 0)`,
        transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
});
