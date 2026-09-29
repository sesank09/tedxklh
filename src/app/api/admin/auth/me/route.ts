import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";

export async function GET() {
  const admin = await verifyAdminSession();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    admin,
  });
}
