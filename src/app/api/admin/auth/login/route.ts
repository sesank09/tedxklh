import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let rawIdentifier = (body.email || body.username || body.identifier || "").trim();
    const password = body.password || "";

    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { error: "Username/Email and password are required." },
        { status: 400 }
      );
    }

    // Map username 'TedxKlh' or 'tedxklh' to the designated organizer admin account
    let emailToAuth = rawIdentifier.toLowerCase();
    if (emailToAuth === "tedxklh" || emailToAuth === "admin" || !emailToAuth.includes("@")) {
      emailToAuth = "tedxklh@tedxklh.com";
    }

    const supabase = await createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToAuth,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
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
