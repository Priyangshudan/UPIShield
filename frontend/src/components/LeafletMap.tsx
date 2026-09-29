"use client";

import React, { useEffect, useRef } from "react";
import { CashoutLocation, CashoutPredictionItem } from "@/lib/types";

export interface TrajectoryPoint {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  sublabel: string;
  step: number;
  amount?: string;
  color?: string;
}

interface LeafletMapProps {
  locations?: CashoutLocation[];
  predictions?: CashoutPredictionItem[];
  selectedLocationId?: string;
  onSelectLocation?: (id: string) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
  trajectory?: TrajectoryPoint[];
  showTrajectory?: boolean;
}

export function LeafletMap({
  locations = [],
  predictions = [],
  selectedLocationId,
  onSelectLocation,
  height = "420px",
  center = [28.6139, 77.2090],
  zoom = 12,
  trajectory = [],
  showTrajectory = false,
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
        if (!showTrajectory && !selectedLocationId) {
          mapRef.current.setView(center, zoom);
        }
      }

      const map = mapRef.current;

      // Force recalculation of map container dimensions
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);

      // Clear existing markers & paths
      layersRef.current.forEach((x) => x.remove());
      layersRef.current = [];

      // 1. Render Hotspot Locations
      locations.forEach((loc) => {
        const high = loc.historical_fraud_count >= 10;
        const color = high ? "#ef4444" : "#28b7bd";

        const marker = L.circleMarker([loc.latitude, loc.longitude], {
          radius: high ? 9 : 6,
          fillColor: color,
          color: "#0b211b",
          weight: 1.5,
          opacity: 0.8,
          fillOpacity: 0.75,
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

      // 2. Render ML Predicted Locations
      let activeItem: CashoutPredictionItem | undefined;

      predictions.forEach((p) => {
        const critical = p.risk_level === "CRITICAL" || p.probability_score >= 0.85;
        const selected = p.location_id === selectedLocationId;
        if (selected) activeItem = p;

        const size = selected ? 38 : 30;
        const bg = selected
          ? "var(--emerald)"
          : critical
          ? "var(--crimson)"
          : "var(--amber)";

        const icon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              position: relative;
              width: ${size}px;
              height: ${size}px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ${
                selected
                  ? `<span style="
                      position: absolute;
                      inset: -6px;
                      border-radius: 50%;
                      border: 2px solid #087b48;
                      opacity: 0.6;
                      animation: pulseSubtle 1.8s infinite;
                    "></span>`
                  : ""
              }
              <div style="
                width: 100%;
                height: 100%;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: ${bg};
                border: 2px solid #ffffff;
                box-shadow: 0 4px 16px rgba(11,33,27,0.25);
                color: #ffffff;
                font-weight: 900;
                font-size: ${selected ? "13px" : "11px"};
                font-family: SFMono-Regular, monospace;
                cursor: pointer;
                transition: transform 0.2s ease;
              ">
                ${p.rank}
              </div>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([p.latitude, p.longitude], { icon }).addTo(map);

        const popupContent = `
          <div style="font-family: Inter, sans-serif; font-size: 12px; color: #0b211b; min-width: 180px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 10px; font-weight: bold; color: #087b48;">RANK #${p.rank}</span>
              <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: ${critical ? "#c9483d" : "#c17d20"};">${p.risk_level}</span>
            </div>
            <strong style="font-size: 13px; font-weight: 800; color: #0b211b;">${p.name}</strong><br/>
            <span style="color: #4d5f57; font-size: 11px;">${p.type} · ${p.bank}</span><br/>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #dfe3dc; display: flex; justify-content: space-between;">
              <span style="font-weight: 800; color: ${critical ? "#c9483d" : "#087b48"}; font-family: monospace;">
                ${(p.probability_score * 100).toFixed(1)}% Prob
              </span>
              <span style="color: #778880; font-size: 10px;">
                ${p.distance_km.toFixed(1)} km · ${p.estimated_time_window}
              </span>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);

        if (selected && !showTrajectory) {
          marker.openPopup();
        }

        if (onSelectLocation) {
          marker.on("click", () => onSelectLocation(p.location_id));
        }

        layersRef.current.push(marker);
      });

      // 3. Render Real Geographical Trajectory Corridor
      if (showTrajectory && trajectory && trajectory.length > 1) {
        const latlngs = trajectory.map((t) => [t.latitude, t.longitude] as [number, number]);

        // Draw animated dashed polyline along actual coordinates
        const polyline = L.polyline(latlngs, {
          color: "#087b48",
          weight: 4,
          opacity: 0.9,
          dashArray: "8, 10",
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);
        layersRef.current.push(polyline);

        // Draw custom numbered waypoint markers for each hop
        trajectory.forEach((pt) => {
          const isTarget = pt.step === trajectory.length;
          const isSelected = selectedLocationId === pt.id;
          const bg = pt.color || (isTarget ? "#087b48" : "#c17d20");
          const size = isSelected || isTarget ? 36 : 28;

          const icon = L.divIcon({
            className: "trajectory-hop-marker",
            html: `
              <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
                ${isSelected || isTarget ? `<span style="position: absolute; inset: -6px; border-radius: 50%; border: 2px solid ${bg}; animation: pulseSubtle 1.8s infinite; opacity: 0.7;"></span>` : ''}
                <div style="width: 100%; height: 100%; border-radius: 50%; background: ${bg}; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(11,33,27,0.3); color: #ffffff; font-weight: 900; font-size: ${isSelected ? "12px" : "11px"}; display: flex; align-items: center; justify-content: center; font-family: monospace;">
                  ${pt.step}
                </div>
              </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

          const hopMarker = L.marker([pt.latitude, pt.longitude], { icon }).addTo(map);
          hopMarker.bindPopup(`
            <div style="font-family: Inter, sans-serif; font-size: 12px; color: #0b211b; min-width: 190px; padding: 4px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
                <span style="font-family: monospace; font-size: 9px; font-weight: bold; color: ${bg};">
                  CORRIDOR HOP 0${pt.step}
                </span>
                ${isTarget ? '<span style="font-size: 9px; font-weight: 800; color: #c9483d; font-family: monospace;">TARGET EXIT</span>' : ''}
              </div>
              <strong style="font-size: 13px; font-weight: 800; color: #0b211b;">${pt.label}</strong><br/>
              <span style="color: #4d5f57; font-size: 11px;">${pt.sublabel}</span><br/>
              ${pt.amount ? `<div style="margin-top: 5px; font-weight: 800; color: #087b48; font-family: monospace; font-size: 11px; background: rgba(8, 123, 72, 0.08); padding: 3px 6px; border-radius: 4px;">${pt.amount}</div>` : ''}
            </div>
          `);

          if (selectedLocationId ? pt.id === selectedLocationId : isTarget) {
            hopMarker.openPopup();
          }

          if (onSelectLocation) {
            hopMarker.on("click", () => {
              onSelectLocation(pt.id);
              map.panTo([pt.latitude, pt.longitude], { animate: true, duration: 0.6 });
            });
          }

          layersRef.current.push(hopMarker);
        });

        // If a specific hop was clicked, pan to it smoothly; otherwise fit all bounds
        const selectedHop = trajectory.find((t) => t.id === selectedLocationId);
        if (selectedHop && selectedLocationId !== "HOP-04") {
          map.panTo([selectedHop.latitude, selectedHop.longitude], { animate: true, duration: 0.5 });
        } else {
          const bounds = L.latLngBounds(latlngs);
          map.fitBounds(bounds, { padding: [55, 55], maxZoom: 13 });
        }
      } else if (activeItem) {
        map.flyTo([activeItem.latitude, activeItem.longitude], Math.max(map.getZoom(), 13), {
          duration: 0.8,
        });
      }
    });

    return () => {
      mounted = false;
    };
  }, [locations, predictions, selectedLocationId, center, zoom, onSelectLocation, trajectory, showTrajectory]);

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
      className="relative z-0 overflow-hidden bg-paper-200"
    />
  );
}
