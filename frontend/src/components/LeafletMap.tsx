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

export const LeafletMap: React.FC<LeafletMapProps> = ({
  locations = [],
  predictions = [],
  selectedLocationId,
  onSelectLocation,
  height = "400px",
  center = [28.6139, 77.2090],
  zoom = 12,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Dynamically import Leaflet on client side
    let isMounted = true;
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Inject Leaflet CSS dynamically if not present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Initialize map instance if not created
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView(center, zoom);
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // 1. Render Hotspot Locations (Dashboard)
      locations.forEach((loc) => {
        const isHighRisk = loc.historical_fraud_count >= 10;
        const color = isHighRisk ? "#ef4444" : "#3b82f6";

        const circleMarker = L.circleMarker([loc.latitude, loc.longitude], {
          radius: isHighRisk ? 12 : 8,
          fillColor: color,
          color: "#0f172a",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 2px;">
            <strong style="font-size: 13px;">${loc.name}</strong><br/>
            <span style="color: #475569;">${loc.type} (${loc.bank})</span><br/>
            <span style="color: #64748b;">${loc.address}</span><br/>
            <div style="margin-top: 4px; font-weight: bold; color: ${isHighRisk ? '#dc2626' : '#2563eb'};">
              Historical Fraud Incidents: ${loc.historical_fraud_count}
            </div>
          </div>
        `;
        circleMarker.bindPopup(popupContent);
        markersRef.current.push(circleMarker);
      });

      // 2. Render ML Predicted Locations (Cashout Predictor Workbench)
      predictions.forEach((pred) => {
        const isSelected = selectedLocationId === pred.location_id;
        const isCritical = pred.risk_level === "CRITICAL" || pred.probability_score >= 0.85;
        const badgeColor = isCritical ? "#ef4444" : "#f59e0b";

        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              background-color: ${isSelected ? "#10b981" : badgeColor};
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 12px;
              border: 3px solid ${isSelected ? "#ffffff" : "#0f172a"};
              box-shadow: 0 0 12px ${isSelected ? "rgba(16,185,129,0.8)" : "rgba(0,0,0,0.5)"};
              transition: transform 0.2s;
            ">
              ${pred.rank}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([pred.latitude, pred.longitude], { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 2px;">
            <strong style="font-size: 13px;">Rank #${pred.rank} — ${pred.name}</strong><br/>
            <span style="color: #475569;">${pred.type} (${pred.bank})</span><br/>
            <div style="margin-top: 4px; font-weight: bold; color: ${isCritical ? '#dc2626' : '#d97706'};">
              Probability: ${(pred.probability_score * 100).toFixed(1)}% [${pred.risk_level}]
            </div>
            <div style="color: #475569; margin-top: 2px;">
              Distance: ${pred.distance_km.toFixed(1)} km | Time Window: ${pred.estimated_time_window}
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);

        if (onSelectLocation) {
          marker.on("click", () => onSelectLocation(pred.location_id));
        }

        markersRef.current.push(marker);
      });
    });

    return () => {
      isMounted = false;
    };
  }, [locations, predictions, selectedLocationId, center, zoom, onSelectLocation]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: "100%" }}
      className="rounded-xl overflow-hidden border border-slate-800 shadow-inner z-0 relative"
    />
  );
};
