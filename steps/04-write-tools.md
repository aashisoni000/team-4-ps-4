> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 08 Step 3: Write tools (the agent's hands)

* **MODE:** `Agent`

**COPILOT PROMPT:**
```text
STEP 3 (Write tools) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/04-write-tools.md. Already done and working: Setup, Step 1, Step 2 (4 read tools + lib/deskpilot.ts).
In #file:lib/agent/tools.ts add 2 write tools (writes: true):
- createTicket: args category (enum CATEGORIES), priority (enum low, medium, high, critical), title (string 5-80 chars, a short summary written by the agent), description (string up to 1000 chars: symptoms, what the employee already tried, any deadline), asset_id (optional string, must be an id from getMyAssets).
  Call getSupabase().rpc("create_ticket", { p_employee_id: CURRENT_EMPLOYEE_ID, p_category: category, p_priority: priority, p_title: title, p_description: description, p_asset_id: asset_id ?? null }).
  Throw new Error(error.message) on error, else return data plus sla_due (formatIST) and sla_text (slaText).
- cancelTicket: arg ticket_id (positive integer). Call rpc("cancel_ticket", { p_employee_id: CURRENT_EMPLOYEE_ID, p_ticket_id: ticket_id }) the same way.
Do not insert or update tickets, technicians or ticket_events directly in TypeScript; the database functions do all checks.
The tools array must be exactly: searchKnowledgeBase, getServiceStatus, getMyAssets, getMyTickets, createTicket, cancelTicket.

STEP GUARD (follow exactly):
- Do ONLY STEP 3. Do not start later steps, refactor, rename or "improve" anything else. Change only: lib/agent/tools.ts (and lib/deskpilot.ts only if a helper is missing) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Keep the 4 read tools exactly as they are. The write tools must return the database function's refusal message as-is so the agent can explain it.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 3 from #file:live-demo/steps/04-write-tools.md, 3) "STEP 3 done — waiting for you." Then STOP.
```

* **Check before Keep:** both tools have `writes: true` and use `rpc(...)`; there is no `.insert(` or `.update(` on `tickets`; the rpc argument names start with `p_` and match the SQL exactly; all 6 tools are in the array.
* **Remember:** do not test ticket creation yet. Without the Step 4 system prompt the agent may invent asset ids, pick the wrong priority, skip the self-fix, or cancel its own ticket. Go straight to Step 4.
* **Key idea:** a write tool is a *thin* wrapper. The TypeScript only passes arguments; the database decides. That is why the AI cannot break the rules.
