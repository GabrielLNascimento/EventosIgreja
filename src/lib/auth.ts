import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "agenda_admin";
const TOKEN_PAYLOAD = "authenticated";

function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "";
}

function computeToken(): string {
  return createHmac("sha256", getSecret())
    .update(TOKEN_PAYLOAD)
    .digest("hex");
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !getSecret()) return false;
  const expected = computeToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

export async function setSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, computeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
