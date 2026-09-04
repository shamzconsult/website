import { NextResponse } from "next/server";

import { requireAdmin } from "@/mentorship/lib/admin-session";
import { PROGRAM_SUMMARY, buildOverview } from "@/mentorship/lib/overview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const overview = await buildOverview();

  return NextResponse.json(
    { ...overview, program: PROGRAM_SUMMARY },
    { status: overview.ok ? 200 : 502 },
  );
}
