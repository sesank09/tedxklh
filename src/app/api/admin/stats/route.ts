import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = getAdminClient();

    // Fetch live statistics in parallel
    const [totalRes, pendingRes, verifiedPayRes, approvedRes, rejectedRes] = await Promise.all([
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }).eq("application_status", "submitted"),
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }).eq("payment_status", "verified"),
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }).eq("application_status", "approved"),
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }).eq("application_status", "rejected"),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: totalRes.count || 0,
        pending: pendingRes.count || 0,
        verifiedPayments: verifiedPayRes.count || 0,
        approved: approvedRes.count || 0,
        rejected: rejectedRes.count || 0,
      },
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve statistics" },
      { status: 500 }
    );
  }
}
