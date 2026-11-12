"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/deskbot";

type DeskTicket = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  employee: string;
  department: string;
  location: string | null;
  team: string;
  created_at: string;
  updated_at: string;
  sla_due_at: string | null;
  sla_due: string | null;
  sla_text: string | null;
  breached: boolean;
};

type DeskData = {
  tickets: DeskTicket[];
  kpis: { open: number; in_progress: number; breached: number; resolved_today: number };
  hourly: Array<{ label: string; count: number }>;
  service_status_available: boolean;
};

const priorityClasses: Record<string, string> = {
  P1: "border-danger/50 bg-danger/10 text-danger",
  P2: "border-warn/50 bg-warn/10 text-warn",
  P3: "border-accent-2/50 bg-accent-2/10 text-accent-2",
  P4: "border-border bg-muted text-muted-foreground",
};

const priorityStripe: Record<string, string> = {
  P1: "bg-danger",
  P2: "bg-warn",
  P3: "bg-accent-2",
  P4: "bg-accent",
};

function formatClock(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function ticketAction(ticket: DeskTicket): { label: string; status: string; classes: string } | null {
  if (ticket.status === "open") return { label: "Start work", status: "in_progress", classes: "bg-accent text-background" };
  if (ticket.status === "in_progress" || ticket.status === "waiting_for_user") {
    return { label: "Mark resolved", status: "resolved", classes: "bg-accent-2 text-background" };
  }
  if (ticket.status === "resolved") {
    return { label: "Close ticket", status: "closed", classes: "border border-border bg-transparent text-foreground hover:bg-muted" };
  }
  return null;
}

export default function ITDeskPage() {
  const [data, setData] = useState<DeskData | null>(null);
  const [category, setCategory] = useState("all");
  const [clock, setClock] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [conflictId, setConflictId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/desk", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not load the IT Desk");
      setData(result);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load the IT Desk");
    }
  }, []);

  useEffect(() => {
    void load();
    const poller = window.setInterval(() => void load(), 3_000);
    const clocker = window.setInterval(() => setClock(formatClock(new Date())), 1_000);
    setClock(formatClock(new Date()));
    return () => {
      window.clearInterval(poller);
      window.clearInterval(clocker);
    };
  }, [load]);

  const visibleTickets = useMemo(
    () => (data?.tickets ?? []).filter((ticket) => category === "all" || ticket.category.toLowerCase() === category),
    [category, data]
  );
  const openTickets = visibleTickets.filter((ticket) => ticket.status === "open");
  const workingTickets = visibleTickets.filter((ticket) => ["in_progress", "waiting_for_user"].includes(ticket.status));
  const resolvedTickets = visibleTickets.filter((ticket) => ticket.status === "resolved");
  const peak = Math.max(1, ...(data?.hourly.map((bucket) => bucket.count) ?? [0]));

  async function updateTicket(ticket: DeskTicket) {
    const action = ticketAction(ticket);
    if (!action || loadingId !== null) return;
    setLoadingId(ticket.id);
    setConflictId(null);
    setError("");
    setData((current) =>
      current
        ? {
            ...current,
            tickets: action.status === "closed"
              ? current.tickets.filter((item) => item.id !== ticket.id)
              : current.tickets.map((item) => item.id === ticket.id ? { ...item, status: action.status } : item),
          }
        : current
    );

    try {
      const response = await fetch("/api/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticket.id, status: action.status }),
      });
      const result = await response.json();
      if (response.status === 409) {
        setConflictId(ticket.id);
        await load();
        return;
      }
      if (!response.ok) throw new Error(result.error ?? "Could not update ticket");
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update ticket");
      await load();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-9">
      <div className="mx-auto max-w-[1680px]">
        <header className="flex flex-col gap-5 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-3 w-3 rounded-full bg-accent shadow-[0_0_16px_var(--accent)]" />
            <div>
              <a href="/" className="text-sm text-muted-foreground hover:text-accent">← Employee support</a>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">DeskBot <span className="text-muted-foreground">· IT Desk</span></h1>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Live · refreshes every 3s
                </span>
              </div>
            </div>
          </div>
          <div className="font-mono text-2xl tabular-nums text-accent md:text-3xl">{clock || "—"}</div>
        </header>

        {!data && !error && <p className="py-12 text-center text-muted-foreground">Loading ticket board…</p>}
        {error && <div role="alert" className="mt-5 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">{error}</div>}
        {data && (
          <>
            <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Kpi label="Open" value={data.kpis.open} tone="accent" />
              <Kpi label="In progress" value={data.kpis.in_progress} tone="lilac" />
              <Kpi label="SLA breached" value={data.kpis.breached} tone={data.kpis.breached ? "danger" : "accent"} />
              <section className="rounded-[24px] border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Last 12 hours</p>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">{data.kpis.resolved_today} resolved today</span>
                </div>
                <div className="mt-4 flex h-16 items-end gap-1.5" aria-label="Tickets created in each of the last 12 hours">
                  {data.hourly.map((bucket, index) => (
                    <div key={`${bucket.label}-${index}`} className="group relative flex h-full flex-1 items-end" title={`${bucket.label}: ${bucket.count}`}>
                      <div className="w-full rounded-t-sm bg-accent/70 transition-all" style={{ height: `${Math.max(4, (bucket.count / peak) * 100)}%` }} />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Tickets per hour · India time</p>
              </section>
            </section>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Operations board</p>
                <h2 className="mt-1 text-xl font-semibold">Ticket queue</h2>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Filter tickets by category">
                <FilterButton selected={category === "all"} onClick={() => setCategory("all")}>All</FilterButton>
                {CATEGORIES.map((item) => (
                  <FilterButton key={item} selected={category === item.toLowerCase()} onClick={() => setCategory(item.toLowerCase())}>{item}</FilterButton>
                ))}
              </div>
            </div>

            {!data.service_status_available && (
              <p className="mt-4 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
                The PS4 seed does not contain a live service-status feed. Check the relevant support team before treating an issue as an outage.
              </p>
            )}

            <section className="mt-5 grid items-start gap-4 xl:grid-cols-3">
              <TicketColumn title="Open" count={openTickets.length} tone="accent" tickets={openTickets} loadingId={loadingId} conflictId={conflictId} onUpdate={updateTicket} />
              <TicketColumn title="In progress" count={workingTickets.length} tone="lilac" tickets={workingTickets} loadingId={loadingId} conflictId={conflictId} onUpdate={updateTicket} />
              <TicketColumn title="Resolved" count={resolvedTickets.length} tone="muted" tickets={resolvedTickets} loadingId={loadingId} conflictId={conflictId} onUpdate={updateTicket} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: "accent" | "lilac" | "danger" }) {
  const classes = {
    accent: "border-accent/40 bg-accent text-background",
    lilac: "border-border bg-card text-foreground",
    danger: "border-danger/50 bg-danger text-background",
  }[tone];
  const valueClass = tone === "lilac" ? "text-accent-2" : "";
  return (
    <section className={`rounded-[24px] border p-5 ${classes}`}>
      <p className={`text-xs uppercase tracking-[0.18em] ${tone === "lilac" ? "text-muted-foreground" : "opacity-75"}`}>{label}</p>
      <p className={`mt-2 font-mono text-4xl font-semibold tabular-nums ${valueClass}`}>{value}</p>
    </section>
  );
}

function FilterButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${selected ? "border-accent bg-accent text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function TicketColumn({
  title,
  count,
  tone,
  tickets,
  loadingId,
  conflictId,
  onUpdate,
}: {
  title: string;
  count: number;
  tone: "accent" | "lilac" | "muted";
  tickets: DeskTicket[];
  loadingId: number | null;
  conflictId: number | null;
  onUpdate: (ticket: DeskTicket) => void;
}) {
  const dotClass = tone === "accent" ? "bg-accent" : tone === "lilac" ? "bg-accent-2" : "bg-muted-foreground";
  return (
    <section className="min-w-0 rounded-[26px] border border-border bg-card p-4">
      <header className="mb-4 flex items-center justify-between px-1">
        <h3 className="flex items-center gap-2 font-semibold"><span className={`h-2 w-2 rounded-full ${dotClass}`} />{title}</h3>
        <span className="rounded-full border border-border px-2.5 py-1 font-mono text-xs tabular-nums text-muted-foreground">{count}</span>
      </header>
      <div className="max-h-[calc(100vh-360px)] min-h-48 space-y-3 overflow-y-auto pr-1">
        {tickets.length === 0 && <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">No tickets in this column.</p>}
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} loading={loadingId === ticket.id} conflict={conflictId === ticket.id} onUpdate={() => onUpdate(ticket)} />
        ))}
      </div>
    </section>
  );
}

function TicketCard({ ticket, loading, conflict, onUpdate }: { ticket: DeskTicket; loading: boolean; conflict: boolean; onUpdate: () => void }) {
  const action = ticketAction(ticket);
  const isNew = Date.now() - Date.parse(ticket.created_at) < 15_000;
  return (
    <article className={`relative overflow-hidden rounded-2xl border bg-background p-4 ${ticket.breached ? "border-danger/60 ring-1 ring-danger/30" : "border-border"} ${isNew ? "shadow-[0_0_22px_color-mix(in_srgb,var(--accent)_18%,transparent)]" : ""}`}>
      <span className={`absolute inset-y-0 left-0 w-1 ${priorityStripe[ticket.priority] ?? "bg-border"}`} />
      <div className="pl-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">#{ticket.id}</span>
          <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${priorityClasses[ticket.priority] ?? priorityClasses.P4}`}>{ticket.priority}</span>
          <span className="text-xs text-muted-foreground">{ticket.category}</span>
          {isNew && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-accent">NEW</span>}
          {ticket.breached && <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">SLA BREACHED</span>}
        </div>
        <h4 className="mt-3 text-base font-semibold leading-snug">{ticket.title}</h4>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{ticket.employee} · {ticket.department} · {ticket.location ?? "Location unavailable"}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">{ticket.team}</span>
          <span className="font-mono tabular-nums text-muted-foreground">{ticket.status.replaceAll("_", " ")}</span>
        </div>
        {ticket.status !== "resolved" && ticket.sla_due && (
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
            <span className="text-muted-foreground">Resolution target</span>
            <span className={`font-mono tabular-nums ${ticket.breached ? "text-danger" : "text-accent"}`}>{ticket.sla_text ?? ticket.sla_due}</span>
          </div>
        )}
        {conflict && <p className="mt-3 text-xs text-warn">Already updated elsewhere; the board has been refreshed.</p>}
        {action && (
          <button
            type="button"
            disabled={loading}
            onClick={onUpdate}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${action.classes}`}
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-label="Updating" />}
            {loading ? "Updating…" : action.label}
          </button>
        )}
      </div>
    </article>
  );
}
