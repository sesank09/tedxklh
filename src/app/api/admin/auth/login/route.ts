import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify if user is present in admin_users table
    const adminClient = getAdminClient();
    const { data: adminRecord, error: adminCheckError } = await adminClient
      .from("admin_users")
      .select("id, role, email")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (adminCheckError || !adminRecord) {
      // User is authenticated in Supabase Auth but not an authorized organizer
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Access denied. You do not have administrative privileges." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: adminRecord.id,
        email: adminRecord.email,
        role: adminRecord.role,
      },
      message: "Admin authentication successful.",
    });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
