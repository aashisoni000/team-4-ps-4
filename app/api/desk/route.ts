import { NextResponse } from "next/server";
import { z } from "zod";
import {
  addHours,
  formatIST,
  formatISTHour,
  slaText,
  TICKET_STATUSES,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/deskbot";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const priorityOrder: Record<TicketPriority, number> = { P1: 0, P2: 1, P3: 2, P4: 3 };
const allowedNextStatuses: Partial<Record<TicketStatus, readonly TicketStatus[]>> = {
  open: ["in_progress"],
  in_progress: ["resolved", "waiting_for_user"],
  waiting_for_user: ["in_progress", "resolved"],
  resolved: ["closed"],
};
const updateSchema = z.object({
  ticket_id: z.number().int().positive(),
  status: z.enum(TICKET_STATUSES),
});

function isActive(status: string): boolean {
  return ["open", "in_progress", "waiting_for_user"].includes(status);
}

function isTodayInIndia(iso: string, today: string): boolean {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(iso)) === today;
}

export async function GET() {
  const supabase = getSupabase();
  const now = new Date();
  const minutesUntilIstHour = (now.getUTCMinutes() + 30) % 60;
  const istHourBoundary = new Date(
    now.getTime() -
      minutesUntilIstHour * 60_000 -
      now.getUTCSeconds() * 1000 -
      now.getUTCMilliseconds()
  );
  const hourlyStart = new Date(istHourBoundary.getTime() - 11 * 60 * 60 * 1000);
  const [{ data: tickets, error: ticketError }, { data: rules, error: ruleError }, { data: recentTickets, error: recentError }] = await Promise.all([
    supabase
      .from("tickets")
      .select("id, employee_id, title, description, category, priority, team_id, status, created_at, updated_at, employees(name, department, location), support_teams(name)")
      .in("status", ["open", "in_progress", "waiting_for_user", "resolved"])
      .order("created_at", { ascending: false }),
    supabase.from("sla_rules").select("priority, response_hours, resolve_hours"),
    supabase.from("tickets").select("created_at").gte("created_at", hourlyStart.toISOString()),
  ]);
  if (ticketError) {
    console.error("[api/desk] Ticket query failed", ticketError);
    return NextResponse.json({ error: ticketError.message }, { status: 500 });
  }
  if (ruleError) {
    console.error("[api/desk] SLA query failed", ruleError);
    return NextResponse.json({ error: ruleError.message }, { status: 500 });
  }
  if (recentError) {
    console.error("[api/desk] Recent ticket query failed", recentError);
    return NextResponse.json({ error: recentError.message }, { status: 500 });
  }

  const rulesByPriority = new Map(rules.map((rule) => [rule.priority, rule]));
  const shapedTickets = tickets.map((ticket) => {
    const rule = rulesByPriority.get(ticket.priority);
    const slaDueAt = rule ? addHours(ticket.created_at, rule.resolve_hours) : null;
    const employee = Array.isArray(ticket.employees) ? ticket.employees[0] : ticket.employees;
    const team = Array.isArray(ticket.support_teams) ? ticket.support_teams[0] : ticket.support_teams;
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      employee: employee?.name ?? "Unknown employee",
      department: employee?.department ?? "Unknown department",
      location: employee?.location ?? null,
      team: team?.name ?? "Unassigned team",
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
      sla_due_at: slaDueAt,
      sla_due: slaDueAt ? formatIST(slaDueAt) : null,
      sla_text: slaDueAt && isActive(ticket.status) ? slaText(slaDueAt) : null,
      breached: Boolean(slaDueAt && isActive(ticket.status) && Date.parse(slaDueAt) < now.getTime()),
    };
  });
  shapedTickets.sort(
    (a, b) =>
      (priorityOrder[a.priority as TicketPriority] ?? 4) - (priorityOrder[b.priority as TicketPriority] ?? 4) ||
      Date.parse(a.sla_due_at ?? a.created_at) - Date.parse(b.sla_due_at ?? b.created_at)
  );

  const hourly = Array.from({ length: 12 }, (_, index) => {
    const bucketStart = new Date(hourlyStart.getTime() + index * 60 * 60 * 1000);
    const bucketEnd = new Date(bucketStart.getTime() + 60 * 60 * 1000);
    return {
      label: formatISTHour(bucketStart),
      count: recentTickets.filter((ticket) => {
        const createdAt = Date.parse(ticket.created_at);
        return createdAt >= bucketStart.getTime() && createdAt < bucketEnd.getTime();
      }).length,
    };
  });

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
  const kpis = {
    open: tickets.filter((ticket) => ticket.status === "open").length,
    in_progress: tickets.filter((ticket) => ["in_progress", "waiting_for_user"].includes(ticket.status)).length,
    breached: shapedTickets.filter((ticket) => ticket.breached).length,
    resolved_today: tickets.filter(
      (ticket) => ticket.status === "resolved" && isTodayInIndia(ticket.updated_at, today)
    ).length,
  };

  return NextResponse.json({ tickets: shapedTickets, kpis, hourly, service_status_available: false });
}

export async function POST(request: Request) {
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ticket update", details: parsed.error.issues }, { status: 400 });
  }

  const { ticket_id, status } = parsed.data;
  const { data: current, error: readError } = await getSupabase()
    .from("tickets")
    .select("status")
    .eq("id", ticket_id)
    .maybeSingle();
  if (readError) {
    console.error("[api/desk] Ticket status query failed", readError);
    return NextResponse.json({ error: readError.message }, { status: 500 });
  }
  if (!current) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const previousStatus = current.status as TicketStatus;
  if (!allowedNextStatuses[previousStatus]?.includes(status)) {
    return NextResponse.json({ error: `Ticket cannot move from ${previousStatus} to ${status}` }, { status: 409 });
  }

  const { data: updated, error: updateError } = await getSupabase()
    .from("tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticket_id)
    .eq("status", previousStatus)
    .select("id, status, updated_at")
    .maybeSingle();
  if (updateError) {
    console.error("[api/desk] Ticket update failed", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  if (!updated) return NextResponse.json({ error: "Ticket was already updated" }, { status: 409 });

  return NextResponse.json({ ticket: updated });
}
