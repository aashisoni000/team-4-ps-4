> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 07 Step 2: Read tools (the agent's eyes)

* **MODE:** `Agent`

**COPILOT PROMPT:**
```text
STEP 2 (Read tools) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/03-read-tools.md. Already done and working: Setup and Step 1 (plan).
In #file:lib/agent/tools.ts replace the 3 task example tools with 4 read tools for DeskPilot, using defineTool like the existing examples.
Create lib/deskpilot.ts with: export const CURRENT_EMPLOYEE_ID = "E001"; export const CATEGORIES = ["network","hardware","software","access","email"] as const; a helper formatIST(iso) -> "12 Nov, 2:45 pm" in Asia/Kolkata; and slaText(iso) -> "due in 3h 20m" or "overdue by 40m".
- searchKnowledgeBase: args query (string, 2-100 chars) and optional category (enum CATEGORIES). Remove every character that is not a letter, digit or space from the query, split into words of 3+ letters, and match any word against title or keywords with ilike (use .or()). Rank by how many words matched and return the top 3 with id, category, title, steps. If nothing matches return { articles: [], note: "No self-fix article found" }.
- getServiceStatus: no args. Returns service, category, status, message for all rows, down first, then degraded, then operational.
- getMyAssets: no args. Returns id, type, model, warranty_until and in_warranty (boolean) for CURRENT_EMPLOYEE_ID.
- getMyTickets: no args. Returns the employee's last 10 tickets (newest first) with id, title, category, priority, status, asset_id, technician name (join technicians) and sla_due as formatIST plus slaText for open/in_progress tickets.
Descriptions must start with "Use this when...". Never take an employee id as an argument.

STEP GUARD (follow exactly):
- Do ONLY STEP 2. Do not start later steps, refactor, rename or "improve" anything else. Change only: lib/deskpilot.ts (new) and lib/agent/tools.ts (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Read tools only: no tool in this step may insert, update or delete anything.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 2 from #file:live-demo/steps/03-read-tools.md, 3) "STEP 2 done — waiting for you." Then STOP.
```

* **Check before Keep:** `lib/deskpilot.ts` exists; the query is cleaned before `.or()` (otherwise a comma or bracket in the user's text breaks the filter); no tool takes an employee id; the `tools` array has the 4 tools.
* **Test in the app:** type (do not click the old sample buttons) `How do I connect to VPN from home?` and `Which of my devices are still under warranty?`. You should see the GlobalProtect steps (and maybe a note that VPN is degraded), and that laptop `LT-1042` is **out of warranty**.
* **Remember:** the screen does not change in this step. Only the agent's tools changed. The screen changes in Step 6.
* **Key idea:** an AI agent is only as good as its tools. Click the grey `Done · searchKnowledgeBase` box: Gemini chose `query: "vpn home"` and `category: "network"` by itself.
