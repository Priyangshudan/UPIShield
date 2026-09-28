import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      status: "ONLINE",
      system: "UPIShield SIH26184 Intelligence Framework",
      database: "Supabase PostgreSQL",
      version: "1.0.0"
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
});
