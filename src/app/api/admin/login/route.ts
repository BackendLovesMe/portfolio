import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, passwordMatches } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
    }
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const expected = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!expected || expected.length < 12 || typeof body.password !== "string" || !passwordMatches(body.password, expected)) {
    return NextResponse.json({ error: "Invalid password or admin configuration." }, { status: 401 });
  }

  try {
    const session = createAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: session.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Admin session is not configured securely." }, { status: 503 });
  }
}
