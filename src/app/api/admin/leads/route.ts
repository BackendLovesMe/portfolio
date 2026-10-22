import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error, count } = await supabase
      .from("portfolio_leads")
      .select("id, name, email, reason, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Admin leads query failed:", error.code || "unknown database error");
      return NextResponse.json({ error: "Could not load registrations." }, { status: 500 });
    }
    return NextResponse.json({ leads: data ?? [], total: count ?? 0 });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
}
