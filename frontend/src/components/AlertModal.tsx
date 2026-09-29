"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Radio,
  Send,
  Shield,
  ShieldAlert,
  X,
} from "lucide-react";
import { createAlert } from "@/lib/api";
import { AlertCreateRequest, CashoutPredictionItem } from "@/lib/types";
import { cx, StatusBadge } from "@/components/ui";

export function AlertModal({
  isOpen,
  onClose,
  caseId,
  predictions,
  onAlertCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  predictions: CashoutPredictionItem[];
  onAlertCreated?: () => void;
}) {
  const [locs, setLocs] = useState<string[]>([]);
  const [agencies, setAgencies] = useState([
    "LEA_POLICE_CYBERCELL",
    "BANK_FRAUD_NODAL",
    "I4C_REGISTRY",
  ]);
  const [priority, setPriority] = useState("CRITICAL");
  const [notes, setNotes] = useState(
    "Immediate tactical cash-out interdiction and debit-freeze protocol requested based on high-velocity mule pass-through signals."
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const toggle = (
    v: string,
    arr: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const req: AlertCreateRequest = {
        case_id: caseId,
        location_ids: locs.length
          ? locs
          : [predictions[0]?.location_id || "LOC-ATM-001"],
        target_agencies: agencies,
        priority,
        custom_notes: notes,
      };
      await createAlert(req);
      setDone(true);
      onAlertCreated?.();
      setTimeout(() => {
        setDone(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      setError(err.message || "Alert transmission failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl border border-line bg-paper-50 shadow-elevated"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="p-16 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-shield-emerald-light border border-shield-emerald/40 text-shield-emerald">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="headline-sub text-ink">Intelligence Alert Dispatched</h3>
            <p className="max-w-md mx-auto text-xs text-ink-soft leading-relaxed">
              Standardized dispatch payload transmitted to recipient agencies.
              The tactical interception record has been appended to the national dossier.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line bg-paper-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-red-300 bg-shield-crimson-light text-shield-crimson">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink uppercase tracking-wide">
                    Dispatch Intelligence Alert
                  </h3>
                  <div className="mono text-[10px] text-ink-faint">
                    Case: {caseId} · Multi-Agency Protocol
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-ink-faint hover:text-ink transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="p-6 space-y-6">
              {/* Priority Select */}
              <div className="space-y-2">
                <label className="editorial-kicker text-ink-faint">
                  Tactical Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["CRITICAL", "HIGH", "MODERATE"].map((level) => {
                    const isSelected = priority === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPriority(level)}
                        className={cx(
                          "h-10 text-xs font-bold uppercase tracking-wider border transition-colors",
                          isSelected
                            ? level === "CRITICAL"
                              ? "border-shield-crimson bg-shield-crimson-light text-shield-crimson"
                              : level === "HIGH"
                              ? "border-shield-amber bg-shield-amber-light text-shield-amber"
                              : "border-shield-slate bg-shield-slate-light text-shield-slate"
                            : "border-line bg-paper-100 text-ink-soft hover:bg-white"
                        )}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stakeholder Recipient Agencies */}
              <div className="space-y-2">
                <label className="editorial-kicker text-ink-faint">
                  Recipient Stakeholder Agencies
                </label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {[
                    ["LEA_POLICE_CYBERCELL", "Police Cyber Cell"],
                    ["BANK_FRAUD_NODAL", "Bank Fraud Nodal"],
                    ["I4C_REGISTRY", "I4C Registry"],
                  ].map(([idVal, label]) => {
                    const isChecked = agencies.includes(idVal);
                    return (
                      <button
                        key={idVal}
                        type="button"
                        onClick={() => toggle(idVal, agencies, setAgencies)}
                        className={cx(
                          "p-3 text-left border transition-colors",
                          isChecked
                            ? "border-shield-emerald bg-shield-emerald-light text-shield-emerald-dark"
                            : "border-line bg-paper-100 text-ink-soft hover:bg-white"
                        )}
                      >
                        <div className="text-xs font-bold">{label}</div>
                        <div className="mono text-[9px] text-ink-faint mt-0.5">
                          {isChecked ? "● Addressed" : "○ Excluded"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Locations Selection */}
              <div className="space-y-2">
                <label className="editorial-kicker text-ink-faint">
                  Attached Interception Targets
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 border border-line p-2 bg-paper-100">
                  {predictions.length ? (
                    predictions.map((p) => {
                      const isChecked = locs.includes(p.location_id);
                      return (
                        <button
                          key={p.location_id}
                          type="button"
                          onClick={() =>
                            toggle(p.location_id, locs, setLocs)
                          }
                          className={cx(
                            "flex w-full items-center justify-between p-2.5 text-left border transition-colors",
                            isChecked
                              ? "border-shield-emerald bg-white"
                              : "border-transparent bg-paper-50 hover:bg-white"
                          )}
                        >
                          <div className="min-w-0">
                            <span className="mono text-[10px] font-bold text-shield-emerald">
                              #{p.rank}
                            </span>
                            <span className="text-xs font-semibold text-ink ml-2">
                              {p.name}
                            </span>
                          </div>
                          <span className="mono text-xs font-bold text-ink">
                            {(p.probability_score * 100).toFixed(0)}%
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-ink-faint">
                      No specific terminal locations attached. Backend default node will be referenced.
                    </div>
                  )}
                </div>
              </div>

              {/* Tactical Notes */}
              <div className="space-y-2">
                <label className="editorial-kicker text-ink-faint">
                  Operational Enforcement Rationale
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full resize-none border border-line bg-paper-100 p-3 text-xs leading-relaxed text-ink outline-none focus:border-ink-soft"
                />
              </div>

              {error && (
                <div className="border border-red-300 bg-shield-crimson-light p-3 text-xs text-shield-crimson">
                  {error}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-editorial btn-editorial-quiet text-xs h-10 px-4"
                >
                  Cancel
                </button>
                <button
                  disabled={busy}
                  type="submit"
                  className="btn-editorial btn-editorial-danger text-xs h-10 px-6 font-bold"
                >
                  <Send size={13} />
                  {busy ? "Transmitting..." : "Authorize & Dispatch Alert"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

