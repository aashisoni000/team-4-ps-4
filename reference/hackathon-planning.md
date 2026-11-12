> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 17 From DeskPilot to your hackathon

Use the same path for your own problem.

| Today (DeskPilot) | Tomorrow (your problem) |
| :--- | :--- |
| Wrote `seed/deskpilot.sql` with tables, starting data and 2 database functions | Write your seed: tables, test data that *hits every rule*, and functions for every write |
| Step 1: plan with AI | Plan with the prompt below |
| Rules file | Write `.github/copilot-instructions.md` for your problem |
| Steps 2-3: read tools, then write tools | Design your tools with the table below |
| Step 4: system prompt (with a triage order) | Write your agent's job description and decision order |
| Steps 5-7: API routes and screens | Build one screen per user type |
| Step 8: build and deploy | Deploy by Checkpoint 1, then keep pushing |

> **Reuse the step guard:** copy the STEP header and STEP GUARD from any DeskPilot prompt into your own prompts, and replace the files, the business rules and the step name with yours.

### 1. Seed-writing prompt (Ask mode)
**COPILOT PROMPT:**
```text
Our problem: <business user> has this problem: <one line>. Our agent must: <2 lines>.
Write seed/<name>.sql for Supabase: drop-and-recreate tables with check constraints, starting data where each business rule is hit at least once (for example one item at its limit, one blocked case), and a plpgsql function for each write that checks every rule, raises a clear exception when one fails, makes all changes together, and returns json. Enable RLS on every table and revoke execute on the functions from public, anon and authenticated. Explain each rule in one line.
```

### 2. Planning prompt (Ask mode, after you run your seed file)
**COPILOT PROMPT:**
```text
#codebase Read this starter and seed/<your seed file>.sql.
Our problem: <business user> has this problem: <problem in one line>.
Our agent must: <what it should do, in 2 lines>.
Give a short build plan: the read tools and write tools we need (name, arguments, which table), the business rules to check in the database, the API routes and the pages. Do not write code yet.
```

### 3. Tool design table (fill it in as a team before coding)

| Tool name | Reads or writes | Arguments | Table | Business rule checked |
| :--- | :--- | :--- | :--- | :--- |
| *e.g. `getMyTickets`* | Reads | none | `tickets`, `technicians` | only the logged-in user's rows |
| *e.g. `createTicket`* | Writes | category, priority, title, description, asset_id | `tickets`, `ticket_events` | outage, duplicate, limit 3, device owner, SLA |
| | Reads | | | |
| | Reads | | | |
| | Writes | | | |

### 4. Rules file starter for `.github/copilot-instructions.md`

```markdown
# <App name> project rules

- App: <one line about the app and its user>. The logged-in user is always "<id>". Never take a user id as a tool argument.
- Stack: Next.js App Router, TypeScript, Tailwind CSS, Supabase, Gemini function calling, Zod.
- Agent tools live in lib/agent/tools.ts and use defineTool() with a Zod schema.
- Tables: <list your tables>.
- Writes go only through database functions: <list them>. Never update those tables directly in TypeScript.
- Business rules: <your rules>. The database raises a clear exception when a rule fails.
- Only lib/ and app/api/ may call getSupabase(). Never use the secret key in components.
```

### 5. System prompt skeleton (works for most agents)
```text
You are <name>, <one-line role>. The user is <CURRENT_ID>. Today is <date/time>.
Always use tools for <facts>. Never invent <ids, prices, times>.
Decision order: 1) <check that can stop early> 2) <cheapest helpful answer> 3) <write action>.
Act directly when <clear request conditions>; ask only when <unclear>.
Before any write, call <read tools> in the same turn to get real ids.
If a write fails, read the error, explain simply, suggest the next step. Never undo your own write to hide a mistake.
After a write, reply with <the 3-5 facts the user needs>.
Never <safety rule>. Keep replies short. Only help with <domain>.
```

> **Key idea:** the order matters. Seed and rules first, read tools, then write tools, then the system prompt, then screens. A working agent in the chat is worth more marks than a pretty screen with no agent.
