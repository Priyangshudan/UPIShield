"use client";

import React, { useState } from "react";
import { AlertCreateRequest, CashoutPredictionItem } from "@/lib/types";
import { createAlert } from "@/lib/api";
import { Bell, ShieldAlert, CheckCircle2, X, Send } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  predictions: CashoutPredictionItem[];
  onAlertCreated?: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  caseId,
  predictions,
  onAlertCreated,
}) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    predictions.slice(0, 2).map((p) => p.location_id)
  );
  const [targetAgencies, setTargetAgencies] = useState<string[]>([
    "LEA_POLICE_CYBERCELL",
    "BANK_FRAUD_NODAL",
    "I4C_REGISTRY",
  ]);
  const [priority, setPriority] = useState<string>("CRITICAL");
  const [customNotes, setCustomNotes] = useState<string>(
    "Immediate tactical patrol dispatch requested. Suspect mule routing indicates ATM withdrawal within 30 minutes."
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleLocation = (id: string) => {
    if (selectedLocations.includes(id)) {
      setSelectedLocations(selectedLocations.filter((l) => l !== id));
    } else {
      setSelectedLocations([...selectedLocations, id]);
    }
  };

  const toggleAgency = (agency: string) => {
    if (targetAgencies.includes(agency)) {
      setTargetAgencies(targetAgencies.filter((a) => a !== agency));
    } else {
      setTargetAgencies([...targetAgencies, agency]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: AlertCreateRequest = {
        case_id: caseId,
        location_ids: selectedLocations.length > 0 ? selectedLocations : [predictions[0]?.location_id || "LOC-ATM-001"],
        target_agencies: targetAgencies,
        priority,
        custom_notes: customNotes,
      };

      await createAlert(payload);
      setSuccessMessage("Intelligence Alert dispatched successfully to designated LEA & Nodal endpoints!");
      setTimeout(() => {
        if (onAlertCreated) onAlertCreated();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      alert("Failed to create alert: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Dispatch Proactive Alert</h3>
              <p className="text-xs text-slate-400">Simulate rapid LEA, Bank, & I4C Action Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-sm font-semibold text-emerald-300">{successMessage}</div>
            <div className="text-xs text-slate-400">Target case: {caseId}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Target Case Info */}
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center font-mono">
              <span className="text-slate-400">Case Identifier:</span>
              <span className="font-semibold text-emerald-400">{caseId}</span>
            </div>

            {/* Target Agencies */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Recipient Stakeholders (Multi-Select):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "LEA_POLICE_CYBERCELL", label: "Police Cyber Cell (LEA)" },
                  { id: "BANK_FRAUD_NODAL", label: "Bank Fraud Nodal" },
                  { id: "I4C_REGISTRY", label: "I4C Central Registry" },
                ].map((agency) => {
                  const active = targetAgencies.includes(agency.id);
                  return (
                    <button
                      type="button"
                      key={agency.id}
                      onClick={() => toggleAgency(agency.id)}
                      className={`p-2 rounded-lg border text-[11px] text-center font-medium transition-all ${
                        active
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-slate-950/40 border-slate-800 text-slate-400"
                      }`}
                    >
                      {agency.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Level */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Priority Level:</label>
              <div className="flex gap-2">
                {["CRITICAL", "HIGH", "MODERATE"].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setPriority(lvl)}
                    className={`flex-1 py-1.5 rounded-lg border text-center font-semibold uppercase text-[11px] transition-all ${
                      priority === lvl
                        ? lvl === "CRITICAL"
                          ? "bg-red-500/20 border-red-500/60 text-red-300"
                          : "bg-amber-500/20 border-amber-500/60 text-amber-300"
                        : "bg-slate-950/40 border-slate-800 text-slate-400"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Predicted Locations */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Attach Predicted ATM/CSP Targets:</label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {predictions.map((p) => {
                  const active = selectedLocations.includes(p.location_id);
                  return (
                    <div
                      key={p.location_id}
                      onClick={() => toggleLocation(p.location_id)}
                      className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                        active
                          ? "bg-slate-800 border-slate-600 text-slate-200"
                          : "bg-slate-950/30 border-slate-800/60 text-slate-400"
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-semibold font-mono mr-2">#{p.rank}</span>
                        <span>{p.name}</span>
                        <span className="text-[10px] text-slate-500 ml-2 font-mono">({p.bank})</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                        {(p.probability_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tactical Notes */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Tactical Action Instructions:</label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200 text-xs focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Dispatching..." : "Transmit Live Alert"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

