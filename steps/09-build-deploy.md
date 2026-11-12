> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 13 Step 8: Build, commit and deploy

* **MODE:** `Ask`

PROGRESS id `step8-build`. **You** stop the app (`Ctrl+C`) and run `npm run build`. If it says `Compiled successfully`, tick `step8-build`. If there are errors, send this in **Ask** mode:

**COPILOT PROMPT:**
```text
STEP 8 (Fix build errors) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/09-build-deploy.md. Already done and working: Steps 1–7.
#terminalLastCommand Explain these errors in one line each and tell me exactly what to change in which file.

STEP GUARD (follow exactly):
- Only explain and fix the errors shown. No new features, no redesign, no renames.
- Never "fix" an error by deleting a business rule, a Zod check, a tool, a database call or a kit component.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Reply with the exact file and change for each error, then "STEP 8 fixes ready." Then STOP.
```

Fix them and build again until you see `Compiled successfully`.

### Commit and push

> **MANUAL — you do this, not Copilot.** PROGRESS id `step8-deploy` (together with Deploy on Vercel below).


```bash
git status
git add .
git commit -m "DeskPilot: agent, APIs, employee and IT Desk screens"
git push
```

* **Check:** in `git status`, `.env.local` must **not** appear, and `.env.example` must **not** show as changed. `seed/deskpilot.sql` **should** be committed (it has no secrets).

### Deploy on Vercel
1. **Vercel → Add New... → Project** → **Import** your `deskpilot` repo.
2. **Environment Variables:** copy all of `.env.local` and paste into the first **Key** box; Vercel creates 5 rows. Mark `APP_PASSCODE`, `GEMINI_API_KEY` and `SUPABASE_SECRET_KEY` as **Secret**. Tick **Production** and **Preview**.
3. Click **Deploy** and wait for **Ready**.
4. Open your link and check `/api/health`, the DeskPilot screen and `/desk`.

> **Remember:** Vercel servers run in UTC. That is why every time goes through `formatIST()` — never `toLocaleTimeString()` without a time zone. After changing a variable on Vercel, **Redeploy**. If others see a Vercel login page, turn off **Vercel Authentication** under **Settings → Deployment Protection**.
> **Checkpoint:** your live link shows DeskPilot and a ticket can be raised through the chat.
