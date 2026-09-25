"use client";

import React, { useEffect, useRef } from "react";
import { CashoutLocation, CashoutPredictionItem } from "@/lib/types";

interface LeafletMapProps {
  locations?: CashoutLocation[];
  predictions?: CashoutPredictionItem[];
  selectedLocationId?: string;
  onSelectLocation?: (id: string) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export function LeafletMap({
  locations = [],
  predictions = [],
  selectedLocationId,
  onSelectLocation,
  height = "420px",
  center = [28.6139, 77.2090],
  zoom = 12,
}: LeafletMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);

  useEffect(() => {
    let mounted = true;

    // Dynamically import Leaflet on client side
    import("leaflet").then((L) => {
      if (!mounted || !ref.current) return;

      // Inject Leaflet CSS dynamically if not present
      if (typeof window !== "undefined" && !document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Initialize map instance if not created
      if (!mapRef.current) {
        const map = L.map(ref.current, {
          center: center,
          zoom: zoom,
          zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
      } else {
        mapRef.current.setView(center, zoom);
      }

      const map = mapRef.current;

      // Force recalculation of map container dimensions
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);

      // Clear existing markers
      layersRef.current.forEach((x) => x.remove());
      layersRef.current = [];

      // 1. Render Hotspot Locations (Dashboard)
      locations.forEach((loc) => {
        const high = loc.historical_fraud_count >= 10;
        const color = high ? "#ef4444" : "#28b7bd";

        const marker = L.circleMarker([loc.latitude, loc.longitude], {
          radius: high ? 10 : 7,
          fillColor: color,
          color: "#0b211b",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        });

        marker.addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; color: #0b211b; padding: 2px;">
            <strong style="font-size: 13px;">${loc.name}</strong><br/>
            <span style="color: #53645e;">${loc.type} · ${loc.bank}</span><br/>
            <span style="color: #718079;">${loc.address}</span><br/>
            <div style="margin-top: 4px; font-weight: bold; color: ${high ? "#c9483d" : "#087b48"};">
              ${loc.historical_fraud_count} historical incidents
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        layersRef.current.push(marker);
      });

      // 2. Render ML Predicted Locations (Cashout Predictor Workbench)
      predictions.forEach((p) => {
        const critical = p.risk_level === "CRITICAL" || p.probability_score >= 0.85;
        const selected = p.location_id === selectedLocationId;

        const icon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: ${selected ? "#087b48" : critical ? "#c9483d" : "#c17d20"};
              border: 2px solid #fffdf8;
              box-shadow: 0 0 14px ${selected ? "rgba(8,123,72,0.4)" : critical ? "rgba(201,72,61,0.35)" : "rgba(193,125,32,0.35)"};
              color: #ffffff;
              font-weight: 800;
              font-size: 11px;
              font-family: ui-monospace, SFMono-Regular, monospace;
              cursor: pointer;
            ">
              ${p.rank}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([p.latitude, p.longitude], { icon }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; color: #0b211b; padding: 2px;">
            <strong style="font-size: 13px;">#${p.rank} ${p.name}</strong><br/>
            <span style="color: #53645e;">${p.type} · ${p.bank}</span><br/>
            <div style="margin-top: 4px; font-weight: bold; color: ${critical ? "#c9483d" : "#c17d20"};">
              ${(p.probability_score * 100).toFixed(1)}% confidence [${p.risk_level}]
            </div>
            <div style="color: #718079; margin-top: 2px;">
              ${p.distance_km.toFixed(1)} km · ${p.estimated_time_window}
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);

        if (onSelectLocation) {
          marker.on("click", () => onSelectLocation(p.location_id));
        }

        layersRef.current.push(marker);
      });
    });

    return () => {
      mounted = false;
    };
  }, [locations, predictions, selectedLocationId, center, zoom, onSelectLocation]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ height, width: "100%" }}
      className="relative z-0 overflow-hidden rounded-2xl border border-white/[0.07]"
    />
  );
}
