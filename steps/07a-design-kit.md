> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 11 Step 6: Employee screen (with the DeskPilot design kit)

* **MODE:** MANUAL (copy files). Parts B and C are in [`07b-employee-screen.md`](07b-employee-screen.md).

The brain works. Now give it a face worthy of it. DeskPilot uses one **design language** on every screen — a dark *bento* layout inspired by premium fintech dashboards:

| Element | Rule |
| :--- | :--- |
| Surface | Near-black background, cards at `rounded-[26px]` with a 1px hairline border (`border-border`) |
| Type | Geist for words, **Geist Mono with `tabular-nums` for every number, id and time** (numbers never jiggle when they update) |
| Colour = meaning | Lime `accent` = live / healthy / primary action · Lilac `accent-2` = in progress · Amber `warn` = degraded, high, SLA under 1 h · Coral `danger` = down, critical, breached. No other colours. |
| One hero tile per screen | A solid lime tile (`variant="accent"`) holds the single most important number |
| Motion | Count-up numbers, bars that grow in, list rows that rise in with a stagger, a pulsing dot for "live". All motion is switched off for `prefers-reduced-motion`. |
| Chips | Small mono uppercase pills: colour from the tone, background a soft tint of the same colour |

### Part A — Install the design kit (no Copilot request needed)

> **MANUAL — you do this, not Copilot.** PROGRESS id `step6-kit`. Copy each code block into its file exactly. Copying it yourself is faster and safer than asking Copilot to retype about 700 lines of UI code.


**Why paste instead of prompt?** A design system must be *identical* everywhere. Pasting it once costs zero chat requests, and every later prompt says "use the kit" instead of re-describing colours.

**Why `components/ui`?** It is the standard shadcn/ui folder. Reusable building blocks (`Tile`, `Chip`, …) live in `components/ui`; app-specific screens (`MyTickets`, `ServiceStatus`) live in `components/`. Copilot, shadcn and your teammates all expect this split, and our tokens use shadcn names (`--card`, `--muted-foreground`, `--border`, `--ring`), so you can add shadcn components later and they match automatically.

1. Install the icon library:
   ```bash
   npm install lucide-react
   ```
2. Replace **all** of `app/globals.css` with:
   Copy **`kit/app/globals.css`** from this pack to **`app/globals.css`** in your repo (replace the whole file).
3. Replace **all** of `app/layout.tsx` with:
   Copy **`kit/app/layout.tsx`** from this pack to **`app/layout.tsx`** in your repo (replace the whole file).
4. Create `components/ui/desk-ui.tsx` and paste:
   Copy **`kit/components/ui/desk-ui.tsx`** from this pack to **`components/ui/desk-ui.tsx`** in your repo (replace the whole file).
5. Create `components/ui/device-stack.tsx` and paste the **wallet card stack** — fanned, bank-card-shaped cards with a holographic glare; click a back card and it springs to the front, and a frosted panel underneath shows the front card's details:
   Copy **`kit/components/ui/device-stack.tsx`** from this pack to **`components/ui/device-stack.tsx`** in your repo (replace the whole file).
6. Run `npm run dev`. The page is now dark and the login card looks broken (white card, light text). That is expected — Part B fixes it.

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

> **Checkpoint:** commit now (`git commit -m "DeskPilot design kit"`), so you can always come back to a clean kit.
