> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 18 Common errors and fixes

| Problem | Cause | Fix |
| :--- | :--- | :--- |
| `APP_PASSCODE is not set on the server` | Values typed into `.env.example`, or app not restarted | Put values in `.env.local`, save, `Ctrl+C`, `npm run dev` |
| `"Could not find the table ... in the schema cache"` | `.env.local` points to a different Supabase project, or seed not run | Compare `supabaseProject` in `/api/health` with your dashboard; run `seed/deskpilot.sql` in that project |
| `"Could not find the function public.create_ticket(...)"` | rpc argument names do not match the SQL, or seed not run | Argument names must be exactly `p_employee_id, p_category, p_priority, p_title, p_description, p_asset_id`; re-run the seed |
| `permission denied for function create_ticket` | Using the publishable key instead of the secret key | Put the `sb_secret_...` key in `SUPABASE_SECRET_KEY`, restart |
| `Invalid API key` (Supabase) | Key from another project | Copy the secret key from the same project, restart |
| `"Invalid path specified in request URL"` | Extra text after `.supabase.co` | Keep only `https://<project-id>.supabase.co` |
| `searchKnowledgeBase` errors with `failed to parse logic tree` | Commas or brackets from the user's text went into `.or()` | Clean the query to letters, digits and spaces (Step 2 prompt) |
| Search finds nothing for "wifi" | Words not in `keywords` | Add synonyms to the article's `keywords` column |
| Times are 5½ hours off | Server is in UTC | Use `formatIST()` everywhere |
| `new row violates check constraint "tickets_title_check"` | Agent wrote a title over 80 or under 5 chars | Keep the Zod `.min(5).max(80)` on `title` so Gemini retries with a shorter title |
| Agent raises a ticket for the Outlook outage | Skipped the triage order | Use the full Step 4 prompt; the database will refuse anyway |
| Agent invents asset ids, cancels its own ticket, `"too many steps"` | System prompt not updated | Full Step 4 prompt and `MAX_ROUNDS = 8` |
| Gemini `"model is no longer available"` (404) | Old model name | Set `GEMINI_MODEL` to the name in `.env.example`, restart |
| Gemini 429 or quota | Too many requests | Wait one minute; use short prompts |
| Screen still shows `"Hackathon Starter"` | Expected before Step 6 | The screen changes in Step 6 |
| `/desk` shows `404` | Page not built or wrong path | Do Step 7; the file must be `app/desk/page.tsx` |
| Push cannot contain secrets (`GH013`) | Real keys in `.env.example` | Do not "allow the secret". Empty `.env.example`, `git add .env.example`, `git commit --amend --no-edit`, `git push`. If the key is in an older commit, rotate the key and ask the trainer |
| `git push` 403 | VS Code signed in to another GitHub account | Accounts icon → sign out → sign in with the repo owner |
| Live site shows the old starter | Vercel built an old commit | Push, wait for Ready, `Ctrl+F5` |
| `Cannot apply unknown utility class bg-card` | `app/globals.css` not replaced (Step 6 Part A) | Paste the kit's `globals.css` over the old one, restart `npm run dev` |
| `Module not found: lucide-react` | Icon package not installed | `npm install lucide-react` |
| Login page is a white card with invisible text | Dark theme on, login not restyled | Run item 9 of the Step 6 prompt |
| `Hydration failed` / text did not match (clock, SLA bar) | `new Date()` used during render | Use `useNow()` from the kit; it is `null` on the server |
| Wallet cards overlap the frosted panel or get cut off | Tile given a fixed height, or the spacer div removed | Let the `CardStack` tile size itself; keep the invisible spacer in `device-stack.tsx` |
| Colours look flat or grey in an old browser | No `oklch()` / `color-mix()` support | Use an up-to-date Chrome, Edge, Safari or Firefox |
| Copilot changed files you did not want | Unwanted edits | **Undo** in chat, or Source Control → **Discard Changes** |

> Stuck for more than 10 minutes? Ask for help with the exact error message and step number.
