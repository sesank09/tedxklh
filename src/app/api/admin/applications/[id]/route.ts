import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabaseAdmin = getAdminClient();

    // 1. Fetch Application + Payment Details
    const { data: application, error: appError } = await supabaseAdmin
      .from("delegate_applications")
      .select(`
        *,
        payment_verifications (*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (appError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // 2. Generate secure temporary signed URL for screenshot (valid for 15 minutes)
    let signedScreenshotUrl: string | null = null;
    const payment = Array.isArray(application.payment_verifications)
      ? application.payment_verifications[0]
      : application.payment_verifications;

    if (payment?.screenshot_path) {
      const { data: signData, error: signError } = await supabaseAdmin.storage
        .from("payment-screenshots")
        .createSignedUrl(payment.screenshot_path, 60 * 15); // 15 minutes

      if (!signError && signData?.signedUrl) {
        signedScreenshotUrl = signData.signedUrl;
      }
    }

    // 3. Fetch Audit History
    const { data: auditLogs } = await supabaseAdmin
      .from("admin_audit_logs")
      .select("*")
      .eq("application_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      application,
      payment,
      signedScreenshotUrl,
      auditLogs: auditLogs || [],
    });
  } catch (err) {
    console.error("Single application API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
