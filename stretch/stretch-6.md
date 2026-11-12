> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 16 Stretch feature 6

### 6. Staff access pass in the wallet

**COPILOT PROMPT:**
```text
STRETCH 6 (Passes wallet) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/stretch/stretch-6.md. Already done and working: Steps 1–8 (app deployed and all six test moments pass).
Add a second CardStack titled "Passes" to the employee screen, using #file:components/ui/device-stack.tsx. Cards: "Campus Wi-Fi" (code = employee id, subtitle = SSID SRM-Staff), "VPN" (subtitle = GlobalProtect, badge from the VPN row of /api/status mapped with SERVICE_TONE), "Email" (badge from Outlook Email). Use CARD_FACES.steel for passes so devices stay colourful. onFrontClick asks the agent "How do I connect to <label>?".

STEP GUARD (follow exactly):
- Do ONLY STRETCH 6 (Passes wallet). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Build UI only with components/ui/desk-ui.tsx, components/ui/device-stack.tsx and the tokens in app/globals.css; do not edit those three kit files or app/layout.tsx. No raw Tailwind colours (slate-, red-, emerald-…), every number/id/time in font-mono tabular-nums.
- Do not change lib/agent/*, lib/deskpilot.ts or the SQL.
- Layout/styling only for this feature; keep all data and agent logic as it is.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 6 (Passes wallet) from #file:live-demo/stretch/stretch-6.md, 3) "STRETCH 6 (Passes wallet) done — waiting for you." Then STOP.
```
* **Test in the app:** the Email pass shows a coral **DOWN** chip, and clicking it in front makes the agent answer from the knowledge base and mention the outage.
