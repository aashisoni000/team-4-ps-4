> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 16 Stretch feature 4

### 4. SLA escalation on the IT Desk
**COPILOT PROMPT:**
```text
STRETCH 4 (SLA escalation) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/stretch/stretch-4.md. Already done and working: Steps 1–8 (app deployed and all six test moments pass).
In app/desk/page.tsx add an "Escalate" button on breached tickets that are not critical. Create app/api/desk/escalate/route.ts with POST { ticket_id } (Zod) that raises priority by one step (low -> medium -> high -> critical), resets sla_due_at using the SLA table (2h/4h/24h/72h from now), and logs a ticket_events row "Escalated to <priority>". Use .eq("priority", currentPriority) so double clicks return 409.

STEP GUARD (follow exactly):
- Do ONLY STRETCH 4 (SLA escalation). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 4 (SLA escalation) from #file:live-demo/stretch/stretch-4.md, 3) "STRETCH 4 (SLA escalation) done — waiting for you." Then STOP.
```
* **Test in the app:** in Supabase set one ticket's `sla_due_at` to the past, then escalate it on the board.
