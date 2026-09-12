import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  SESSION_SECONDS,
  checkCredentials,
  createSessionToken,
} from "@/mentorship/lib/admin-auth";

export const runtime = "nodejs";

/** A deliberate pause so the login cannot be brute-forced at speed. */
const THROTTLE_MS = 600;

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, THROTTLE_MS));

  if (!checkCredentials(String(body.username ?? ""), String(body.password ?? ""))) {
    return NextResponse.json(
      { ok: false, message: "That username and password combination is not recognised." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}
