"use client";

import React, { useState } from "react";
import { EntityNetworkGraph, EntityNode, EntityEdge } from "@/lib/types";
import { Layers, ArrowRight, UserCheck, Smartphone, Landmark, AlertCircle } from "lucide-react";

interface NetworkGraphVisualizerProps {
  graphData?: EntityNetworkGraph;
}

export const NetworkGraphVisualizer: React.FC<NetworkGraphVisualizerProps> = ({ graphData }) => {
  const [selectedNode, setSelectedNode] = useState<EntityNode | null>(null);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 text-center text-sm">
        No network graph data available for this investigation.
      </div>
    );
  }

  // Categorize nodes by layer/type
  const victims = graphData.nodes.filter((n) => n.type === "victim");
  const layer1Mules = graphData.nodes.filter((n) => n.type === "mule_l1");
  const layer2Mules = graphData.nodes.filter((n) => n.type === "mule_l2");
  const terminalNodes = graphData.nodes.filter(
    (n) => n.type === "runner_token" || n.type === "atm_csp" || n.type === "device" || n.type === "phone"
  );

  const getNodeColor = (type: string) => {
    switch (type) {
      case "victim":
        return "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:border-blue-400";
      case "mule_l1":
        return "bg-red-500/20 border-red-500/60 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:border-red-400";
      case "mule_l2":
        return "bg-amber-500/15 border-amber-500/50 text-amber-300 hover:border-amber-400";
      case "runner_token":
      case "atm_csp":
        return "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 hover:border-emerald-400";
      default:
        return "bg-purple-500/15 border-purple-500/50 text-purple-300 hover:border-purple-400";
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "victim":
        return <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case "mule_l1":
      case "mule_l2":
        return <Landmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "device":
      case "phone":
        return <Smartphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
              NetworkX Multi-Hop Entity & Mule Flow Graph
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {graphData.summary}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{graphData.nodes.length} Entities</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{graphData.edges.length} Hops / Transfers</span>
        </div>
      </div>

      {/* Layer Flow Columns (Visual Pipeline) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Column 1: Victims */}
        <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              1. Victims / Complainants
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {victims.length}
            </span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {victims.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-2.5 rounded-md border text-xs transition-all flex items-start gap-2 ${getNodeColor(
                  node.type
                )} ${selectedNode?.id === node.id ? "ring-2 ring-blue-400" : ""}`}
              >
                {getNodeIcon(node.type)}
                <div className="truncate">
                  <div className="font-semibold truncate">{node.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{node.id}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Layer 1 Mule (Hub) */}
        <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              2. Layer-1 Mule Hub
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/10 text-red-300 border border-red-500/20">
              Convergent
            </span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {layer1Mules.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-2.5 rounded-md border text-xs transition-all flex items-start gap-2 ${getNodeColor(
                  node.type
                )} ${selectedNode?.id === node.id ? "ring-2 ring-red-400" : ""}`}
              >
                {getNodeIcon(node.type)}
                <div className="truncate">
                  <div className="font-semibold truncate">{node.label}</div>
                  <div className="text-[10px] text-red-300 font-mono truncate">{node.id}</div>
                  <div className="text-[10px] text-amber-400 mt-1 font-mono">Central Aggregator</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 3: Layer 2 Mules (Distribution) */}
        <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              3. Layer-2 Distribution
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {layer2Mules.length}
            </span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {layer2Mules.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-2.5 rounded-md border text-xs transition-all flex items-start gap-2 ${getNodeColor(
                  node.type
                )} ${selectedNode?.id === node.id ? "ring-2 ring-amber-400" : ""}`}
              >
                {getNodeIcon(node.type)}
                <div className="truncate">
                  <div className="font-semibold truncate">{node.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{node.id}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 4: Terminal Runner / Cashout Nodes */}
        <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              4. Terminal Runners / ATMs
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {terminalNodes.length}
            </span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {terminalNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-2.5 rounded-md border text-xs transition-all flex items-start gap-2 ${getNodeColor(
                  node.type
                )} ${selectedNode?.id === node.id ? "ring-2 ring-emerald-400" : ""}`}
              >
                {getNodeIcon(node.type)}
                <div className="truncate">
                  <div className="font-semibold truncate">{node.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{node.id}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Entity Inspector Panel */}
      {selectedNode && (
        <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              {getNodeIcon(selectedNode.type)}
              Entity Inspection: {selectedNode.label} ({selectedNode.id})
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-200 font-mono text-[11px]"
            >
              [Close]
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 font-mono text-[11px] pt-1">
            <div>
              <span className="text-slate-500 block">Type:</span>
              <span className="capitalize">{selectedNode.type.replace("_", " ")}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Identifier:</span>
              <span>{selectedNode.id}</span>
            </div>
            {selectedNode.details &&
              Object.entries(selectedNode.details).map(([k, v]) => (
                <div key={k}>
                  <span className="text-slate-500 block capitalize">{k.replace("_", " ")}:</span>
                  <span>{String(v)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Fund Hop Transitions Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Identified Transaction Hops & Edge Telemetry
        </h4>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Hop / Type</th>
                <th className="py-2.5 px-3">Source Entity</th>
                <th className="py-2.5 px-3 text-center">Direction</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {graphData.edges.map((edge, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-400">{edge.label || edge.edge_type}</td>
                  <td className="py-2 px-3 text-blue-300 truncate max-w-[150px]">{edge.source}</td>
                  <td className="py-2 px-3 text-center text-slate-500">
                    <ArrowRight className="w-3.5 h-3.5 mx-auto text-amber-400" />
                  </td>
                  <td className="py-2 px-3 text-red-300 truncate max-w-[150px]">{edge.target}</td>
                  <td className="py-2 px-3 text-right font-semibold text-emerald-400">
                    {edge.amount ? `₹${edge.amount.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="py-2 px-3 text-slate-400">{edge.timestamp || "Recent"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

