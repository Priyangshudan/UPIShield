import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export function getSupabaseClient(req?: Request) {
  const url = Deno.env.get("SUPABASE_URL") || Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") || "";

  if (req && req.headers.get("Authorization")) {
    const authHeader = req.headers.get("Authorization")!;
    return createClient(url, serviceKey, {
      global: { headers: { Authorization: authHeader } }
    });
  }

  return createClient(url, serviceKey);
}
