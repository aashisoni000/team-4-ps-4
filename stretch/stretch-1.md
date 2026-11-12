> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 16 Stretch feature 1

### 1. "Did that fix it?" — learn from self-fixes
**COPILOT PROMPT:**
```text
STRETCH 1 (Did that fix it?) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/stretch/stretch-1.md. Already done and working: Steps 1–8 (app deployed and all six test moments pass).
I want to measure how many problems the knowledge base solves without a ticket.
1. Give me SQL to add columns helped int not null default 0 and not_helped int not null default 0 to kb_articles (I will run it in Supabase).
2. Add a tool rateArticle (writes: true, args article_id positive int, helped boolean) that increments the right counter. Description: "Use this when the employee says a self-fix article worked or did not work."
3. In the system prompt: after giving self-fix steps, when the employee replies, call rateArticle before doing anything else.
4. Show "Self-fixed today: N" on the IT Desk header (sum of helped).

STEP GUARD (follow exactly):
- Do ONLY STRETCH 1 (Did that fix it?). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 1 (Did that fix it?) from #file:live-demo/stretch/stretch-1.md, 3) "STRETCH 1 (Did that fix it?) done — waiting for you." Then STOP.
```
* **Test in the app:** ask how to reset your password, then reply `That worked, thanks!`
