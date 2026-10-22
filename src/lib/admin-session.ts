import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "portfolio_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = String(expires);
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_MAX_AGE_SECONDS };
}

export function isAdminRequest(request: NextRequest) {
  try {
    const value = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!value) return false;
    const [expires, signature, extra] = value.split(".");
    if (!expires || !signature || extra) return false;
    if (!/^\d+$/.test(expires) || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
    const expected = Buffer.from(sign(expires));
    const actual = Buffer.from(signature);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function passwordMatches(input: string, expected: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
