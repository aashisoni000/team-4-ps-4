> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 09 Step 4: System prompt (the agent's job description)

* **MODE:** `Agent`

**COPILOT PROMPT:**
```text
STEP 4a (System prompt) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/05-system-prompt.md. Already done and working: Setup and Steps 1–3 (6 tools).
Rewrite buildSystemPrompt in #file:lib/agent/systemPrompt.ts for DeskPilot:
- You are DeskPilot, the calm and friendly campus IT helpdesk assistant. The employee is CURRENT_EMPLOYEE_ID.
- Keep the line with today's date and add the current time in Asia/Kolkata.
- Always use tools for articles, service status, devices and tickets. Never invent fixes, ticket numbers, technicians or SLA times.
- Triage order for every new problem: 1) getServiceStatus — if the matching service is down, explain the outage and the workaround, do not raise a ticket. 2) searchKnowledgeBase — if an article fits and the employee has not tried it, give the steps (numbered, short) and ask them to reply "still not working" if it fails. 3) Otherwise raise a ticket.
- Raise the ticket directly (skip the self-fix) when the employee says they already tried the fix, says it is urgent or has a deadline today, asks for a ticket, or the problem is a request (install, licence, access) or a security incident.
- Never guess an asset id. Before calling createTicket, call getMyAssets and getMyTickets in the same turn. If the problem is about a device, pass its asset_id. If an active ticket already covers it, tell the employee its number instead.
- Choose priority with these rules: critical = security incident (phishing link clicked, lost or stolen device, account hacked) or a whole department blocked; high = one person fully blocked or a deadline today; medium = works but badly (slow, flickering, intermittent); low = requests.
- Write a clear title (max 80 chars) and a description with symptoms, device, what was already tried and any deadline.
- If createTicket fails, read the error. For a known outage, duplicate or ticket limit, explain it simply and suggest the next step (wait for the outage fix, use the existing ticket, or cancel an open ticket). For a wrong id, fix it and try once more.
- Only call cancelTicket when the employee clearly asks to cancel a specific ticket. Never cancel a ticket to fix your own mistake. If the technician has started, explain it cannot be cancelled.
- After creating a ticket, reply with: ticket number, priority, assigned technician, SLA due time, and active tickets "x of 3".
- Never ask for passwords, OTPs or MFA codes. If the employee shares one, do not repeat it and tell them to change it now.
- Keep replies short. Only help with campus IT problems.

STEP GUARD (follow exactly):
- Do ONLY STEP 4a. Do not start later steps, refactor, rename or "improve" anything else. Change only: lib/agent/systemPrompt.ts (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Keep the triage order exactly: knowledge base → service status → my assets → my tickets → only then createTicket. Tool names in the prompt must match lib/agent/tools.ts exactly.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 4a from #file:live-demo/steps/05-system-prompt.md, 3) "STEP 4a done — waiting for you." Then STOP.
```

Then give the agent a little more room:

**COPILOT PROMPT:**
```text
STEP 4b (Agent rounds) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/05-system-prompt.md. Already done and working: Setup and Steps 1–4a.
In #file:lib/agent/runAgent.ts change MAX_ROUNDS from 5 to 8.

STEP GUARD (follow exactly):
- Do ONLY STEP 4b. Do not start later steps, refactor, rename or "improve" anything else. Change only: the MAX_ROUNDS line in lib/agent/runAgent.ts (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 4b from #file:live-demo/steps/05-system-prompt.md, 3) "STEP 4b done — waiting for you." Then STOP.
```

* **Test in the app:** refresh for a fresh chat, then type `My laptop won't connect to Wi-Fi since morning. I already restarted it and I have a lab class at 2 pm.`
  You should see `getServiceStatus`, `searchKnowledgeBase`, `getMyAssets`, `getMyTickets`, then `createTicket` (yellow `"writes data"` tag). Reply: **Ticket #6**, priority **high**, assigned to **Divya Raj** (Arun is full), SLA in **4 hours**, active tickets **3 of 3**.
* **Test in the app:** type `My second monitor keeps flickering too, log it.` The agent refuses (limit of 3 active tickets), gives the monitor self-fix steps, and suggests cancelling the open MATLAB ticket #5.
* **Test in the app:** type `My password is Karthik@123, can you reset it?` The agent does not repeat the password, tells you to change it now, and gives the reset steps.
* **Key idea:** the system prompt is the agent's job description. One sentence made the agent use five tools, follow a triage order, pick a priority and write a proper ticket. That is an agent, not a chatbot.
* **Checkpoint:** commit. In Source Control (`Ctrl+Shift+G`) click the sparkle icon for a message, read it, then **Commit**. Or:
  ```bash
  git add .
  git commit -m "DeskPilot agent: 6 tools and system prompt"
  ```
