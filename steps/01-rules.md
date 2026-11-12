> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 05 Before you prompt: four things to know

### 1. The rules file

> **COPILOT can do this** (PROGRESS id `rules`): it creates `.github/copilot-instructions.md` with exactly the text below, replacing the whole file. Check the result before you Keep.

Copilot reads `.github/copilot-instructions.md` with every prompt. The template's file talks about the canteen — **replace all of it** with this (and paste the same text into `CLAUDE.md` if you use Claude Code):

```markdown
# DeskPilot project rules

- App: DeskPilot, an AI IT helpdesk agent for campus staff. The logged-in employee is always "E001" (CURRENT_EMPLOYEE_ID in lib/deskpilot.ts). Never take an employee id as a tool argument.
- Stack: Next.js App Router, TypeScript, Tailwind CSS, Supabase, Gemini function calling, Zod.
- Agent tools live in lib/agent/tools.ts and use defineTool() with a Zod schema. Read tools first, write tools have writes: true.
- Tables: employees, assets, kb_articles, service_status, technicians, tickets, ticket_events.
- Categories: network, hardware, software, access, email. Priorities: low, medium, high, critical. Ticket status: open, in_progress, resolved, closed, cancelled.
- Tickets must be created and cancelled ONLY through the database functions create_ticket and cancel_ticket via getSupabase().rpc(). Never insert or update tickets directly in TypeScript for employees.
- Business rules (enforced in the database): device must belong to the employee, no ticket during a known outage of that category, no duplicate active ticket for same category + device, max 3 active tickets, auto-assign least-busy technician, SLA by priority.
- Show times in Asia/Kolkata using helpers in lib/deskpilot.ts.
- Only lib/ and app/api/ may call getSupabase(). Never use the secret key in components. Never log or store passwords.
- Process: the build follows live-demo/README.md (runbook) with one file per step in live-demo/steps/ (stretch features in live-demo/stretch/), tracked in live-demo/PROGRESS.md. Read only the current step's file. Do exactly one step per request, follow its STEP GUARD, then stop. Never handle API keys, run SQL against Supabase, push or deploy — tell the user instead.
- UI (from Step 6): build screens only with components/ui/desk-ui.tsx and components/ui/device-stack.tsx and the tokens in app/globals.css (bg-card, text-muted-foreground, accent, warn, danger). No raw Tailwind colours (slate-, red-, emerald-…). Every number, id and time is font-mono tabular-nums. Colour = meaning: lime healthy/primary, lilac in progress, amber warning, coral down/breached. One lime hero tile per screen. Respect prefers-reduced-motion.
```

> **Key idea:** a short rules file gives better code from every prompt.

### 2. The progress file (`live-demo/PROGRESS.md`)
Copilot creates this on your first "Run the next step" ([`live-demo/README.md`](../README.md)). This is the exact template:

```markdown
# DeskPilot build progress
Tick a line only when its "Test in the app" checks pass. Commit after every tick.
Format: id — file to read — who/mode

- [ ] setup — steps/00-setup.md — MANUAL
- [ ] rules — steps/01-rules.md — COPILOT, Agent (rules file only)
- [ ] step1 — steps/02-plan.md — COPILOT, Ask
- [ ] step2 — steps/03-read-tools.md — COPILOT, Agent
- [ ] step3 — steps/04-write-tools.md — COPILOT, Agent
- [ ] step4 — steps/05-system-prompt.md — COPILOT, Agent (blocks 4a then 4b)
- [ ] step5 — steps/06-api-routes.md — COPILOT, Agent
- [ ] step6-kit — steps/07a-design-kit.md — MANUAL (copy kit/ files)
- [ ] step6 — steps/07b-employee-screen.md — COPILOT, Agent
- [ ] step7 — steps/08-it-desk.md — COPILOT, Agent
- [ ] step8-build — steps/09-build-deploy.md — MANUAL + COPILOT, Ask
- [ ] step8-deploy — steps/09-build-deploy.md — MANUAL
- [ ] test — steps/10-full-test.md — MANUAL

## Optional (after test)
- [ ] stretch-1 — stretch/stretch-1.md — Did that fix it?
- [ ] stretch-2 — stretch/stretch-2.md — Me too on outages
- [ ] stretch-3 — stretch/stretch-3.md — Ticket notes
- [ ] stretch-4 — stretch/stretch-4.md — SLA escalation
- [ ] stretch-5 — stretch/stretch-5.md — Warranty-aware advice
- [ ] stretch-6 — stretch/stretch-6.md — Passes wallet
- [ ] stretch-7 — stretch/stretch-7.md — Mobile check
```

### 3. Run one step at a time (the step guard)
Copilot can write almost all of DeskPilot, but **only if you feed it one step at a time**. Ask for everything at once and it loses context, skips business rules and writes tickets straight into the table.

1. Copy the whole `live-demo/` folder of this pack into your repo (every prompt points to its own step file with `#file:`). The easy way is the single prompt in `live-demo/README.md`, where Copilot picks the right block for you. You can also copy each block below by hand; both use the same guard.
2. Every Copilot prompt below starts with a **STEP header** (which step, which section to read, what is already done) and ends with a **STEP GUARD** (only these files, keep the business rules, run `tsc`, list the tests, then stop). **Copy the whole block, header and guard included.**
3. After Copilot stops: read the diff → **Keep** → run the "Test in the app" checks → `git commit -m "Step N"` → only then the next step.
4. If a step goes wrong, **Undo** in chat (or `git restore .`) and send the same prompt again — do not patch it with five follow-up prompts.
5. Start a **new chat** for each step (`+` in the Chat view). The rules file and the STEP header give it all the context it needs; old chats only add noise.

> **You still do these by hand:** create the repo, `.env.local` keys, run the SQL in Supabase, paste the design kit (Step 6 Part A), test in the browser, commit, push and deploy. Copilot never sees your keys.

### 4. Use Copilot Free wisely
This handbook uses about 12 chat prompts.
* Copy each prompt **exactly**, in one message
* Always attach context (`#file`, `#codebase`)
* Read the error yourself first, then ask Copilot
* Use inline suggestions (`Tab`) for small edits
* If you hit the limit, pair with a teammate and continue with inline suggestions
* One step per chat keeps every request small — the STEP GUARD is long on purpose, it is cheaper than redoing a step
