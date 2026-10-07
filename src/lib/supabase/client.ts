import { createBrowserClient } from "@supabase/ssr";

function getValidSupabaseUrl(): string {
  const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/^["']|["']$/g, '');
  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return envUrl;
  }
  return "https://wtkorkikgwwefahewbif.supabase.co";
}

function getValidAnonKey(): string {
  const envKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim().replace(/^["']|["']$/g, '');
  if (envKey.length > 20) {
    return envKey;
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0a29ya2lrZ3d3ZWZhaGV3YmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODQ3MDUsImV4cCI6MjEwNjI2MDcwNX0.bt5EFLtuBQy9wCpB93WcFSBT6R1Gv_opeIJ-bxytogg";
}

export function createClient() {
  return createBrowserClient(getValidSupabaseUrl(), getValidAnonKey());
}


