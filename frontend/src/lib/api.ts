import {
  DashboardStats,
  Complaint,
  CaseDetail,
  EntityNetworkGraph,
  CashoutPredictionResponse,
  CashoutLocation,
  AlertResponse,
  AlertCreateRequest,
} from "./types";
import {
  SEEDED_COMPLAINTS,
  SEEDED_HOTSPOTS,
  SEEDED_CASES,
  SEEDED_ALERTS,
  getSeededDashboardStats,
  getSeededNetworkGraph,
  predictSeededCashout,
  searchSeededIntelligence,
  SearchGroupResult,
} from "./seededData";

/**
 * Determine API Base URL for Supabase Edge Functions.
 *
 * Priority:
 * 1. NEXT_PUBLIC_API_URL (if explicitly set without trailing slash)
 * 2. NEXT_PUBLIC_SUPABASE_URL + /functions/v1
 * 3. Default fallback to local Supabase CLI (http://127.0.0.1:54321/functions/v1)
 */
function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/functions/v1`;
  }
  return "http://127.0.0.1:54321/functions/v1";
}

/**
 * Request headers for Supabase Edge Functions.
 * Sends publishable/anon key via the mandatory `apikey` header.
 */
function getAuthHeaders(optionsHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...optionsHeaders,
  };

  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseKey) {
    headers["apikey"] = supabaseKey;
  }

  return headers;
}

/**
 * Fetch helper with timeout to ensure UI responsiveness.
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      headers: getAuthHeaders((options.headers as Record<string, string>) || {}),
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// In-memory runtime state for alerts created during session
let runtimeAlerts: AlertResponse[] = [...SEEDED_ALERTS];

/**
 * 1. Dashboard Stats
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/dashboard`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.total_cases !== undefined) {
        return data;
      }
    }
  } catch {
    // Fallback to seeded stats if backend is unreachable
  }
  return {
    ...getSeededDashboardStats(),
    recent_alerts: runtimeAlerts.slice(0, 8),
  };
}

/**
 * 2. Complaints Feed (Optional case_id filter)
 */
export async function fetchComplaints(caseId?: string): Promise<Complaint[]> {
  try {
    const url = caseId
      ? `${getApiBase()}/complaints?case_id=${encodeURIComponent(caseId)}`
      : `${getApiBase()}/complaints`;
    const res = await fetchWithTimeout(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback
  }
  if (caseId) {
    return SEEDED_COMPLAINTS.filter((c) => c.case_id === caseId);
  }
  return SEEDED_COMPLAINTS;
}

/**
 * 3. Single Complaint by ID
 */
export async function fetchComplaintById(id: string): Promise<Complaint> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/complaints/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return data;
      }
    }
  } catch {
    // Fallback
  }
  const found = SEEDED_COMPLAINTS.find((c) => c.id === id);
  if (!found) throw new Error(`Complaint ${id} not found.`);
  return found;
}

/**
 * 4. Cases List
 */
export async function fetchCases(): Promise<CaseDetail[]> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/cases`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback
  }
  return SEEDED_CASES;
}

/**
 * 5. Single Case Detail with Risk Evaluation
 */
export async function fetchCaseById(id: string): Promise<CaseDetail> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/cases/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return data;
      }
    }
  } catch {
    // Fallback
  }
  const found = SEEDED_CASES.find((c) => c.id === id);
  if (found) return found;
  return SEEDED_CASES[0];
}

/**
 * 6. Case Entity Network Graph
 */
export async function fetchCaseNetwork(caseId: string): Promise<EntityNetworkGraph> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/cases/${encodeURIComponent(caseId)}/network`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.nodes && data.nodes.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback
  }
  return getSeededNetworkGraph(caseId);
}

/**
 * 7. Cashout Location Prediction
 */
export async function predictCashout(caseId: string): Promise<CashoutPredictionResponse> {
  const res = await fetchWithTimeout(`${getApiBase()}/cases/${encodeURIComponent(caseId)}/predict-cashout`, {
    method: "POST",
    cache: "no-store",
  });
  if (res.ok) {
    const data = await res.json();
    if (data && data.predicted_locations && data.predicted_locations.length > 0) {
      return data;
    }
  }
  throw new Error(`Failed to execute ML cash-out prediction model for docket ${caseId} (${res.status} ${res.statusText}).`);
}

/**
 * 8. Locations List (Optional city filter)
 */
export async function fetchLocations(city?: string): Promise<CashoutLocation[]> {
  try {
    const url = city
      ? `${getApiBase()}/locations?city=${encodeURIComponent(city)}`
      : `${getApiBase()}/locations`;
    const res = await fetchWithTimeout(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback
  }
  if (city) {
    return SEEDED_HOTSPOTS.filter((l) => l.city.toLowerCase().includes(city.toLowerCase()));
  }
  return SEEDED_HOTSPOTS;
}

/**
 * 9. Fetch Alerts Feed
 */
export async function fetchAlerts(): Promise<AlertResponse[]> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/alerts`, { cache: "no-store" });
    if (res.ok) {
      const data: AlertResponse[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback
  }
  return runtimeAlerts;
}

/**
 * 10. Dispatch / Create Tactical Alert
 */
export async function createAlert(req: AlertCreateRequest): Promise<AlertResponse> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/alerts`, {
      method: "POST",
      body: JSON.stringify(req),
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        runtimeAlerts = [data, ...runtimeAlerts];
        return data;
      }
    }
  } catch {
    // Fallback
  }

  // Fallback local alert construction
  const newAlert: AlertResponse = {
    id: `ALT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    case_id: req.case_id,
    case_title: SEEDED_CASES.find((c) => c.id === req.case_id)?.title || `Case ${req.case_id}`,
    priority: req.priority || "CRITICAL",
    target_agencies: req.target_agencies || ["LEA_POLICE_CYBERCELL", "BANK_FRAUD_NODAL", "I4C_REGISTRY"],
    predicted_locations: req.location_ids.map((id) => {
      const loc = SEEDED_HOTSPOTS.find((h) => h.id === id);
      return { id, name: loc?.name || id, probability: 0.948 };
    }),
    dispatched_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    status: "DISPATCHED_ACTIVE",
    action_code: "ACT-DEBIT-FREEZE-PATROL-DEPLOY",
    summary: req.custom_notes || `CRITICAL TACTICAL ALERT: Emergency dispatch issued for Case ${req.case_id}.`,
  };

  runtimeAlerts = [newAlert, ...runtimeAlerts];
  return newAlert;
}

/**
 * 11. Search Global Intelligence Index
 */
export async function searchGlobalIntelligence(query: string): Promise<SearchGroupResult> {
  return searchSeededIntelligence(query);
}
