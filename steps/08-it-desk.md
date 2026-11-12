> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 12 Step 7: IT Desk screen

* **MODE:** `Agent`

The IT Desk is a wall screen: it must be readable from 3 metres and show *what needs attention now* without anyone touching it.

**COPILOT PROMPT:**
```text
STEP 7 (IT Desk screen) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/08-it-desk.md. Already done and working: Setup and Steps 1–6 (employee screen works).
Create app/desk/page.tsx, a full-screen IT Desk board built ONLY with #file:components/ui/desk-ui.tsx and the tokens in #file:app/globals.css (no raw Tailwind colour classes).
1. Top bar: lime Dot + wordmark "DeskPilot · IT Desk", a LiveBadge, the current IST time in big mono (from useNow, rendered only when not null), and Pills to filter by category: all, network, hardware, software, access, email.
2. KPI row (grid of 4 tiles): "Open" BigNumber; "In progress" BigNumber; "SLA breached" — this tile becomes Tile variant="accent" style but with background var(--danger) when breached > 0, otherwise a normal Tile showing 0 with a lime check; "Last 12 hours" with a BarStrip of hourly counts (labels like "2 pm", caption "Tickets per hour").
3. Board: 3 Tiles as columns — Open, In progress, Resolved — each header with a Dot (ok, info, ok) and a mono count Chip. Columns scroll inside on desktop and stack on mobile.
4. Ticket card (inside a column): rounded-2xl bg-muted/40 border border-border p-4, a 3px left stripe in the priority colour (PRIORITY_TONE). Row 1: mono "#id", priority Chip, and a CategoryIcon at the right. Row 2: title (15px, medium). Row 3: muted "employee · department · device model". Row 4: technician as a small pill with initials avatar, or a warn Chip "Unassigned". Row 5: SlaBar (hide it for resolved). If breached, the card gets a 1px danger ring and a danger Chip "SLA breached".
5. One full-width action button per card: "Start work" (open, lime bg, text-ink), "Mark resolved" (in_progress, lilac bg), "Close" (resolved, outline). It calls POST /api/desk, is disabled with a Spinner while the request runs, moves the card optimistically, and on 409 shows a small "Already updated" Chip and reloads.
6. A ticket created less than 15 seconds ago gets a soft lime glow (box-shadow with color-mix of var(--accent)) and a "NEW" Chip so the desk notices it.
7. Wrap cards in Rise keyed by ticket id so only new cards animate. Sort inside each column by priority rank then sla_due_at.
8. Reload /api/desk every 3 seconds. Handle related rows that may be an object or an array.

STEP GUARD (follow exactly):
- Do ONLY STEP 7. Do not start later steps, refactor, rename or "improve" anything else. Change only: app/desk/page.tsx and new files under components/desk/ (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Build UI only with components/ui/desk-ui.tsx, components/ui/device-stack.tsx and the tokens in app/globals.css; do not edit those three kit files or app/layout.tsx. No raw Tailwind colours (slate-, red-, emerald-…), every number/id/time in font-mono tabular-nums.
- Do not change lib/agent/*, lib/deskpilot.ts or the SQL. Screens read data only through the API routes from Step 5.
- Do not change the employee screen or its components.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 7 from #file:live-demo/steps/08-it-desk.md, 3) "STEP 7 done — waiting for you." Then STOP.
```

* **Check:** the file must be exactly `app/desk/page.tsx`. If `/desk` shows `404`, restart with `Ctrl+C` and `npm run dev`.
* **Test in the app:** put the employee screen and `/desk` side by side.
  * Your ticket #6 appears near the top of **Open** with an amber stripe, a lime **NEW** glow and **Divya Raj** as the technician.
  * #1 and #4 sit under **In progress**; the "Last 12 hours" bars grow in from the bottom.
  * Click **Start work** on #6: the button shows a spinner, the card glides to **In progress**, and within 5 seconds the employee screen's chip turns lilac with a spinner.
* **Design check:** stand back 3 metres. Can you tell which ticket is most urgent in 2 seconds? If not, ask Copilot to increase the size contrast between the title and the meta line.
