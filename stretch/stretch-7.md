> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 16 Stretch feature 7

### 7. Mobile check
**COPILOT PROMPT:**
```text
STRETCH 7 (Mobile check) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/stretch/stretch-7.md. Already done and working: Steps 1–8 (app deployed and all six test moments pass).
Review #file:app/page.tsx and the MyTickets, ServiceStatus and MyDevices components for a 360px wide phone screen (the device wallet must stay inside its tile and every card must be at least 44px tall to tap). Fix anything that overflows or is hard to tap. Do the same for app/desk/page.tsx (columns should stack).

STEP GUARD (follow exactly):
- Do ONLY STRETCH 7 (Mobile check). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Build UI only with components/ui/desk-ui.tsx, components/ui/device-stack.tsx and the tokens in app/globals.css; do not edit those three kit files or app/layout.tsx. No raw Tailwind colours (slate-, red-, emerald-…), every number/id/time in font-mono tabular-nums.
- Do not change lib/agent/*, lib/deskpilot.ts or the SQL.
- Layout/styling only for this feature; keep all data and agent logic as it is.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 7 (Mobile check) from #file:live-demo/stretch/stretch-7.md, 3) "STRETCH 7 (Mobile check) done — waiting for you." Then STOP.
```
* **Test in the app:** Chrome `F12` → phone icon → pick a phone size.

> **Remember:** every new write goes through a database function or a conditional update. If a stretch prompt from Copilot updates a table directly from a tool without checks, reject it and ask again.
