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
    const newStatus = body.status; // 'verified' or 'rejected'
    const notes = body.notes || "";

    if (!["verified", "rejected"].includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'verified' or 'rejected'." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    // Call stored procedure or direct update
    const { data, error } = await supabaseAdmin.rpc("verify_payment", {
      p_application_id: id,
      p_new_payment_status: newStatus,
      p_admin_user_id: admin.userId,
      p_admin_email: admin.email,
      p_notes: notes || null,
    });

    if (error) {
      console.warn("Verify payment RPC notice, running direct update fallback:", error);

      const { data: existingApp } = await supabaseAdmin
        .from("delegate_applications")
        .select("payment_status")
        .eq("id", id)
        .maybeSingle();

      const { error: appUpdateError } = await supabaseAdmin
        .from("delegate_applications")
        .update({
          payment_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (appUpdateError) {
        return NextResponse.json(
          { error: "Failed to update application payment status." },
          { status: 500 }
        );
      }

      await supabaseAdmin
        .from("payment_verifications")
        .update({
          verification_status: newStatus,
          verified_by: admin.userId,
          verified_at: new Date().toISOString(),
          admin_notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("application_id", id);

      try {
        await supabaseAdmin.from("admin_audit_logs").insert({
          admin_user_id: admin.userId,
          admin_email: admin.email,
          application_id: id,
          action: `payment_${newStatus}`,
          old_status: existingApp?.payment_status || "pending",
          new_status: newStatus,
          notes: notes || `Payment ${newStatus} by organizer`,
        });
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      payment_status: newStatus,
      message: `Payment status updated to ${newStatus}.`,
    });
  } catch (err) {
    console.error("Verify payment API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
