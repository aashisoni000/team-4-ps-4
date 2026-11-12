"use client";

import { useEffect, useState } from "react";

type EmployeeData = {
  employee: {
    name: string;
    department: string;
    location: string;
    laptop_model: string | null;
  };
  tickets: Array<{
    id: number;
    title: string;
    category: string;
    priority: string;
    status: string;
    team: string | null;
    created_at: string;
    sla_due: string | null;
    sla_text: string | null;
  }>;
  active_count: number;
  next_sla: { id: number; title: string; team: string | null; sla_due_at: string; sla_due: string | null } | null;
  device_inventory_available: boolean;
};

type ServiceStatus = { available: boolean; message: string };

export default function EmployeeOverview({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<EmployeeData | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [employeeResponse, statusResponse] = await Promise.all([
          fetch("/api/me", { cache: "no-store" }),
          fetch("/api/status", { cache: "no-store" }),
        ]);
        const [employeeData, statusData] = await Promise.all([
          employeeResponse.json(),
          statusResponse.json(),
        ]);
        if (!employeeResponse.ok) throw new Error(employeeData.error ?? "Could not load your profile");
        if (!statusResponse.ok) throw new Error(statusData.error ?? "Could not load service status");
        if (active) {
          setData(employeeData);
          setServiceStatus(statusData);
          setError("");
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load helpdesk data");
      }
    }

    void load();
    const timer = window.setInterval(() => void load(), 15_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [refreshKey]);

  return (
    <div className="space-y-5">
      {error && <div role="alert" className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">{error}</div>}

      <section className="rounded-[26px] border border-border bg-card p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your workspace</p>
            <h2 className="mt-2 text-xl font-semibold">{data?.employee.name ?? "Loading profile…"}</h2>
            {data && <p className="mt-1 text-sm text-muted-foreground">{data.employee.department} · {data.employee.location}</p>}
          </div>
          <div className="rounded-2xl bg-accent px-4 py-3 text-background">
            <p className="text-xs font-medium uppercase tracking-wide">Active tickets</p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">{data?.active_count ?? "—"}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Next resolution target</p>
            {data?.next_sla ? (
              <>
                <p className="mt-2 font-medium">#{data.next_sla.id} · {data.next_sla.title}</p>
                <p className="mt-1 font-mono text-sm tabular-nums text-accent">{data.next_sla.sla_due ?? data.next_sla.sla_due_at}</p>
              </>
            ) : <p className="mt-2 text-sm text-muted-foreground">No active ticket target</p>}
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Device inventory</p>
            <p className="mt-2 font-medium">{data?.employee.laptop_model ?? "Not listed in this seed"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {data?.device_inventory_available ? "Registered device inventory is available." : "The PS4 seed includes a laptop model, not assigned device records."}
            </p>
          </div>
        </div>
        {serviceStatus && !serviceStatus.available && (
          <p className="mt-4 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
            {serviceStatus.message} DeskBot will not guess whether a service is down.
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-[26px] border border-border bg-card">
        <div className="flex items-end justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recent activity</p>
            <h2 className="mt-1 text-lg font-semibold">Your tickets</h2>
          </div>
          <a href="/desk" className="text-sm text-accent hover:underline">Open IT Desk →</a>
        </div>
        <div className="divide-y divide-border">
          {!data && !error && <p className="px-5 py-6 text-sm text-muted-foreground">Loading your tickets…</p>}
          {data?.tickets.length === 0 && <p className="px-5 py-6 text-sm text-muted-foreground">No tickets yet. Ask DeskBot for help.</p>}
          {data?.tickets.map((ticket) => (
            <article key={ticket.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{ticket.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-mono tabular-nums">#{ticket.id}</span> · {ticket.category} · {ticket.team ?? "No team"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs ${ticket.priority === "P1" ? "border-danger/40 bg-danger/10 text-danger" : ticket.priority === "P2" ? "border-warn/40 bg-warn/10 text-warn" : "border-border bg-muted text-muted-foreground"}`}>{ticket.priority}</span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">{ticket.status.replaceAll("_", " ")}</span>
              </div>
              <p className="w-full text-xs text-muted-foreground sm:w-auto sm:text-right">
                {ticket.sla_text ? <span className="text-accent">{ticket.sla_text}</span> : ticket.sla_due ?? "No target"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
