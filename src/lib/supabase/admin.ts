import { createClient } from "@supabase/supabase-js";

function getValidSupabaseUrl(): string {
  const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim().replace(/^["']|["']$/g, '');
  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return envUrl;
  }
  return "https://wtkorkikgwwefahewbif.supabase.co";
}

function getValidServiceRoleKey(): string {
  const envKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim().replace(/^["']|["']$/g, '');
  if (envKey.length > 20) {
    return envKey;
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0a29ya2lrZ3d3ZWZhaGV3YmlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDY4NDcwNSwiZXhwIjoyMTA2MjYwNzA1fQ.D8qxJkoaTmQT0E0e1A09xniJV8a3po3YOxxHeIbw9r4";
}

/**
 * Service Role Client - STRICTLY SERVER-SIDE ONLY.
 * NEVER expose or import this file into client components.
 */
export function getAdminClient() {
  return createClient(getValidSupabaseUrl(), getValidServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}


