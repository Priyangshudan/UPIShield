import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getSupabaseClient } from "../_shared/supabaseClient.ts";
import { CashoutLocation } from "../_shared/types.ts";

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabase = getSupabaseClient(req);
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter((p) => p && p !== "functions" && p !== "v1" && p !== "locations");
    const city = url.searchParams.get("city");

    // Case 1: GET /locations or GET /locations?city=...
    if (req.method === "GET" && pathParts.length === 0) {
      let query = supabase.from("locations").select("*").order("historical_fraud_count", { ascending: false });
      if (city) {
        query = query.ilike("city", `%${city}%`);
      }

      const { data: rows, error } = await query;
      if (error) throw error;

      const locations: CashoutLocation[] = (rows || []).map((r: any) => ({
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

      return new Response(JSON.stringify(locations), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Case 2: GET /locations/{location_id}
    if (req.method === "GET" && pathParts.length === 1) {
      const locationId = decodeURIComponent(pathParts[0]);
      const { data: r, error } = await supabase.from("locations").select("*").eq("id", locationId).single();
      if (error || !r) {
        return new Response(JSON.stringify({ detail: `Location ${locationId} not found` }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const location: CashoutLocation = {
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
      };

      return new Response(JSON.stringify(location), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Locations service error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
