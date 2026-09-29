import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

export interface AuthenticatedAdmin {
  userId: string;
  email: string;
  role: string;
}

export async function verifyAdminSession(): Promise<AuthenticatedAdmin | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const adminClient = getAdminClient();
    const { data: adminRecord, error: adminError } = await adminClient
      .from("admin_users")
      .select("id, role, email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email || adminRecord.email,
      role: adminRecord.role,
    };
  } catch (err) {
    console.error("Admin verification error:", err);
    return null;
  }
}
