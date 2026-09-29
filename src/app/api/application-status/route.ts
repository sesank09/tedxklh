import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const phoneRaw = (body.phone || "").replace(/\D/g, "");

    if (!email || !phoneRaw) {
      return NextResponse.json(
        { error: "Both Email Address and 10-digit Mobile Number are required." },
        { status: 400 }
      );
    }

    const cleanPhone = phoneRaw.length > 10 ? phoneRaw.slice(-10) : phoneRaw;

    const supabaseAdmin = getAdminClient();

    // Query by email and match phone
    const { data: applications, error } = await supabaseAdmin
      .from("delegate_applications")
      .select("application_number, first_name, email, phone, application_status, payment_status, delegate_id, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Status lookup error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve application status." },
        { status: 500 }
      );
    }

    // Match phone number (either exact match or last 10 digits)
    const matchedApp = applications?.find((app) => {
      const appPhoneClean = (app.phone || "").replace(/\D/g, "");
      const appLast10 = appPhoneClean.length > 10 ? appPhoneClean.slice(-10) : appPhoneClean;
      return appPhoneClean === phoneRaw || appLast10 === cleanPhone;
    });

    if (!matchedApp) {
      return NextResponse.json(
        { error: "No matching application found for this Email and Mobile Number. Please verify your details." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: {
        application_number: matchedApp.application_number,
        first_name: matchedApp.first_name,
        application_status: matchedApp.application_status,
        payment_status: matchedApp.payment_status,
        delegate_id: matchedApp.delegate_id,
        created_at: matchedApp.created_at,
      },
    });
  } catch (err) {
    console.error("API application-status error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
