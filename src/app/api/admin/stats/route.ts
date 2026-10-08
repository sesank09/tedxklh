import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import { getAdminClient } from "@/lib/supabase/admin";
import { TOTAL_SEATS } from "@/lib/constants";

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = getAdminClient();

    // Fetch live counts and verified application financial records in parallel
    const [
      totalRes,
      pendingRes,
      verifiedPayRes,
      approvedRes,
      rejectedRes,
      verifiedAppsRes,
    ] = await Promise.all([
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }).eq("application_status", "submitted"),
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }).eq("payment_status", "verified"),
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }).eq("application_status", "approved"),
      supabaseAdmin.from("delegate_applications").select("id", { count: "exact", head: true }).eq("application_status", "rejected"),
      // Select verified purchases to authoritatively compute revenue and seat metrics
      supabaseAdmin
        .from("delegate_applications")
        .select("id, ticket_type, ticket_price, total_amount, pass_type, ticket_count, application_status")
        .eq("payment_status", "verified")
        .neq("application_status", "cancelled"),
    ]);

    let totalRevenue = 0;
    let seatsFilled = 0;
    let tickets549Sold = 0;
    let tickets549Revenue = 0;
    let tickets1999Sold = 0;
    let tickets1999Revenue = 0;

    const verifiedApps = verifiedAppsRes.data || [];

    verifiedApps.forEach((app) => {
      const isGroup = app.pass_type === "group_of_4" || (app.ticket_type && app.ticket_type.includes("1999"));
      // Authoritative ticket price from stored purchase record
      const price = Number(app.ticket_price ?? app.total_amount ?? (isGroup ? 1999 : 549));
      const seats = Number(app.ticket_count ?? (isGroup ? 4 : 1));

      totalRevenue += price;
      seatsFilled += seats;

      if (isGroup) {
        tickets1999Sold += 1;
        tickets1999Revenue += price;
      } else {
        tickets549Sold += 1;
        tickets549Revenue += price;
      }
    });

    // DO NOT clamp seatsLeft to 0: must support negative numbers when overbooked!
    const seatsLeft = TOTAL_SEATS - seatsFilled;
    const overCapacity = Math.max(0, seatsFilled - TOTAL_SEATS);

    return NextResponse.json({
      success: true,
      stats: {
        total: totalRes.count || 0,
        pending: pendingRes.count || 0,
        verifiedPayments: verifiedPayRes.count || 0,
        approved: approvedRes.count || 0,
        rejected: rejectedRes.count || 0,
        // Capacity & Financial Metrics
        totalSeats: TOTAL_SEATS,
        seatsFilled,
        seatsLeft,
        overCapacity,
        totalRevenue,
        // Ticket Breakdown
        ticketBreakdown: {
          tickets549: {
            name: "₹549 Ticket",
            sold: tickets549Sold,
            revenue: tickets549Revenue,
          },
          tickets1999: {
            name: "₹1999 Ticket",
            sold: tickets1999Sold,
            revenue: tickets1999Revenue,
          },
        },
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
