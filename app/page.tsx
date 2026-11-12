"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import EmployeeOverview from "@/components/EmployeeOverview";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-3 w-3 rounded-full bg-accent shadow-[0_0_16px_var(--accent)]" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Zentrix · employee support</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">DeskBot</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">A calm first stop for workplace IT issues, approved fixes, and ticket updates.</p>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <a href="/desk" className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-accent">IT Desk board</a>
          <button onClick={logout} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">Log out</button>
        </nav>
      </header>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)]">
        <section>
          <AgentChat onDataChanged={() => setRefreshKey((k) => k + 1)} />
        </section>
        <section>
          <EmployeeOverview refreshKey={refreshKey} />
        </section>
      </div>
    </main>
  );
}
