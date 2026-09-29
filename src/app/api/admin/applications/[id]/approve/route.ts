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
    const newStatus = body.status; // 'approved' or 'rejected'
    const notes = body.notes || "";

    if (!["approved", "rejected"].includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'approved' or 'rejected'." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    if (newStatus === "approved") {
      // Call procedure to assign delegate ID and approve
      const { data, error } = await supabaseAdmin.rpc("approve_delegate_application", {
        p_application_id: id,
        p_admin_user_id: admin.userId,
        p_admin_email: admin.email,
      });

      if (error) {
        console.error("Approve error:", error);
        return NextResponse.json(
          { error: error.message || "Failed to approve application." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        application_status: "approved",
        delegate_id: data?.delegate_id,
        message: "Application approved and Delegate ID assigned.",
      });
    } else {
      // Reject application
      const { data: currentApp } = await supabaseAdmin
        .from("delegate_applications")
        .select("application_status")
        .eq("id", id)
        .single();

      const { error: updateError } = await supabaseAdmin
        .from("delegate_applications")
        .update({
          application_status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update application status." },
          { status: 500 }
        );
      }

      // Audit log
      await supabaseAdmin.from("admin_audit_logs").insert({
        admin_user_id: admin.userId,
        admin_email: admin.email,
        application_id: id,
        action: "application_rejected",
        old_status: currentApp?.application_status || "submitted",
        new_status: "rejected",
        notes: notes || "Application rejected by organizer",
      });

      return NextResponse.json({
        success: true,
        application_status: "rejected",
        message: "Application rejected.",
      });
    }
  } catch (err) {
    console.error("Approve API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
