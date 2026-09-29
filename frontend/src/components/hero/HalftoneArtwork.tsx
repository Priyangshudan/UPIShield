"use client";

import React, { useEffect, useRef, useState, memo } from "react";

interface HalftoneArtworkProps {
  parallaxX?: number; // 2-4px offset
  parallaxY?: number;
  className?: string;
}

export const HalftoneArtwork = memo(function HalftoneArtwork({
  parallaxX = 0,
  parallaxY = 0,
  className = "",
}: HalftoneArtworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/logo.png";

    img.onload = () => {
      if (!isMounted) return;

      const size = 600;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);

      // Offscreen sampling canvas
      const sampleWidth = 84;
      const sampleHeight = 84;
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = sampleWidth;
      sampleCanvas.height = sampleHeight;
      const sampleCtx = sampleCanvas.getContext("2d");
      if (!sampleCtx) return;

      // Draw image to sample canvas
      sampleCtx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
      const imgData = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight).data;

      const stepX = size / sampleWidth;
      const stepY = size / sampleHeight;
      const maxRadius = Math.max(stepX, stepY) * 0.58;
      const centerX = size / 2;
      const centerY = size / 2;
      const maxDist = size * 0.46;

      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const idx = (y * sampleWidth + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3] / 255;

          if (a < 0.08) continue;

          // Perceived luminance
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          if (luminance < 16) continue;

          const posX = x * stepX + stepX / 2;
          const posY = y * stepY + stepY / 2;

          // Radial vignette falloff towards edges of artwork
          const distFromCenter = Math.hypot(posX - centerX, posY - centerY);
          const edgeFalloff = Math.max(0, 1 - Math.pow(distFromCenter / maxDist, 2.4));
          if (edgeFalloff <= 0) continue;

          const dotFactor = (luminance / 255) * edgeFalloff;
          const dotRadius = Math.max(0.6, dotFactor * maxRadius);

          // Color palette: monochromatic silvery gray with restrained emerald and subtle cyan highlights
          const isGreenish = g > r + 15 && g > b + 10;
          const isCyanish = b > r + 20 && g > r + 10;

          ctx.beginPath();
          ctx.arc(posX, posY, dotRadius, 0, Math.PI * 2);

          if (isCyanish) {
            ctx.fillStyle = `rgba(6, 182, 212, ${Math.min(0.85, 0.4 + dotFactor * 0.45)})`;
          } else if (isGreenish) {
            ctx.fillStyle = `rgba(16, 185, 129, ${Math.min(0.85, 0.35 + dotFactor * 0.5)})`;
          } else {
            // Muted silvery monochrome tone with slight warm green cast
            const grayVal = Math.round(180 + dotFactor * 70);
            ctx.fillStyle = `rgba(${grayVal}, ${Math.min(255, grayVal + 8)}, ${Math.min(255, grayVal + 4)}, ${Math.min(0.8, 0.25 + dotFactor * 0.55)})`;
          }
          ctx.fill();
        }
      }

      setIsRendered(true);
    };

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none relative flex items-center justify-center ${className}`}
      style={{
        transform: `translate3d(${parallaxX * 2.8}px, ${parallaxY * 2.8}px, 0)`,
        transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      {/* Ambient subtle backglow */}
      <div
        className="absolute h-[520px] w-[520px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 75%)",
        }}
      />

      {/* Floating & Scale-breathing wrapper */}
      <div
        className="halftone-breathing relative flex items-center justify-center"
        style={{
          opacity: isRendered ? 0.38 : 0,
          transition: "opacity 1.2s ease-in-out",
        }}
      >
        <canvas
          ref={canvasRef}
          className="max-w-[420px] sm:max-w-[520px] lg:max-w-[580px] h-auto drop-shadow-[0_0_35px_rgba(16,185,129,0.1)]"
        />
      </div>

      <style jsx>{`
        @keyframes floatBreathe {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
        .halftone-breathing {
          animation: floatBreathe 9s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .halftone-breathing {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
});
