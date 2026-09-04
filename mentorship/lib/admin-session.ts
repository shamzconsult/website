import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_COOKIE, isValidSessionToken } from "@/mentorship/lib/admin-auth";

/** True when the caller holds a valid, unexpired organiser session. */
export async function hasAdminSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(ADMIN_COOKIE)?.value);
}

/**
 * Guard for /api/admin/* handlers. Returns a 401 response to return early
 * with, or null when the caller is signed in.
 *
 * Proxy already redirects unauthenticated *page* requests, but the API routes
 * check for themselves — the data should never depend on a single gate.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await hasAdminSession()) return null;
  return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
}
