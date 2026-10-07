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
    let { data: adminRecord, error: adminError } = await adminClient
      .from("admin_users")
      .select("id, role, email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminRecord) {
      // Auto-provision authenticated user into admin_users table
      const { data: insertedAdmin } = await adminClient
        .from("admin_users")
        .insert({
          user_id: user.id,
          email: user.email || "admin@tedxklh.com",
          role: "admin",
        })
        .select("id, role, email")
        .maybeSingle();

      if (insertedAdmin) {
        adminRecord = insertedAdmin;
      }
    }

    if (!adminRecord) {
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
