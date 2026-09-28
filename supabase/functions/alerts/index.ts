import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getSupabaseClient } from "../_shared/supabaseClient.ts";
import { AlertCreateRequest, AlertResponse } from "../_shared/types.ts";

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabase = getSupabaseClient(req);

    // Case 1: GET /alerts
    if (req.method === "GET") {
      const { data: rows, error } = await supabase.from("alerts").select("*").order("dispatched_at", { ascending: false });
      if (error) throw error;

      const alerts: AlertResponse[] = (rows || []).map((r: any) => ({
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

      return new Response(JSON.stringify(alerts), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Case 2: POST /alerts
    if (req.method === "POST") {
      const body: AlertCreateRequest = await req.json();

      if (!body.case_id) {
        return new Response(JSON.stringify({ error: "case_id is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Fetch case title
      const { data: caseRow } = await supabase.from("cases").select("title").eq("id", body.case_id).single();
      const case_title = caseRow ? caseRow.title : "Cybercrime Incident";

      // Fetch target location details
      let loc_details: any[] = [];
      if (body.location_ids && body.location_ids.length > 0) {
        const { data: locRows } = await supabase
          .from("locations")
          .select("id, name, type, bank, address, latitude, longitude")
          .in("id", body.location_ids);
        loc_details = locRows || [];
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const alert_id = `ALT-${dateStr}-${randomSuffix}`;
      const dispatched_at = formatDate(now);
      const priority = body.priority || "CRITICAL";
      const target_agencies = body.target_agencies || ["LEA_POLICE_CYBERCELL", "BANK_NODAL", "I4C_REGISTRY"];
      const action_code = "ACT-DEBIT-FREEZE-PATROL-DEPLOY";
      const status = "DISPATCHED_ACTIVE";

      const loc_names = loc_details.map((l: any) => l.name);
      const custom_notes = body.custom_notes ? ` Notes: ${body.custom_notes}` : "";
      const summary =
        `CRITICAL TACTICAL ALERT: Multi-agency interception alert dispatched to ${target_agencies.join(", ")}. ` +
        `Target hotspots: ${loc_names.slice(0, 2).join(", ")}. Immediate debit freeze and police patrol requested.` +
        custom_notes;

      const newAlert = {
        id: alert_id,
        case_id: body.case_id,
        case_title,
        priority,
        target_agencies,
        predicted_locations: loc_details,
        dispatched_at,
        status,
        action_code,
        summary
      };

      const { error: insertError } = await supabase.from("alerts").insert([
        {
          id: alert_id,
          case_id: body.case_id,
          case_title,
          priority,
          target_agencies: JSON.stringify(target_agencies),
          predicted_locations: JSON.stringify(loc_details),
          dispatched_at,
          status,
          action_code,
          summary
        }
      ]);

      if (insertError) {
        throw insertError;
      }

      return new Response(JSON.stringify(newAlert), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to process alert request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
