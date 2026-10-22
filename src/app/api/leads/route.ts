import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

export const runtime = "nodejs";

const allowedReasons = new Set(["Recruitment", "Networking", "Engineering", "Other"]);

function sameSite(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Allow requests without an Origin header, as before.
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",", 1)[0].trim();
    const host = forwardedHost || request.headers.get("host");
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0].trim();
    const protocol = forwardedProtocol || new URL(request.url).protocol.slice(0, -1);

    return host !== null
      && originUrl.host.toLowerCase() === host.toLowerCase()
      && originUrl.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameSite(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot field: bots often fill hidden inputs. Return a generic success without saving.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const reason = typeof body.reason === "string" ? body.reason : "";
  const consent = body.consent === true;

  if (name.length < 1 || name.length > 100) {
    return NextResponse.json({ error: "Please enter a name (up to 100 characters)." }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!allowedReasons.has(reason)) {
    return NextResponse.json({ error: "Please select a reason for visiting." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: "Please confirm consent before submitting." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("portfolio_leads").insert({
      name, email, reason, consent: true,
    });

    if (error?.code === "23505") {
      return NextResponse.json({ error: "This email is already registered. Thanks for stopping by!" }, { status: 409 });
    }
    if (error) {
      console.error("Lead submission failed:", error.code || "unknown database error");
      return NextResponse.json({ error: "We couldn't save your details right now. Please try again later." }, { status: 500 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.PORTFOLIO_ALERT_EMAIL;
    if (resendApiKey && from && to) {
      try {
        const { error: emailError } = await new Resend(resendApiKey).emails.send({
          from,
          to,
          subject: "New portfolio connection",
          text: `A new portfolio connection was submitted.\n\nName: ${name}\nEmail: ${email}\nReason: ${reason}`,
          replyTo: email,
        });
        if (emailError) console.error("Lead notification email failed:", emailError.name, emailError.message);
      } catch (emailError) {
        console.error("Lead notification email failed:", emailError instanceof Error ? emailError.message : "unknown error");
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Lead collection is not configured yet. Please try again later." }, { status: 503 });
  }
}
