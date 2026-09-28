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

/**
 * API base URL.
 *
 * Priority:
 * 1. NEXT_PUBLIC_API_URL if explicitly configured
 * 2. NEXT_PUBLIC_SUPABASE_URL + /functions/v1
 * 3. Local Supabase fallback
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
 * Headers for Supabase Edge Functions.
 *
 * We intentionally send the publishable/anon key only through
 * the `apikey` header.
 *
 * Do NOT send it as:
 * Authorization: Bearer <publishable-key>
 *
 * because the new sb_publishable_... key is not a JWT.
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseKey) {
    headers["apikey"] = supabaseKey;
  }

  return headers;
}

/**
 * Dashboard
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${getApiBase()}/dashboard`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch dashboard stats: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Complaints
 */
export async function fetchComplaints(
  caseId?: string
): Promise<Complaint[]> {
  const url = caseId
    ? `${getApiBase()}/complaints?case_id=${encodeURIComponent(caseId)}`
    : `${getApiBase()}/complaints`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch complaints: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Single complaint
 */
export async function fetchComplaintById(
  id: string
): Promise<Complaint> {
  const res = await fetch(
    `${getApiBase()}/complaints/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch complaint ${id}: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Cases
 */
export async function fetchCases(): Promise<CaseDetail[]> {
  const res = await fetch(`${getApiBase()}/cases`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch cases: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Single case
 */
export async function fetchCaseById(
  id: string
): Promise<CaseDetail> {
  const res = await fetch(
    `${getApiBase()}/cases/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch case ${id}: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Case network graph
 */
export async function fetchCaseNetwork(
  caseId: string
): Promise<EntityNetworkGraph> {
  const res = await fetch(
    `${getApiBase()}/cases/${encodeURIComponent(caseId)}/network`,
    {
      cache: "no-store",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch network graph for ${caseId}: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Cashout prediction
 */
export async function predictCashout(
  caseId: string
): Promise<CashoutPredictionResponse> {
  const res = await fetch(
    `${getApiBase()}/cases/${encodeURIComponent(caseId)}/predict-cashout`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to predict cashout for ${caseId}: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Locations
 */
export async function fetchLocations(
  city?: string
): Promise<CashoutLocation[]> {
  const url = city
    ? `${getApiBase()}/locations?city=${encodeURIComponent(city)}`
    : `${getApiBase()}/locations`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch locations: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Alerts
 */
export async function fetchAlerts(): Promise<AlertResponse[]> {
  const res = await fetch(`${getApiBase()}/alerts`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch alerts: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Create / dispatch alert
 */
export async function createAlert(
  req: AlertCreateRequest
): Promise<AlertResponse> {
  const res = await fetch(`${getApiBase()}/alerts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(req),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Failed to dispatch alert: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}