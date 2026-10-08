import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();
    const appStatus = searchParams.get("appStatus") || "all";
    const paymentStatus = searchParams.get("paymentStatus") || "all";
    const ticketFilter = searchParams.get("ticketFilter") || "all";
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10)));
    const offset = (page - 1) * limit;

    const supabaseAdmin = getAdminClient();

    let query = supabaseAdmin
      .from("delegate_applications")
      .select(`
        id,
        application_number,
        first_name,
        last_name,
        email,
        phone,
        college_organization,
        city,
        roll_number,
        pass_type,
        ticket_type,
        ticket_price,
        ticket_count,
        total_amount,
        group_members,
        application_status,
        payment_status,
        delegate_id,
        created_at,
        updated_at,
        payment_verifications (
          id,
          utr_number,
          screenshot_path,
          verification_status
        )
      `, { count: "exact" });

    // Status Filter
    if (appStatus && appStatus !== "all") {
      query = query.eq("application_status", appStatus);
    }

    // Payment Filter
    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }

    // Ticket Tier Filter
    if (ticketFilter && ticketFilter !== "all") {
      if (ticketFilter === "individual" || ticketFilter === "549") {
        query = query.or("pass_type.eq.individual,ticket_type.ilike.%549%");
      } else if (ticketFilter === "group_of_4" || ticketFilter === "1999") {
        query = query.or("pass_type.eq.group_of_4,ticket_type.ilike.%1999%");
      }
    }

    // Comprehensive Search across Application No, First Name, Last Name, Email, Phone, Roll Number, Delegate ID, Ticket Type
    if (search) {
      query = query.or(
        `application_number.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,roll_number.ilike.%${search}%,delegate_id.ilike.%${search}%,ticket_type.ilike.%${search}%,college_organization.ilike.%${search}%`
      );
    }

    // Sorting
    if (sortBy === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (sortBy === "name") {
      query = query.order("first_name", { ascending: true });
    } else if (sortBy === "app_number") {
      query = query.order("application_number", { ascending: true });
    } else if (sortBy === "roll_number") {
      query = query.order("roll_number", { ascending: true, nullsFirst: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: applications, count, error } = await query;

    if (error) {
      console.error("Applications query error:", error);
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      applications: applications || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    console.error("Applications API error:", err);
    return NextResponse.json(
      { error: "Internal server error fetching applications" },
      { status: 500 }
    );
  }
}
