import { NextResponse } from "next/server";
import { addHours, CURRENT_EMPLOYEE_ID, formatIST, slaText } from "@/lib/deskbot";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabase();
  const [
    { data: employee, error: employeeError },
    { data: tickets, error: ticketsError },
    { data: activeTickets, error: activeTicketsError },
    { data: rules, error: rulesError },
  ] =
    await Promise.all([
      supabase.from("employees").select("id, name, email, department, location, laptop_model").eq("id", CURRENT_EMPLOYEE_ID).single(),
      supabase
        .from("tickets")
        .select("id, title, description, category, priority, status, created_at, updated_at, team_id, support_teams(name)")
        .eq("employee_id", CURRENT_EMPLOYEE_ID)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("tickets")
        .select("id, title, description, category, priority, status, created_at, updated_at, team_id, support_teams(name)")
        .eq("employee_id", CURRENT_EMPLOYEE_ID)
        .in("status", ["open", "in_progress", "waiting_for_user"])
        .order("created_at", { ascending: false }),
      supabase.from("sla_rules").select("priority, response_hours, resolve_hours"),
    ]);

  if (employeeError) {
    console.error("[api/me] Employee query failed", employeeError);
    return NextResponse.json({ error: employeeError.message }, { status: 500 });
  }
  if (ticketsError) {
    console.error("[api/me] Tickets query failed", ticketsError);
    return NextResponse.json({ error: ticketsError.message }, { status: 500 });
  }
  if (activeTicketsError) {
    console.error("[api/me] Active tickets query failed", activeTicketsError);
    return NextResponse.json({ error: activeTicketsError.message }, { status: 500 });
  }
  if (rulesError) {
    console.error("[api/me] SLA rules query failed", rulesError);
    return NextResponse.json({ error: rulesError.message }, { status: 500 });
  }

  const slaByPriority = new Map(rules.map((rule) => [rule.priority, rule]));
  const shapeTicket = (ticket: (typeof tickets)[number]) => {
    const rule = slaByPriority.get(ticket.priority);
    const slaDueAt = rule ? addHours(ticket.created_at, rule.resolve_hours) : null;
    const team = Array.isArray(ticket.support_teams) ? ticket.support_teams[0] : ticket.support_teams;
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      team: team?.name ?? null,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
      sla_due_at: slaDueAt,
      sla_due: slaDueAt ? formatIST(slaDueAt) : null,
      sla_text: slaDueAt && ["open", "in_progress", "waiting_for_user"].includes(ticket.status)
        ? slaText(slaDueAt)
        : null,
    };
  };
  const shapedTickets = tickets.map(shapeTicket);
  const shapedActiveTickets = activeTickets.map(shapeTicket);
  const nextSla = shapedActiveTickets
    .filter((ticket) => ticket.sla_due_at)
    .sort((a, b) => Date.parse(a.sla_due_at!) - Date.parse(b.sla_due_at!))[0];

  return NextResponse.json({
    employee,
    tickets: shapedTickets.slice(0, 5),
    active_count: activeTickets.length,
    next_sla: nextSla
      ? {
          id: nextSla.id,
          title: nextSla.title,
          team: nextSla.team,
          created_at: nextSla.created_at,
          sla_due_at: nextSla.sla_due_at,
          sla_due: nextSla.sla_due,
        }
      : null,
    device_inventory_available: false,
  });
}
