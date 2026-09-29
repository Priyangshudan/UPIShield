"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Crosshair,
  Eye,
  Info,
  Layers,
  Maximize2,
  Minimize2,
  Network,
  RotateCcw,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { EntityNetworkGraph, EntityNode } from "@/lib/types";
import { cx, Panel, StatusBadge } from "@/components/ui";

const LANES = [
  "victim",
  "mule_l1",
  "mule_l2",
  "runner_token",
  "device",
  "phone",
  "atm_csp",
];

const LANE_META: Record<string, { label: string; color: string; bg: string }> = {
  victim: { label: "Victim Report", color: "#168B8E", bg: "#E4F4F4" },
  mule_l1: { label: "Primary Mule L1", color: "#C9483D", bg: "#FAECE9" },
  mule_l2: { label: "Distribution L2", color: "#C17D20", bg: "#FDF3DF" },
  runner_token: { label: "Cashout Token", color: "#6A5294", bg: "#F2EDF8" },
  device: { label: "Device / IMEI", color: "#4A5F58", bg: "#EDF2EF" },
  phone: { label: "SIM / Phone", color: "#4A5F58", bg: "#EDF2EF" },
  atm_csp: { label: "ATM / CSP Exit", color: "#087B48", bg: "#E6F5EC" },
};

export function NetworkGraphVisualizer({
  graphData,
}: {
  graphData?: EntityNetworkGraph;
}) {
  const [selectedNode, setSelectedNode] = useState<EntityNode | null>(null);

  if (!graphData?.nodes?.length) {
    return (
      <Panel>
        <div className="p-8 text-center text-xs text-ink-faint">
          No multi-hop network intelligence available for this investigation.
        </div>
      </Panel>
    );
  }

  // Group nodes by lane
  const grouped = useMemo(() => {
    const acc: Record<string, EntityNode[]> = {};
    for (const lane of LANES) {
      acc[lane] = graphData.nodes.filter((n) => n.type === lane);
    }
    return acc;
  }, [graphData]);

  // Compute node coordinates on a spacious canvas
  const { positions, canvasWidth, canvasHeight } = useMemo(() => {
    const p: Record<string, { x: number; y: number }> = {};
    const laneWidth = 190;
    const startX = 110;
    let maxY = 480;

    LANES.forEach((lane, laneIdx) => {
      const nodesInLane = grouped[lane] || [];
      const spacingY = 100;
      const startY = 80;

      nodesInLane.forEach((n, idx) => {
        const y = startY + idx * spacingY;
        p[n.id] = {
          x: startX + laneIdx * laneWidth,
          y: y,
        };
        if (y + 110 > maxY) maxY = y + 110;
      });
    });

    const totalWidth = LANES.length * laneWidth + 140;
    return { positions: p, canvasWidth: totalWidth, canvasHeight: maxY };
  }, [grouped]);

  // Identify connected edges and nodes for selectedNode
  const connectedEdgeIndices = useMemo(() => {
    if (!selectedNode) return new Set<number>();
    const set = new Set<number>();
    graphData.edges.forEach((e, idx) => {
      if (e.source === selectedNode.id || e.target === selectedNode.id) {
        set.add(idx);
      }
    });
    return set;
  }, [selectedNode, graphData.edges]);

  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const set = new Set<string>([selectedNode.id]);
    graphData.edges.forEach((e) => {
      if (e.source === selectedNode.id) set.add(e.target);
      if (e.target === selectedNode.id) set.add(e.source);
    });
    return set;
  }, [selectedNode, graphData.edges]);

  // Calculate flow summary for selected entity
  const entityFlowSummary = useMemo(() => {
    if (!selectedNode) return null;
    const inEdges = graphData.edges.filter((e) => e.target === selectedNode.id);
    const outEdges = graphData.edges.filter((e) => e.source === selectedNode.id);
    const inTotal = inEdges.reduce((sum, e) => sum + (e.amount || 0), 0);
    const outTotal = outEdges.reduce((sum, e) => sum + (e.amount || 0), 0);
    return { inCount: inEdges.length, outCount: outEdges.length, inTotal, outTotal };
  }, [selectedNode, graphData.edges]);

  return (
    <Panel noPad className="overflow-hidden">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line bg-paper-100/70 p-6 sm:p-7">
        <div className="space-y-1">
          <div className="editorial-kicker emerald">
            Entity-Relationship Graph Resolver
          </div>
          <h3 className="headline-sub text-ink">
            Multi-Hop Financial Flow Trail
          </h3>
          <p className="text-xs text-ink-soft">
            Traces the complete laundering topology from victim debit through intermediary mule layers to cash-out exit.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge value={`${graphData.total_layers} Hop Layers`} />
          <span className="mono text-[10px] text-ink-faint">
            {graphData.nodes.length} Nodes · {graphData.edges.length} Transactions
          </span>
          {selectedNode && (
            <button
              onClick={() => setSelectedNode(null)}
              className="btn-editorial btn-editorial-quiet text-[9px] h-8 px-2.5"
            >
              Reset Focus
            </button>
          )}
        </div>
      </div>

      {/* Large Canvas Workspace */}
      <div className="relative bg-[#f8f7f1] overflow-x-auto border-b border-line">
        <div
          className="relative select-none"
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        >
          {/* Subtle Grid Canvas Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(11,33,27,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(11,33,27,0.035) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Lane Header Banners */}
          {LANES.map((lane, idx) => {
            const meta = LANE_META[lane];
            const laneX = 110 + idx * 190;
            return (
              <div
                key={lane}
                className="absolute top-4 -translate-x-1/2 flex items-center gap-1.5"
                style={{ left: `${laneX}px` }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: meta?.color }}
                />
                <span
                  className="editorial-kicker text-[8px] font-bold"
                  style={{ color: meta?.color }}
                >
                  {meta?.label || lane}
                </span>
              </div>
            );
          })}

          {/* SVG Animated Flow Edges */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            width={canvasWidth}
            height={canvasHeight}
            aria-hidden="true"
          >
            <defs>
              <marker
                id="arrow-default"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#b9c2b9" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#087B48" />
              </marker>
            </defs>

            {graphData.edges.map((e, idx) => {
              const a = positions[e.source];
              const b = positions[e.target];
              if (!a || !b) return null;

              const isEdgeActive = connectedEdgeIndices.has(idx);
              const isSubdued =
                selectedNode !== null && !isEdgeActive;

              // Node dimensions are approx 140x54, offset from center
              const startX = a.x + 65;
              const startY = a.y + 26;
              const endX = b.x - 65;
              const endY = b.y + 26;

              const curveX = (startX + endX) / 2;

              return (
                <g key={idx} opacity={isSubdued ? 0.15 : 1}>
                  {/* Background Path Line */}
                  <path
                    d={`M ${startX} ${startY} C ${curveX} ${startY}, ${curveX} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke={isEdgeActive ? "#087B48" : "#cbd4cb"}
                    strokeWidth={isEdgeActive ? 2.5 : 1.3}
                    markerEnd={
                      isEdgeActive ? "url(#arrow-active)" : "url(#arrow-default)"
                    }
                  />

                  {/* Flow Animation Overlay Line */}
                  {isEdgeActive && (
                    <path
                      d={`M ${startX} ${startY} C ${curveX} ${startY}, ${curveX} ${endY}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#087B48"
                      strokeWidth={2.5}
                      className="flow-line"
                    />
                  )}

                  {/* Edge Amount Tag */}
                  {e.amount && !isSubdued && (
                    <text
                      x={curveX}
                      y={(startY + endY) / 2 - 6}
                      fill="#4D5F57"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="SFMono-Regular, monospace"
                      textAnchor="middle"
                    >
                      ₹{e.amount.toLocaleString("en-IN")}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Graph Nodes */}
          {graphData.nodes.map((node) => {
            const p = positions[node.id];
            if (!p) return null;

            const meta = LANE_META[node.type] || {
              label: node.type,
              color: "#4A5F58",
              bg: "#F2F4F2",
            };
            const isCentral = node.id === graphData.central_mule_node;
            const isSelected = selectedNode?.id === node.id;
            const isConnected = connectedNodeIds.has(node.id);
            const isSubdued =
              selectedNode !== null && !isSelected && !isConnected;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={cx(
                  "absolute z-10 w-[140px] -translate-x-1/2 cursor-pointer p-3 border transition-all duration-200 select-none",
                  isSelected
                    ? "bg-white border-2 shadow-elevated scale-105"
                    : isConnected
                    ? "bg-white border-line-strong shadow-card"
                    : "bg-paper-50 border-line hover:border-line-strong hover:bg-white shadow-subtle",
                  isSubdued ? "opacity-30" : "opacity-100"
                )}
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  borderColor: isSelected
                    ? meta.color
                    : isCentral
                    ? "var(--crimson)"
                    : undefined,
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span
                    className="editorial-kicker text-[8px] truncate"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  {isCentral && (
                    <span className="mono text-[7px] font-extrabold uppercase text-shield-crimson bg-shield-crimson-light px-1 border border-shield-crimson/30">
                      NEXUS
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs font-bold text-ink truncate leading-tight">
                  {node.label}
                </div>

                <div className="mt-1 mono text-[9px] text-ink-faint truncate">
                  {node.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Entity Forensic Inspector Panel */}
      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-line bg-paper-50 p-6 sm:p-7">
        <div className="lg:col-span-7 space-y-4 lg:pr-8">
          <div className="flex items-center gap-2 text-xs font-bold text-ink">
            <Crosshair size={14} className="text-shield-emerald" />
            <span>Entity Forensic Telemetry</span>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div>
                  <div
                    className="editorial-kicker font-bold"
                    style={{ color: LANE_META[selectedNode.type]?.color }}
                  >
                    {LANE_META[selectedNode.type]?.label || selectedNode.type}
                  </div>
                  <div className="text-base font-extrabold text-ink mt-0.5">
                    {selectedNode.label}
                  </div>
                </div>
                <div className="mono text-xs font-semibold text-ink-soft bg-paper-100 px-3 py-1 border border-line">
                  {selectedNode.id}
                </div>
              </div>

              {entityFlowSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-line bg-paper-100 p-4">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-ink-faint">
                      Inbound Flows
                    </div>
                    <div className="mono text-xs font-bold text-ink mt-0.5">
                      {entityFlowSummary.inCount} Transits
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-ink-faint">
                      Inbound Volume
                    </div>
                    <div className="mono text-xs font-bold text-shield-emerald mt-0.5">
                      ₹{entityFlowSummary.inTotal.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-ink-faint">
                      Outbound Flows
                    </div>
                    <div className="mono text-xs font-bold text-ink mt-0.5">
                      {entityFlowSummary.outCount} Splits
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-ink-faint">
                      Outbound Volume
                    </div>
                    <div className="mono text-xs font-bold text-shield-crimson mt-0.5">
                      ₹{entityFlowSummary.outTotal.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic details attributes from NetworkX metadata */}
              {selectedNode.details && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {Object.entries(selectedNode.details).map(([key, val]) => (
                    <div key={key} className="border-b border-line-faint pb-1.5">
                      <span className="text-[10px] uppercase font-bold text-ink-faint">
                        {key.replaceAll("_", " ")}:
                      </span>
                      <span className="mono text-ink ml-1.5 font-semibold">
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-line text-xs text-ink-faint">
              Click any entity node on the canvas to inspect its connection topology, inbound/outbound transit sums, and syndicate relevance.
            </div>
          )}
        </div>

        {/* Right: Quick Node Jump List */}
        <div className="lg:col-span-5 pt-6 lg:pt-0 lg:pl-8 space-y-3">
          <div className="editorial-kicker text-ink-faint">
            Indexed Network Nodes ({graphData.nodes.length})
          </div>
          <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
            {graphData.nodes.map((node) => {
              const meta = LANE_META[node.type];
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={cx(
                    "flex w-full items-center justify-between p-2.5 text-left border transition-colors",
                    isSelected
                      ? "border-shield-emerald bg-shield-emerald-light"
                      : "border-line bg-paper-100 hover:border-line-strong hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: meta?.color }}
                    />
                    <span className="text-xs font-semibold text-ink truncate">
                      {node.label}
                    </span>
                  </div>
                  <span className="mono text-[9px] text-ink-faint shrink-0 ml-2">
                    {node.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}

