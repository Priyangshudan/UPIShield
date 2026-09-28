import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getSupabaseClient } from "../_shared/supabaseClient.ts";
import { evaluateCaseFinancialRisk } from "../_shared/risk_engine.ts";
import { buildCaseNetwork } from "../_shared/graph_service.ts";
import { predictCaseCashout } from "../_shared/cashout_predictor.ts";
import { CaseDetail, Complaint } from "../_shared/types.ts";

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabase = getSupabaseClient(req);
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter((p) => p && p !== "functions" && p !== "v1" && p !== "cases");

    // Case 1: GET /cases or GET / (List cases)
    if (req.method === "GET" && pathParts.length === 0) {
      const { data: casesRows, error } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
      if (error) throw error;

      const results: CaseDetail[] = [];
      for (const c of casesRows || []) {
        const { data: complaintRows } = await supabase.from("complaints").select("*").eq("case_id", c.id);
        const complaints: Complaint[] = (complaintRows || []).map((r: any) => ({
          ...r,
          reported_amount: parseFloat(r.reported_amount)
        }));

        results.push({
          id: c.id,
          title: c.title,
          description: c.description,
          category: c.category,
          total_amount_lost: parseFloat(c.total_amount_lost),
          created_at: c.created_at,
          status: c.status,
          complaints,
          primary_mule_account: c.primary_mule_account,
          primary_mule_upi: c.primary_mule_upi
        });
      }

      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const caseId = decodeURIComponent(pathParts[0] || "");
    const subRoute = pathParts[1] || "";

    if (!caseId) {
      return new Response(JSON.stringify({ error: "Case ID required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Case 2: GET /cases/{case_id}/network
    if (req.method === "GET" && subRoute === "network") {
      const graph = await buildCaseNetwork(caseId, supabase);
      return new Response(JSON.stringify(graph), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Case 3: POST /cases/{case_id}/predict-cashout
    if (req.method === "POST" && subRoute === "predict-cashout") {
      const prediction = await predictCaseCashout(caseId, supabase);
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Case 4: GET /cases/{case_id} (Case details with risk evaluation)
    if (req.method === "GET" && pathParts.length === 1) {
      const { data: c, error } = await supabase.from("cases").select("*").eq("id", caseId).single();
      if (error || !c) {
        return new Response(JSON.stringify({ detail: `Case ${caseId} not found` }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const { data: complaintRows } = await supabase.from("complaints").select("*").eq("case_id", caseId);
      const complaints: Complaint[] = (complaintRows || []).map((r: any) => ({
        ...r,
        reported_amount: parseFloat(r.reported_amount)
      }));

      const risk_evaluation = await evaluateCaseFinancialRisk(caseId, supabase);

      const caseDetail: CaseDetail = {
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        total_amount_lost: parseFloat(c.total_amount_lost),
        created_at: c.created_at,
        status: c.status,
        complaints,
        primary_mule_account: c.primary_mule_account,
        primary_mule_upi: c.primary_mule_upi,
        risk_evaluation
      };

      return new Response(JSON.stringify(caseDetail), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Case service error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
