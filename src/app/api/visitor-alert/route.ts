import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type VisitPayload = { path?: unknown; source?: unknown };

// Best-effort per-instance throttling. For a high-traffic site, replace with a shared rate limiter.
const recentRequests = new Map<string, number>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.PORTFOLIO_ALERT_EMAIL;
  const siteUrl = process.env.SITE_URL;

  if (!resendApiKey || !from || !to) {
    return jsonError("Visitor alerts are not configured.", 503);
  }

  // In production, set SITE_URL to the exact deployed origin, e.g. https://example.vercel.app.
  const origin = request.headers.get("origin");
  if (siteUrl && origin) {
    try {
      if (new URL(origin).origin !== new URL(siteUrl).origin) {
        return jsonError("Origin not allowed.", 403);
      }
    } catch {
      return jsonError("Invalid origin.", 403);
    }
  }

  // Don't persist or include visitor IP addresses in alerts. This is only best-effort abuse control.
  const throttleKey = request.headers.get("x-vercel-id") || origin || "unknown-origin";
  const now = Date.now();
  const previous = recentRequests.get(throttleKey);
  if (previous && now - previous < WINDOW_MS) {
    const countKey = `${throttleKey}:${Math.floor(now / WINDOW_MS)}`;
    const count = recentRequests.get(countKey) || 0;
    if (count >= MAX_PER_WINDOW) return jsonError("Rate limit exceeded.", 429);
    recentRequests.set(countKey, count + 1);
  } else {
    recentRequests.set(throttleKey, now);
    recentRequests.set(`${throttleKey}:${Math.floor(now / WINDOW_MS)}`, 1);
  }

  let payload: VisitPayload;
  try {
    payload = (await request.json()) as VisitPayload;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const path = typeof payload.path === "string" ? payload.path.slice(0, 120) : "/";
  const source = typeof payload.source === "string" ? payload.source.slice(0, 100) : "Direct / unknown";
  // Only accept a path, hostname and timestamp; don't send full referrer URLs or personal data.
  const timestamp = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short",
  }).format(new Date());

  const text = `Portfolio visitor\nPage: ${path}\nTime: ${timestamp} IST\nSource: ${source}`;
  try {
    const { error } = await new Resend(resendApiKey).emails.send({
      from,
      to,
      subject: "Portfolio visitor",
      text,
    });
    if (error) {
      console.error("Visitor alert email failed:", error.name, error.message);
      return jsonError("Email provider rejected the alert. Check server logs and Resend configuration.", 502);
    }
  } catch {
    return jsonError("Could not reach the email provider.", 502);
  }

  return NextResponse.json({ ok: true });
}
