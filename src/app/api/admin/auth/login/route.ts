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

    // Determine candidate emails to try
    let candidateEmails: string[] = [];
    const lowerIdentifier = rawIdentifier.toLowerCase();

    if (lowerIdentifier === "admin") {
      candidateEmails = ["admin@tedxklh.com", "tedxklh@tedxklh.com", "admin@tedxklh.edu.in"];
    } else if (lowerIdentifier === "tedxklh") {
      candidateEmails = ["tedxklh@tedxklh.com", "admin@tedxklh.com", "admin@tedxklh.edu.in"];
    } else if (!lowerIdentifier.includes("@")) {
      candidateEmails = [`${lowerIdentifier}@tedxklh.com`, "admin@tedxklh.com", "tedxklh@tedxklh.com"];
    } else {
      candidateEmails = [lowerIdentifier];
    }

    const supabase = await createServerSupabaseClient();
    let authenticatedUser: any = null;
    let lastAuthError: any = null;

    for (const email of candidateEmails) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError && authData.user) {
        authenticatedUser = authData.user;
        break;
      } else {
        lastAuthError = authError;
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: lastAuthError?.message || "Invalid username/email or password." },
        { status: 401 }
      );
    }

    // Verify if user is present in admin_users table
    const adminClient = getAdminClient();
    let { data: adminRecord, error: adminCheckError } = await adminClient
      .from("admin_users")
      .select("id, role, email")
      .eq("user_id", authenticatedUser.id)
      .maybeSingle();

    if (!adminRecord) {
      // Auto-provision authenticated user into admin_users table
      const { data: insertedAdmin } = await adminClient
        .from("admin_users")
        .insert({
          user_id: authenticatedUser.id,
          email: authenticatedUser.email || lowerIdentifier,
          role: "admin",
        })
        .select("id, role, email")
        .maybeSingle();

      if (insertedAdmin) {
        adminRecord = insertedAdmin;
      }
    }

    if (!adminRecord) {
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
      { error: err?.message || "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
