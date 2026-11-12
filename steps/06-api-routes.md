> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 10 Step 5: API routes

* **MODE:** `Agent`

API routes are the "waiters" that carry data between the screens and the database. The screens never talk to Supabase directly.

**COPILOT PROMPT:**
```text
STEP 5 (API routes) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/06-api-routes.md. Already done and working: Setup and Steps 1–4 (agent works in the chat).
Create 3 API routes, following the pattern of #file:app/api/tasks/route.ts:
1. app/api/status/route.ts GET: all service_status rows, down first, then degraded, then operational.
2. app/api/me/route.ts GET: the employee row for CURRENT_EMPLOYEE_ID, their assets, their last 5 tickets (with category, technician name, raw created_at and sla_due_at ISO strings, formatIST sla_due and slaText), active_count (tickets with status open or in_progress) and next_sla (the active ticket with the earliest sla_due_at: id, title, technician, created_at, sla_due_at, or null).
3. app/api/desk/route.ts GET: returns { tickets, kpis, hourly }. tickets = status open, in_progress or resolved, with category, employee name and department, asset model, technician name, raw created_at and sla_due_at, sla_due and sla_text, and breached (sla_due_at < now and status not resolved), sorted in TypeScript by priority rank (critical, high, medium, low), then sla_due_at oldest first. kpis = { open, in_progress, breached, resolved_today }. hourly = 12 objects { label: "2 pm", count } for tickets created in each of the last 12 hours (IST labels).
   POST { ticket_id, status }: validate with Zod. Only allow the next step: open -> in_progress -> resolved -> closed. Do the update with .eq("id", ticket_id).eq("status", previousStatus) so two technicians clicking at once cannot both win; if no row changed return 409. On success also insert a ticket_events row (actor "IT Desk", note "Status changed to <status>") and set updated_at.
Add export const dynamic = "force-dynamic" to each. Log errors with console.error.
Also update app/api/health/route.ts to check the kb_articles table instead of tasks.

STEP GUARD (follow exactly):
- Do ONLY STEP 5. Do not start later steps, refactor, rename or "improve" anything else. Change only: app/api/status/route.ts, app/api/me/route.ts, app/api/desk/route.ts (new) and app/api/health/route.ts (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- The IT Desk status move in /api/desk POST is the ONLY place TypeScript updates tickets directly, and only with the next-step check plus .eq("status", previousStatus). Use getSupabase() only inside app/api/ and lib/. Do not touch any UI yet.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 5 from #file:live-demo/steps/06-api-routes.md, 3) "STEP 5 done — waiting for you." Then STOP.
```

* **Test in the app:** open `localhost:3000/api/status` (Outlook Email is `down` first), `/api/me` (Karthik, 3 devices, your tickets, `active_count: 3`, `next_sla` = the Wi-Fi ticket) and `/api/desk` (your new ticket on top of `tickets`, `kpis.open`, and 12 `hourly` buckets).
* **Why the extra fields?** The screens in Steps 6–7 draw SLA bars, a hero countdown and a bar chart. Shaping that data in the API keeps the components simple and the secret key on the server.
* **Key idea:** the `.eq("status", previousStatus)` trick is a tiny lock. A business rule (only the next step is allowed) is checked where the data changes.
