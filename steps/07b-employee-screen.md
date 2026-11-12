> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 11 Step 6 (Parts B and C): Employee screen

* **MODE:** `Agent`. Needs Part A ([`07a-design-kit.md`](07a-design-kit.md)) done and committed first.

**Kit cheat sheet** (what to ask Copilot for by name):

| Component | Use it for |
| :--- | :--- |
| `Tile` / `Tile variant="accent"` | Every card; the one lime hero card |
| `Chip tone spin strike` | Priority, status, warranty badges (`spin` for in-progress, `strike` for cancelled) |
| `Dot tone pulse` | Service status lights, "Live" |
| `LiveBadge` | Header "Live" pill |
| `BigNumber` | Count-up hero numbers |
| `SegmentMeter` | "Active tickets 3 of 3" |
| `SlaBar` + `useNow` | Draining SLA bar: lime → amber under 1 h → coral when breached |
| `BarStrip` | Animated bar chart with hover labels (tickets per hour) |
| `FeedRow` + `CategoryIcon` | Activity-feed rows with a category icon (Wi-Fi, CPU, app, key, mail) |
| `Pills` | Small segmented filter (All / Network / Hardware …) |
| `Rise` | Staggered fade-up entry for any list item |
| `CardStack` + `CARD_FACES` (in `device-stack.tsx`) | Wallet-style stack of cards: devices, access passes, licences. Click a back card → it springs to the front; `onFrontClick` on the front card (e.g. "report a problem with this device") |
| `PRIORITY_TONE`, `STATUS_TONE`, `SERVICE_TONE` | Map database values to colours — never pick colours by hand |


**COPILOT PROMPT:**
```text
STEP 6 (Employee screen) ONLY. Context: #file:.github/copilot-instructions.md and #file:live-demo/steps/07b-employee-screen.md. Already done and working: Setup, Steps 1–5 and Step 6 Part A (design kit pasted and committed).
Build the DeskPilot employee screen using ONLY the kit in #file:components/ui/desk-ui.tsx (Tile, Chip, Dot, LiveBadge, BigNumber, SegmentMeter, SlaBar, useNow, FeedRow, CategoryIcon, Rise and the *_TONE maps), the wallet CardStack in #file:components/ui/device-stack.tsx and the colour tokens in #file:app/globals.css. Do not use raw Tailwind colours like slate-*, red-* or emerald-*.
1. Layout in app/page.tsx: max-w-[1180px], a top bar with the wordmark "DeskPilot" (a lime Dot before it), a muted subtitle "Campus IT helpdesk agent", a LiveBadge and a mono pill with the employee name, then a grid: AgentChat on the left (lg:col-span-7, lg:row-span-3, sticky), and on the right (lg:col-span-5) a bento of tiles described below. Replace TaskList.
2. components/HelloTile.tsx: Tile. "Good morning/afternoon/evening, <first name>" (from the IST hour; the name in text-accent), muted line "Here is your IT at a glance.", then "Active tickets" with a SegmentMeter of active_count of 3 and a mono "x / 3" label. Loads /api/me.
3. components/NextSlaTile.tsx: Tile variant="accent" titled "Next SLA", with a Chip-like "Tracking" pill. Shows the hours left until next_sla as a BigNumber with one decimal and suffix "h", the ticket title and technician under it, and a thin ink-coloured progress bar that drains with useNow. If there is no active ticket show "All clear" with a check icon from lucide-react.
4. components/ServiceStatus.tsx: Tile titled "Services" with a LiveBadge-style "live" label. One row per service: Dot (SERVICE_TONE, pulse when down or degraded), name, and a Chip with the status. Under a down or degraded service show its message in muted 12px text. Loads /api/status.
5. components/MyTickets.tsx: Tile titled "My tickets" with a mono count. A list of FeedRow: CategoryIcon by category, title, detail "#id · technician or In queue", right side a priority Chip (PRIORITY_TONE) and a status Chip (STATUS_TONE, spin when in_progress, strike when cancelled). Under each open or in_progress row show SlaBar (created_at, sla_due_at, now from useNow). Empty state: a muted line "No tickets — nice."
6. components/MyDevices.tsx: use CardStack from #file:components/ui/device-stack.tsx titled "My devices", one card per asset: label = type ("Laptop"), code = asset id, title = model, subtitle = "Covered until <date>" or "Warranty ended <date>" (en-IN date), badge = { "covered", ok } or { "out of warranty", danger }, icon = lucide Laptop / Monitor / Printer / PcCase / Smartphone by type, faces from CARD_FACES (laptop lime, monitor lilac, printer amber, others steel). Put the laptop card in front (last in the array). onFrontClick puts "My <label> <code> has a problem: " into the chat input (add an optional prefill prop to AgentChat) so the employee only types the symptom; frontHint "report a problem".
7. Restyle components/AgentChat.tsx (keep all logic): Tile-style container with full height; header "Agent" with a mono "gemini · 6 tools" pill; user bubbles bg-foreground text-background rounded-2xl; agent bubbles bg-muted rounded-2xl; while loading show a row of 3 pulsing lime dots and "DeskPilot is checking…"; sample prompts as rounded-full outline pills that wrap; the input as a rounded-full field with a lime circular Send button (lucide ArrowUp). Tool steps: each <details> is a compact rounded-xl row in font-mono 11px with a Dot (ok = accent, failed = danger), the tool name, and a warn Chip "writes data" for write tools; the JSON inside uses text-muted-foreground. New messages use Rise.
8. In AgentChat set SAMPLE_PROMPTS to: "How do I connect to VPN from home?", "My laptop won't connect to Wi-Fi since morning. I already restarted it and I have a lab class at 2 pm.", "My second monitor keeps flickering too, log it.", "Cancel my Wi-Fi ticket."
9. Restyle app/login/page.tsx (keep the logic): centred Tile max-w-sm, the DeskPilot wordmark, a rounded-full mono passcode input, and a lime full-width rounded-full Enter button with text-ink.
10. All data tiles reload when refreshKey changes AND every 5 seconds. Supabase may return a related row as an object or a one-item array; handle both. Use useNow for every time-based value so there is no hydration mismatch.
11. Add an "Open IT Desk" link (rounded-full border pill with lucide ArrowUpRight) in the top bar to /desk. Delete components/TaskList.tsx and app/api/tasks.

STEP GUARD (follow exactly):
- Do ONLY STEP 6. Do not start later steps, refactor, rename or "improve" anything else. Change only: app/page.tsx, app/login/page.tsx, components/AgentChat.tsx, and new components/HelloTile.tsx, NextSlaTile.tsx, ServiceStatus.tsx, MyTickets.tsx, MyDevices.tsx; delete components/TaskList.tsx and app/api/tasks (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Build UI only with components/ui/desk-ui.tsx, components/ui/device-stack.tsx and the tokens in app/globals.css; do not edit those three kit files or app/layout.tsx. No raw Tailwind colours (slate-, red-, emerald-…), every number/id/time in font-mono tabular-nums.
- Do not change lib/agent/*, lib/deskpilot.ts or the SQL. Screens read data only through the API routes from Step 5.
- AgentChat: restyle only — keep its fetch, steps and onDataChanged logic exactly.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 6 from #file:live-demo/steps/07b-employee-screen.md, 3) "STEP 6 done — waiting for you." Then STOP.
```

* **Test in the app:** refresh `localhost:3000`. You see:
  * the greeting with **Karthik** in lime, and the meter with all **3 segments amber** (you are at the limit)
  * a lime **Next SLA** hero tile counting up to about **4.0h** for the Wi-Fi ticket
  * **Outlook Email** with a pulsing coral dot and its outage message; **VPN** pulsing amber
  * the Wi-Fi ticket row with a Wi-Fi icon, an amber **HIGH** chip, a lime **OPEN** chip and a full lime SLA bar
  * a fanned **My devices** wallet: lime `LT-1042` laptop card in front, the frosted panel reading `Dell Latitude 5420` with a coral **OUT OF WARRANTY** chip
  * click the lilac `MN-220` card: it springs to the front and the panel changes to `LG 24MK430` · **COVERED**; click it again and the chat box fills with `My Monitor MN-220 has a problem: `
* **Wallet check:** move the mouse across the stack — the rainbow glare follows it. Turn on *Reduce motion* in your OS settings and reload: the cards still swap, but without the spring.
* **Design check (30 seconds):** every number is mono and does not shift width while counting; there is exactly **one** lime tile; no plain red/green/blue Tailwind colours anywhere (`Ctrl+Shift+F` for `slate-` or `red-` should find nothing in `components/` outside the kit).
* **Remember:** the "Open IT Desk" link shows `404` until Step 7. That is expected.
* **Key idea:** we built the brain first, then the face. A design kit + tokens means one prompt produces a consistent, premium screen — colour carries meaning, not decoration.
