> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 16 Stretch feature 3

### 3. Add an update to my ticket
**COPILOT PROMPT:**
```text
STRETCH 3 (Ticket notes) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/stretch/stretch-3.md. Already done and working: Steps 1–8 (app deployed and all six test moments pass).
Add a tool addTicketNote (writes: true, args ticket_id positive int, note string 3-500 chars). It must only work for tickets of CURRENT_EMPLOYEE_ID with status open or in_progress: create a database function add_ticket_note(p_employee_id, p_ticket_id, p_note) (give me the SQL) that checks this and inserts into ticket_events. Show the latest 3 events on each IT Desk card.

STEP GUARD (follow exactly):
- Do ONLY STRETCH 3 (Ticket notes). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 3 (Ticket notes) from #file:live-demo/stretch/stretch-3.md, 3) "STRETCH 3 (Ticket notes) done — waiting for you." Then STOP.
```
* **Test in the app:** `Add to my Wi-Fi ticket: it also fails in the library.`
