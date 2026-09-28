import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getSupabaseClient } from "../_shared/supabaseClient.ts";
import { Complaint } from "../_shared/types.ts";

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabase = getSupabaseClient(req);
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter((p) => p && p !== "functions" && p !== "v1" && p !== "complaints");
    const caseId = url.searchParams.get("case_id");

    // Case 1: GET /complaints or GET /complaints?case_id=...
    if (req.method === "GET" && pathParts.length === 0) {
      let query = supabase.from("complaints").select("*").order("reported_time", { ascending: false });
      if (caseId) {
        query = query.eq("case_id", caseId);
      }

      const { data: rows, error } = await query;
      if (error) throw error;

      const complaints: Complaint[] = (rows || []).map((r: any) => ({
        ...r,
        reported_amount: parseFloat(r.reported_amount)
      }));

      return new Response(JSON.stringify(complaints), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Case 2: GET /complaints/{complaint_id}
    if (req.method === "GET" && pathParts.length === 1) {
      const complaintId = decodeURIComponent(pathParts[0]);
      const { data: row, error } = await supabase.from("complaints").select("*").eq("id", complaintId).single();
      if (error || !row) {
        return new Response(JSON.stringify({ detail: `Complaint ${complaintId} not found` }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const complaint: Complaint = {
        ...row,
        reported_amount: parseFloat(row.reported_amount)
      };

      return new Response(JSON.stringify(complaint), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Complaints service error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
