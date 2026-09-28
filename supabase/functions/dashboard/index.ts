import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getSupabaseClient } from "../_shared/supabaseClient.ts";
import { DashboardStats, Complaint, CashoutLocation, AlertResponse } from "../_shared/types.ts";

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabase = getSupabaseClient(req);

    // 1. Total Complaints & Cases
    const { count: total_complaints } = await supabase.from("complaints").select("*", { count: "exact", head: true });
    const { count: total_cases } = await supabase.from("cases").select("*", { count: "exact", head: true });

    // 2. Amount at risk
    const { data: casesData } = await supabase.from("cases").select("total_amount_lost, status");
    const amount_at_risk = (casesData || []).reduce((acc: number, c: any) => acc + (parseFloat(c.total_amount_lost) || 0), 0);
    const high_risk_cases_count = (casesData || []).filter((c: any) => c.status === "IMMINENT_CASHOUT_FLAGGED").length;

    // 3. Recent complaints
    const { data: recent_complaints_raw } = await supabase
      .from("complaints")
      .select("*")
      .order("reported_time", { ascending: false })
      .limit(5);

    const recent_complaints: Complaint[] = (recent_complaints_raw || []).map((r: any) => ({
      ...r,
      reported_amount: parseFloat(r.reported_amount)
    }));

    // 4. Hotspot locations
    const { data: locations_raw } = await supabase
      .from("locations")
      .select("*")
      .order("historical_fraud_count", { ascending: false });

    const hotspot_locations: CashoutLocation[] = (locations_raw || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      bank: r.bank,
      address: r.address,
      city: r.city,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
      cctv_available: Boolean(r.cctv_available),
      historical_fraud_count: parseInt(r.historical_fraud_count, 10)
    }));

    const active_hotspots_count = hotspot_locations.filter((l) => l.historical_fraud_count >= 10).length;

    // 5. Recent alerts
    const { data: alerts_raw } = await supabase
      .from("alerts")
      .select("*")
      .order("dispatched_at", { ascending: false })
      .limit(3);

    const recent_alerts: AlertResponse[] = (alerts_raw || []).map((r: any) => ({
      id: r.id,
      case_id: r.case_id,
      case_title: r.case_title,
      priority: r.priority,
      target_agencies: typeof r.target_agencies === "string" ? JSON.parse(r.target_agencies) : r.target_agencies,
      predicted_locations: typeof r.predicted_locations === "string" ? JSON.parse(r.predicted_locations) : r.predicted_locations,
      dispatched_at: r.dispatched_at,
      status: r.status,
      action_code: r.action_code,
      summary: r.summary
    }));

    const stats: DashboardStats = {
      total_complaints: total_complaints || 0,
      total_cases: total_cases || 0,
      amount_at_risk,
      high_risk_cases_count,
      active_hotspots_count,
      recent_complaints,
      recent_alerts,
      hotspot_locations
    };

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch dashboard stats" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
