import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const applicationNumber = (body.applicationNumber || "").trim().toUpperCase();
    const email = (body.email || "").trim().toLowerCase();

    if (!applicationNumber || !email) {
      return NextResponse.json(
        { error: "Both Application Number and Email Address are required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    const { data: application, error } = await supabaseAdmin
      .from("delegate_applications")
      .select("application_number, first_name, application_status, payment_status, delegate_id, created_at")
      .eq("application_number", applicationNumber)
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Status lookup error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve application status." },
        { status: 500 }
      );
    }

    if (!application) {
      return NextResponse.json(
        { error: "No matching application found with the provided details. Please verify your Application ID and Email." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (err) {
    console.error("API application-status error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
