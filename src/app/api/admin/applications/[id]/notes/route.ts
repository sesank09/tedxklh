import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const notes = body.notes || "";

    const supabaseAdmin = getAdminClient();

    const { error: updateError } = await supabaseAdmin
      .from("delegate_applications")
      .update({
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update admin notes." },
        { status: 500 }
      );
    }

    // Audit log
    await supabaseAdmin.from("admin_audit_logs").insert({
      admin_user_id: admin.userId,
      admin_email: admin.email,
      application_id: id,
      action: "admin_notes_updated",
      notes: "Admin notes updated",
    });

    return NextResponse.json({
      success: true,
      message: "Admin notes updated successfully.",
    });
  } catch (err) {
    console.error("Admin notes API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
