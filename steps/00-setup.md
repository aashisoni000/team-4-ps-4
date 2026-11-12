> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 04 Setup

> **MANUAL — you do this, not Copilot.** PROGRESS id `setup`. Copilot must never see your keys. When `/api/health` is ok, tick `setup` in `live-demo/PROGRESS.md` (or ask Copilot to tick it).

### 1. Create your own copy on GitHub
* Open the starter template you used for CampusBite (`github.com/learn2simple/campusbite-live`)
* Click **Use this template** → **Create a new repository**
* Name it `deskpilot`, keep it **Public**, and click **Create repository**
* Make sure the GitHub account in your browser is the same one you use in VS Code (Accounts icon, bottom left)

### 2. Clone it outside OneDrive

```bash
# Windows (PowerShell)
mkdir C:\Projects
cd C:\Projects

# Mac: use mkdir ~/Projects and cd ~/Projects instead

git clone <your repo HTTPS link>
cd deskpilot
npm install
code .
```

If VS Code asks *Do you trust the authors?*, click **Yes**.

### 3. Create your settings file `.env.local`

```bash
cp .env.example .env.local
```

Open `.env.local` (not `.env.example`) and fill in the values. No spaces or quotes.

```env
GEMINI_API_KEY=your Gemini key
GEMINI_MODEL=gemini-2.5-flash
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_SECRET_KEY=the secret key from the same project
APP_PASSCODE=pick-a-passcode
```
*(Use the exact model name written in your starter's `.env.example`.)*

> Keep the secret key private. Real keys go only in `.env.local`. Never type them into `.env.example`, because that file goes to GitHub.

### 4. Add the DeskPilot seed file

Copy the file **`seed/deskpilot.sql`** from this pack into your repo at `seed/deskpilot.sql` (create the `seed` folder if needed). Do not edit it — every business rule lives there.


> **Why RLS with no policies?** The browser (publishable key) can read nothing. Your server uses the secret key, which bypasses RLS. Data only flows through your API routes and tools.

### 5. Set up the database in Supabase
Use one Supabase project. Its id in the address bar (`supabase.com/dashboard/project/<project-id>`) must match your `SUPABASE_URL`.

* **SQL Editor:**
  * Click **+ New**, paste all of `seed/00_starter_example.sql`, click **Run** (the starter still needs it until Step 5)
  * New query, paste all of `seed/deskpilot.sql`, click **Run**
* **Table Editor:** verify `kb_articles` has **12 rows** and `tickets` has **5 rows**.
* **Project Settings → API Keys:** ignore the **Publishable key**. Under **Secret keys** (`sb_secret_...`) reveal and copy into `SUPABASE_SECRET_KEY`.
* **Data API:** copy the API URL only up to `.supabase.co` into `SUPABASE_URL`.

### 6. Get your Gemini key
* **Google AI Studio** → **Get API key** → **Create API key** → paste into `.env.local`.

### 7. Run the starter

```bash
npm run dev
```

* Open `localhost:3000/api/health`: all settings `true`, `databaseCheck: ok`.
* Open `localhost:3000`, log in with your passcode, ask `"Which tasks are still open?"`. You should see `Done listTasks`.

> **Checkpoint:** health check ok and the starter agent answers.
> **Remember:** Next.js reads `.env.local` only at start. After any change: `Ctrl+C`, then `npm run dev`.
