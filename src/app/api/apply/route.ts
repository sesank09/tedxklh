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
    const rawPassType = (formData.get("passType") as string || "individual").trim();
    const passType = rawPassType === "group_of_4" ? "group_of_4" : "individual";
    const totalAmount = passType === "group_of_4" ? 1999 : 549;
    const ticketCount = passType === "group_of_4" ? 4 : 1;

    // Parse and validate group members if group pass
    let groupMembers: Array<{ name: string; email: string; phone: string }> = [];
    if (passType === "group_of_4") {
      const rawGroupMembers = formData.get("groupMembers") as string;
      if (rawGroupMembers) {
        try {
          const parsed = JSON.parse(rawGroupMembers);
          if (Array.isArray(parsed)) {
            groupMembers = parsed.map((m: any) => ({
              name: String(m.name || "").trim(),
              email: String(m.email || "").trim().toLowerCase(),
              phone: String(m.phone || "").replace(/\D/g, ""),
            }));
          }
        } catch (e) {
          return NextResponse.json(
            { error: "Invalid group members format." },
            { status: 400 }
          );
        }
      }

      if (groupMembers.length !== 3) {
        return NextResponse.json(
          { error: "Group pass requires exactly 3 additional group members (squad of 4 total)." },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (let i = 0; i < groupMembers.length; i++) {
        const member = groupMembers[i];
        if (!member.name) {
          return NextResponse.json(
            { error: `Group member #${i + 2} name is required.` },
            { status: 400 }
          );
        }
        if (!member.email || !emailRegex.test(member.email)) {
          return NextResponse.json(
            { error: `Group member #${i + 2} valid email is required.` },
            { status: 400 }
          );
        }
        if (!member.phone || member.phone.length < 10) {
          return NextResponse.json(
            { error: `Group member #${i + 2} valid 10-digit phone number is required.` },
            { status: 400 }
          );
        }
      }
    }

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

    const validMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/pjpeg", "image/heic", "image/heif"];
    const fileExt = screenshot.name.split(".").pop()?.toLowerCase() || "jpg";
    const validExtensions = ["png", "jpg", "jpeg", "webp", "heic", "heif"];

    const isValidType = validMimeTypes.includes(screenshot.type.toLowerCase()) || validExtensions.includes(fileExt);

    if (!isValidType) {
      return NextResponse.json(
        { error: "Payment screenshot must be an image file (JPG, PNG, or WEBP)." },
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

    // 7. Atomic Application & Payment Record Creation via Database Function (with Direct Fallback)
    let appNumber = "TEDXKLH-SUBMITTED";
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
         p_pass_type: passType,
         p_total_amount: totalAmount,
         p_ticket_count: ticketCount,
         p_group_members: groupMembers,
       }
     );

     if (rpcError) {
       console.warn("RPC submit_delegate_application notice, attempting direct insert fallback:", rpcError);

       if (rpcError.code === "23505" || rpcError.message?.includes("already exists")) {
         if (uploadedFilePath) {
           await supabaseAdmin.storage
             .from("payment-screenshots")
             .remove([uploadedFilePath])
             .catch(() => {});
         }
         return NextResponse.json(
           { error: rpcError.message || "An application with this email or UTR already exists." },
           { status: 409 }
         );
       }

       // Direct fallback insert
       const generatedNum = `TEDXKLH-${String(Date.now()).slice(-4)}`;
       const { data: directApp, error: directAppError } = await supabaseAdmin
         .from("delegate_applications")
         .insert({
           application_number: generatedNum,
           first_name: firstName,
           last_name: lastName,
           email: email,
           phone: phone,
           college_organization: organization,
           city: city,
           pass_type: passType,
           ticket_count: ticketCount,
           total_amount: totalAmount,
           group_members: groupMembers,
           application_status: "submitted",
           payment_status: "pending",
         })
         .select("id, application_number")
         .single();

       if (directAppError || !directApp) {
         console.error("Direct fallback app insert error:", directAppError);
         if (uploadedFilePath) {
           await supabaseAdmin.storage
             .from("payment-screenshots")
             .remove([uploadedFilePath])
             .catch(() => {});
         }
         return NextResponse.json(
           { error: directAppError?.message || "Unable to submit your application. Please try again later." },
           { status: 500 }
         );
       }

       const { error: directPayError } = await supabaseAdmin
         .from("payment_verifications")
         .insert({
           application_id: directApp.id,
           utr_number: utrNumber,
           screenshot_path: storagePath,
           verification_status: "pending",
         });

       if (directPayError) {
         console.error("Direct fallback payment insert error:", directPayError);
       }

       appNumber = directApp.application_number;
     } else {
       appNumber = rpcResult?.application_number || `TEDXKLH-${String(Date.now()).slice(-4)}`;
     }

     return NextResponse.json({
       success: true,
       application_number: appNumber,
       pass_type: passType,
       total_amount: totalAmount,
       ticket_count: ticketCount,
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
