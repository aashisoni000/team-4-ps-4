import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    available: false,
    services: [],
    message: "Live service-status data is not included in the PS4 helpdesk seed.",
  });
}
