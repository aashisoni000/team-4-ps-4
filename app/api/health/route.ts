import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/health  -> shows which settings are missing (never shows the values). */
export async function GET() {
  const names = ["GEMINI_API_KEY", "SUPABASE_URL", "SUPABASE_SECRET_KEY", "APP_PASSCODE"];
  const settings = Object.fromEntries(names.map((n) => [n, Boolean(process.env[n]?.trim())]));
  let databaseCheck: "ok" | "error" | "not_configured" = "not_configured";
  let databaseError: string | undefined;

  if (settings.SUPABASE_URL && settings.SUPABASE_SECRET_KEY) {
    try {
      const { error } = await getSupabase().from("kb_articles").select("id", { head: true, count: "exact" });
      if (error) {
        databaseCheck = "error";
        databaseError = error.message;
      } else {
        databaseCheck = "ok";
      }
    } catch (error) {
      databaseCheck = "error";
      databaseError = error instanceof Error ? error.message : "Database check failed";
      console.error("[health] Database check failed", error);
    }
  }

  const ok = Object.values(settings).every(Boolean) && databaseCheck === "ok";
  return NextResponse.json(
    { ok, settings, databaseCheck, ...(databaseError ? { databaseError } : {}) },
    { status: ok ? 200 : 503 }
  );
}
