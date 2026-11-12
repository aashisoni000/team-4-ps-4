> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 16 Stretch feature 2

### 2. "Me too" on outages
**COPILOT PROMPT:**
```text
STRETCH 2 (Me too on outages) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/stretch/stretch-2.md. Already done and working: Steps 1–8 (app deployed and all six test moments pass).
Add outage reporting so 40 people do not raise 40 tickets.
1. Give me SQL for a table outage_reports (service text references service_status(service), employee_id text references employees(id), created_at timestamptz default now(), primary key (service, employee_id)) and a function report_outage(p_employee_id text, p_service text) that only allows services with status degraded or down and returns the total number of reports. Enable RLS on the new table.
2. Add a tool reportOutage (writes: true, arg service) that calls rpc("report_outage") with CURRENT_EMPLOYEE_ID.
3. System prompt: when a matching service is down or degraded, offer to add the employee to the outage report instead of raising a ticket.
4. Show "N people affected" next to each down or degraded service on both screens.

STEP GUARD (follow exactly):
- Do ONLY STRETCH 2 (Me too on outages). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 2 (Me too on outages) from #file:live-demo/stretch/stretch-2.md, 3) "STRETCH 2 (Me too on outages) done — waiting for you." Then STOP.
```
* **Test in the app:** `Outlook is not syncing.` then `Yes, add me.`
