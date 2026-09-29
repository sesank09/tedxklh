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
      console.error("Payment verification error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update payment status." },
        { status: 500 }
      );
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
