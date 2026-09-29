import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  let uploadedFilePath: string | null = null;
  let supabaseAdmin: ReturnType<typeof getAdminClient> | null = null;

  try {
    const formData = await req.formData();

    const firstName = (formData.get("firstName") as string || "").trim();
    const lastName = (formData.get("lastName") as string || "").trim();
    const email = (formData.get("email") as string || "").trim().toLowerCase();
    const phone = (formData.get("phone") as string || "").replace(/\D/g, "");
    const organization = (formData.get("organization") as string || "").trim();
    const city = (formData.get("city") as string || "").trim();
    const utrNumber = (formData.get("utrNumber") as string || "").replace(/\D/g, "");
    const screenshot = formData.get("screenshot") as File | null;

    // 1. Validate required fields
    if (!firstName) {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid official email address." },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    if (!organization) {
      return NextResponse.json(
        { error: "College / University or Organization is required." },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        { error: "City is required." },
        { status: 400 }
      );
    }

    // 2. Strict 12-digit UTR validation
    if (!utrNumber || !/^\d{12}$/.test(utrNumber)) {
      return NextResponse.json(
        { error: "UTR Number must be exactly 12 numeric digits." },
        { status: 400 }
      );
    }

    // 3. Validate Screenshot File
    if (!screenshot || !(screenshot instanceof File)) {
      return NextResponse.json(
        { error: "Payment screenshot upload is required." },
        { status: 400 }
      );
    }

    const validMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validMimeTypes.includes(screenshot.type)) {
      return NextResponse.json(
        { error: "Payment screenshot must be a JPG or PNG image." },
        { status: 400 }
      );
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (screenshot.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "Payment screenshot file size exceeds the 5 MB limit." },
        { status: 400 }
      );
    }

    // 4. Initialize Admin Client
    supabaseAdmin = getAdminClient();

    // 5. Pre-check for duplicate UTR and Email
    const { data: existingUtr } = await supabaseAdmin
      .from("payment_verifications")
      .select("id")
      .eq("utr_number", utrNumber)
      .maybeSingle();

    if (existingUtr) {
      return NextResponse.json(
        { error: "An application with this UTR already exists." },
        { status: 409 }
      );
    }

    const { data: existingEmail } = await supabaseAdmin
      .from("delegate_applications")
      .select("id, application_status")
      .eq("email", email)
      .in("application_status", ["submitted", "under_review", "approved"])
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { error: "An active application already exists for this email address." },
        { status: 409 }
      );
    }

    // 6. Upload Screenshot to Private Storage Bucket
    const fileExt = screenshot.name.split(".").pop()?.toLowerCase() || "jpg";
    const tempId = crypto.randomUUID();
    const storagePath = `${tempId}/payment-${Date.now()}.${fileExt}`;
    const fileBuffer = Buffer.from(await screenshot.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("payment-screenshots")
      .upload(storagePath, fileBuffer, {
        contentType: screenshot.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Unable to upload payment proof. Please try again." },
        { status: 500 }
      );
    }

    uploadedFilePath = storagePath;

    // 7. Atomic Application & Payment Record Creation via Database Function
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc(
      "submit_delegate_application",
      {
        p_first_name: firstName,
        p_last_name: lastName,
        p_email: email,
        p_phone: phone,
        p_organization: organization,
        p_city: city,
        p_utr_number: utrNumber,
        p_screenshot_path: storagePath,
      }
    );

    if (rpcError) {
      console.error("Database submission error:", rpcError);

      // Rollback uploaded file if DB call fails
      if (uploadedFilePath) {
        await supabaseAdmin.storage
          .from("payment-screenshots")
          .remove([uploadedFilePath])
          .catch(() => {});
      }

      if (rpcError.code === "23505" || rpcError.message?.includes("already exists")) {
        return NextResponse.json(
          { error: rpcError.message || "An application with this email or UTR already exists." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Unable to submit your application. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      application_number: rpcResult?.application_number || "TEDXKLH-SUBMITTED",
      message: "Application submitted successfully.",
    });
  } catch (err: any) {
    console.error("API Apply error:", err);

    // Rollback file if created
    if (uploadedFilePath && supabaseAdmin) {
      await supabaseAdmin.storage
        .from("payment-screenshots")
        .remove([uploadedFilePath])
        .catch(() => {});
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while processing your application." },
      { status: 500 }
    );
  }
}
