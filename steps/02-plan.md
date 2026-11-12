> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 06 Step 1: Plan with AI

* **MODE:** `Ask` (Ask only answers; it does not change files. Ask for planning, Agent for building.)

**COPILOT PROMPT:**
```text
STEP 1 (Plan) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/02-plan.md. Already done and working: Setup — repo, .env.local, seed/deskpilot.sql run in Supabase, rules file.
#codebase Read this Next.js starter, .github/copilot-instructions.md and seed/deskpilot.sql.
I want to turn this starter into DeskPilot, an AI IT helpdesk agent for campus staff.
Employees describe IT problems in plain English; the agent first searches the knowledge base for a self-fix, checks service status for known outages, looks at the employee's devices and existing tickets, and only then raises a ticket. An IT Desk screen shows live tickets that technicians move from open to in progress to resolved to closed.
Give me a short build plan: which files to create or change, which read tools and write tools we need (name, arguments, table), which API routes and pages. Do not write code yet.

STEP GUARD (follow exactly):
- Ask mode: do NOT write, create or change any file.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- In the plan, show where each business rule lives (database function vs TypeScript) and number the steps exactly like the handbook: Step 2 read tools, Step 3 write tools, Step 4 system prompt, Step 5 API routes, Step 6 employee screen, Step 7 IT Desk, Step 8 build and deploy.
- End with "STEP 1 done — waiting for you." Then STOP.
```

* **Check:** the plan names six tools (4 read, 2 write), `lib/deskpilot.ts`, the API routes (`/api/status`, `/api/me`, `/api/desk`), the `/desk` page, and says to use `create_ticket` / `cancel_ticket` instead of inserting tickets directly.
* **Key idea:** good developers plan before they code, even with AI. If the plan is wrong, fix it now — it costs one prompt, not ten.
