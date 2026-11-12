# AGENTIC AI & FULL-STACK BUILD
## LIVE BUILD GUIDE — DeskPilot: IT Helpdesk Ticket Agent

**Build an AI agent app step by step**
Turn a plain starter into an IT helpdesk agent using AI prompts in VS Code. Employees describe IT problems in plain English; the agent tries a self-fix first, checks outages, devices and existing tickets, then raises a ticket and assigns a technician. A live **IT Desk board** shows every ticket as it moves.

| STACK | TOOLS | OUTPUT |
| :--- | :--- | :--- |
| Next.js, Supabase, Gemini | GitHub Copilot | Live app on Vercel |

* **Document:** Learner handbook (DeskPilot edition), modelled on the CampusBite Guide 2
* **Same foundations as CampusBite:** plan → read tools → write tools → system prompt → API routes → screens → deploy

---

## 00 Start here — how to use this file with Copilot

### Where things go (three files, not one)

| File in your repo | What you put in it | Who reads it |
| :--- | :--- | :--- |
| `.github/copilot-instructions.md` | **Only** the short rules file from section 05 (about 20 lines) | Copilot, **automatically** with every message |
| `live-demo/LIVE_BUILD_PROMPTS.md` | **This whole handbook**, unchanged | Copilot, only when you attach it with `#file:` |
| `live-demo/PROGRESS.md` | The step checklist (Copilot creates it for you) | You and Copilot, so it always knows the next step |

**Why not paste everything into `copilot-instructions.md`?** That file is sent with *every* message. Putting about 1,900 lines of steps, SQL and UI code in it fills Copilot's memory before it even reads your question. Copilot then mixes steps together, runs them out of order and forgets rules. Keep the always-on file **short (rules only)** and attach the handbook only when you build.

### The only prompt you need (Agent mode, a **new chat** for every step)

```text
#file:live-demo/LIVE_BUILD_PROMPTS.md #file:live-demo/PROGRESS.md Run the next step.
```

Copilot reads the runbook below, finds the next step, does **only** that step (or tells you what to do by hand), ticks it off and stops. You test, commit (`git commit -am "Step N"`) and send the same prompt again in a new chat. To redo or jump: `Run step 5.` To add a feature after the build is done: `Run stretch 2.`

> **First time:** `PROGRESS.md` does not exist yet. Send the prompt anyway; Copilot creates it and stops.

### COPILOT RUNBOOK (instructions for the AI — learners can skip this box)

When this handbook is attached and the user says "run the next step", "run step N" or "run stretch N", follow these rules **exactly**:

1. **Find the step.** Read `live-demo/PROGRESS.md`. If it does not exist, create it with the exact template in section 05 ("The progress file"), reply "PROGRESS.md created — run the next step again." and STOP. Otherwise the next step is the first unticked `- [ ]` line. If the user names a step while an earlier step is unticked, warn them and STOP. (`stretch-*` lines are optional and never block anything.)
2. **Read only what you need:** `.github/copilot-instructions.md`, the "Step map" row for that step, and **only that step's section** of this handbook. Ignore every other section.
3. **MANUAL steps:** do NOT do them. Print the section's checklist for the user, short and in order, then reply "This is a MANUAL step — tell me when it works and tick it in PROGRESS.md." and STOP. Never ask for, read, write or print API keys or passcodes, never run SQL against Supabase, never `git push`, never deploy.
4. **COPILOT steps:** run every `COPILOT PROMPT` block in that section, in order, exactly as if the user had pasted it, **including its STEP header and STEP GUARD**. Do not add features, files or "improvements" the block does not ask for.
5. **Ask-mode steps** (Step map says Ask): never edit files. Answer only, then tell the user to tick the step themselves.
6. **Finish:** tick the step in `PROGRESS.md` (`- [x]`), print that section's "Check" and "Test in the app" bullets, then end with `Step <id> done — test it, commit, and start a new chat for the next step.` and STOP. **Never start the next step in the same reply.**
7. **Conflicts:** if anything in a section conflicts with the business rules in `.github/copilot-instructions.md`, the rules win — STOP and ask the user. If a test from an earlier step is clearly broken, say so and STOP instead of building on top of it.
8. **Errors:** if `npx tsc --noEmit` fails on code you did not write in this step, list the errors and STOP; do not rewrite earlier steps to make them pass.

### Step map

| PROGRESS id | Section | Who | Mode | Done when |
| :--- | :--- | :--- | :--- | :--- |
| `setup` | 04 Setup | MANUAL | — | `/api/health` shows `databaseCheck: ok` and the starter agent answers |
| `rules` | 05.1 The rules file | COPILOT (create the file with the exact text, nothing else) | Agent | `.github/copilot-instructions.md` holds exactly the DeskPilot rules |
| `step1` | 06 Plan with AI | COPILOT | **Ask** | Plan names 6 tools and the rpc functions |
| `step2` | 07 Read tools | COPILOT | Agent | VPN steps + `LT-1042` out of warranty in chat |
| `step3` | 08 Write tools | COPILOT | Agent | Ticket created via `create_ticket` in chat |
| `step4` | 09 System prompt (both blocks) | COPILOT | Agent | Triage order followed; Outlook outage refused |
| `step5` | 10 API routes | COPILOT | Agent | `/api/status`, `/api/me`, `/api/desk` return JSON |
| `step6-kit` | 11 Part A — design kit | MANUAL (paste) | — | Page is dark, kit committed |
| `step6` | 11 Parts B and C | COPILOT | Agent | Employee screen + device wallet work |
| `step7` | 12 IT Desk screen | COPILOT | Agent | `/desk` board moves tickets |
| `step8-build` | 13 `npm run build` (+ fix prompt if errors) | MANUAL + COPILOT | **Ask** | `Compiled successfully` |
| `step8-deploy` | 13 Commit, push, Vercel | MANUAL | — | Live link works |
| `test` | 14 Six moments | MANUAL | — | All six moments pass |
| `stretch-1` … `stretch-7` | 16.1 … 16.7 | COPILOT | Agent | That feature's test passes |

---

## Contents

| # | Section |
| :--- | :--- |
| 00 | Start here — how to use this file with Copilot |
| 01 | About this handbook |
| 02 | The problem statement |
| 03 | App design |
| 04 | Setup |
| 05 | Before you prompt: four things to know |
| 06 | Step 1: Plan with AI |
| 07 | Step 2: Read tools (the agent's eyes) |
| 08 | Step 3: Write tools (the agent's hands) |
| 09 | Step 4: System prompt (the agent's job description) |
| 10 | Step 5: API routes |
| 11 | Step 6: Employee screen |
| 12 | Step 7: IT Desk screen |
| 13 | Step 8: Build, commit and deploy |
| 14 | Full test: six moments |
| 15 | Understand the agent loop |
| 16 | Stretch features |
| 17 | From DeskPilot to your hackathon |
| 18 | Common errors and fixes |
| 19 | Key ideas to remember |
| 20 | Files and links |

---

## 01 About this handbook

In this session you build **DeskPilot**, an AI "Level-0 support" agent for the campus IT helpdesk. You start from the same plain starter used for CampusBite and, using AI prompts in VS Code, turn it into a working app with an **employee screen** and a live **IT Desk screen**. Then you deploy it.

Follow the steps in order. Each step has a prompt to copy, what to check, and how to test it.

| Part | What you do | Time |
| :--- | :--- | :--- |
| Setup | Your repo, rules file, database and API keys | 25 min |
| Steps 1 to 4 | Plan, agent tools, system prompt | 15 min |
| Steps 5 to 7 | API routes, employee screen, IT Desk screen | 15 min |
| Step 8 | Build, commit and deploy | 10 min |
| Full test | Six test moments on two screens | 10 min |
| Stretch features | Add extra features with your own prompts | 45 min |
| Hackathon planning | Plan your own problem the same way | 30 min |

* **You will learn:** how to plan an agent app, the difference between read tools and write tools, why the system prompt matters, why business rules belong in the database, and why a helpdesk agent should *try to solve first, ticket second*.
* **Before you start:** VS Code, Git, Node.js 20+, GitHub Copilot, and free accounts on GitHub, Supabase, Google AI Studio and Vercel.

---

## 02 The problem statement

* **Business user:** a university staff member whose laptop, Wi-Fi, printer or account stops working in the middle of the day.
* **Logged-in employee:** `E001` (Karthik Iyer, Computer Science department).
* **The problem today:** people email or phone IT with vague messages ("internet not working"), the same outage gets 40 duplicate tickets, simple fixes (forget-and-rejoin Wi-Fi, password reset) still wait hours for a human, nobody knows which device is affected, and technicians are overloaded while others sit idle.
* **The solution:** employees describe the problem in plain English. An AI agent searches the knowledge base for a self-fix, checks live service status for known outages, looks up the employee's registered devices and existing tickets, then — only if needed — raises a well-written ticket with the right category and priority, and the database assigns the least-busy technician with the right skill. The IT Desk sees it instantly on a live board.

| User | What they do |
| :--- | :--- |
| Employee (`E001`) | Describes an IT problem in plain English, gets self-fix steps or a ticket, tracks or cancels tickets |
| IT technician | Sees the live board, moves tickets: "Start work" → "Mark resolved" → "Close" |

---

## 03 App design

### Screens

| Screen | What it shows |
| :--- | :--- |
| Employee screen `/` | Agent chat (left); "My tickets" card with active count (x of 3), service status lights and "My devices" (right) |
| IT Desk screen `/desk` | Three columns: Open, In progress, Resolved — sorted by priority then SLA, with SLA countdown |
| Health check `/api/health` | Settings, connected Supabase project, database check |

### Data model (created by `seed/deskpilot.sql`)

| Table | Main columns |
| :--- | :--- |
| `employees` | `id`, `name`, `department`, `email` |
| `assets` | `id`, `employee_id`, `type` (`laptop`, `desktop`, `monitor`, `printer`, `phone`), `model`, `warranty_until` |
| `kb_articles` | `id`, `category`, `title`, `keywords`, `steps` |
| `service_status` | `service`, `category`, `status` (`operational`, `degraded`, `down`), `message` |
| `technicians` | `id`, `name`, `skill` (a category), `max_active` |
| `tickets` | `id`, `employee_id`, `asset_id`, `category` (`network`, `hardware`, `software`, `access`, `email`), `priority` (`low`, `medium`, `high`, `critical`), `title`, `description`, `status` (`open`, `in_progress`, `resolved`, `closed`, `cancelled`), `technician_id`, `sla_due_at` |
| `ticket_events` | `ticket_id`, `actor`, `note`, `created_at` (audit trail) |

* **Starting data (built to test the rules):**
  * `E001` already has **2 active tickets** (limit is 3): #4 printer jam (**in progress** — cannot be cancelled) and #5 MATLAB licence (**open** — can be cancelled).
  * **Outlook Email is DOWN** (known outage) and **VPN is DEGRADED**.
  * Network technician **Arun is full** (2 of 2), so new network tickets must go to **Divya**.
  * `E001` owns laptop `LT-1042`, monitor `MN-220` and the department printer `PR-301`.
  * The knowledge base has **12 articles**.

### Agent tools

| Tool | Reads or writes | What it does |
| :--- | :--- | :--- |
| `searchKnowledgeBase` | Reads | Finds up to 3 self-fix articles by keywords; optional category filter |
| `getServiceStatus` | Reads | Live status of campus services (known outages) |
| `getMyAssets` | Reads | The employee's registered devices and warranty |
| `getMyTickets` | Reads | The employee's recent tickets, status, technician and SLA |
| `createTicket` | Writes | Calls `create_ticket()`: validates, checks outage/duplicate/limit, picks technician, sets SLA, logs event — all or nothing |
| `cancelTicket` | Writes | Calls `cancel_ticket()`: only while still `open` (before a technician starts) |

### How the Agent Loop Works

1. **User asks:** "My laptop won't join Wi-Fi, I have a lab at 2."
2. **API route:** sends the message + tool list to Gemini
3. **Gemini decides:** picks a tool + arguments (e.g. `searchKnowledgeBase({ query: "wifi laptop", category: "network" })`)
4. **Your code runs it:** Zod-checks the arguments, then reads or writes Supabase
5. **Result to Gemini:** tool output goes back *(loops to step 3 if another tool is needed — max 5 rounds at first, raised to 8 in Step 4)*
6. **Final answer:** shown on screen with ticket number, technician and SLA

> **Key idea:** `createTicket` does many things at once: checks the device belongs to you, checks for a known outage, checks for a duplicate, checks your active-ticket limit, picks the least-busy technician with the right skill, sets the SLA deadline, inserts the ticket and writes an audit event. The database function does all of it in **one transaction** — everything or nothing. Because the rules live in the database, the AI cannot break them, even if it tries.

### SLA rules (enforced by the database)

| Priority | When to use | SLA |
| :--- | :--- | :--- |
| `critical` | Security incident (phishing clicked, lost device) or a whole department blocked | 2 hours |
| `high` | One person fully blocked, or a deadline today | 4 hours |
| `medium` | Works but badly (slow, flickering, intermittent) | 24 hours |
| `low` | Requests (software install, licence, new accessory) | 72 hours |

---

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
Create a new file `seed/deskpilot.sql` in your repo and paste **all** of the SQL below. (CampusBite gave you this file; for DeskPilot you write it yourself — this is exactly what you will do for your hackathon problem.)

```sql
-- seed/deskpilot.sql — DeskPilot IT Helpdesk
-- Safe to run again: it drops and recreates all DeskPilot tables with fresh data.

drop function if exists create_ticket(text, text, text, text, text, text);
drop function if exists cancel_ticket(text, integer);
drop table if exists ticket_events, tickets, technicians, service_status, kb_articles, assets, employees cascade;

create table employees (
  id text primary key,
  name text not null,
  department text not null,
  email text not null unique
);

create table assets (
  id text primary key,
  employee_id text not null references employees(id),
  type text not null check (type in ('laptop','desktop','monitor','printer','phone')),
  model text not null,
  warranty_until date not null
);

create table kb_articles (
  id serial primary key,
  category text not null check (category in ('network','hardware','software','access','email')),
  title text not null,
  keywords text not null,
  steps text not null
);

create table service_status (
  service text primary key,
  category text not null check (category in ('network','hardware','software','access','email')),
  status text not null check (status in ('operational','degraded','down')),
  message text not null default '',
  updated_at timestamptz not null default now()
);

create table technicians (
  id text primary key,
  name text not null,
  skill text not null check (skill in ('network','hardware','software','access','email')),
  max_active int not null check (max_active > 0)
);

create table tickets (
  id serial primary key,
  employee_id text not null references employees(id),
  asset_id text references assets(id),
  category text not null check (category in ('network','hardware','software','access','email')),
  priority text not null check (priority in ('low','medium','high','critical')),
  title text not null check (char_length(title) between 5 and 80),
  description text not null check (char_length(description) <= 1000),
  status text not null default 'open'
    check (status in ('open','in_progress','resolved','closed','cancelled')),
  technician_id text references technicians(id),
  sla_due_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ticket_events (
  id serial primary key,
  ticket_id int not null references tickets(id) on delete cascade,
  actor text not null,
  note text not null,
  created_at timestamptz not null default now()
);

-- ---------- Starting data ----------
insert into employees (id, name, department, email) values
  ('E001', 'Karthik Iyer',   'Computer Science', 'karthik.iyer@campus.edu'),
  ('E002', 'Fathima Nazeer', 'Admissions',       'fathima.nazeer@campus.edu'),
  ('E003', 'Rohan Das',      'Library',          'rohan.das@campus.edu'),
  ('E004', 'Lakshmi Menon',  'Accounts',         'lakshmi.menon@campus.edu');

insert into assets (id, employee_id, type, model, warranty_until) values
  ('LT-1042', 'E001', 'laptop',  'Dell Latitude 5420',         '2025-06-30'),
  ('MN-220',  'E001', 'monitor', 'LG 24MK430 24-inch',         '2027-03-31'),
  ('PR-301',  'E001', 'printer', 'HP LaserJet M404 (CS office)','2026-12-31'),
  ('LT-2001', 'E002', 'laptop',  'Lenovo ThinkPad E14',        '2027-08-31'),
  ('DT-3001', 'E003', 'desktop', 'HP ProDesk 400',             '2026-01-31'),
  ('LT-4001', 'E004', 'laptop',  'Dell Vostro 3420',           '2027-05-31');

insert into kb_articles (category, title, keywords, steps) values
  ('network',  'Connect to campus Wi-Fi (SRM-Staff)', 'wifi wi-fi wireless internet connect network ssid',
   '1. Forget the SRM-Staff network. 2. Turn Wi-Fi off and on. 3. Reconnect and sign in with your NetID and password. 4. If it still fails, restart the laptop.'),
  ('network',  'Set up VPN from home (GlobalProtect)', 'vpn remote home globalprotect off-campus',
   '1. Open GlobalProtect. 2. Portal: vpn.campus.edu. 3. Sign in with NetID and approve the MFA prompt. 4. If it is slow, check service status for VPN.'),
  ('network',  'No internet on a LAN cable', 'lan ethernet cable wired internet no network',
   '1. Check both ends of the cable. 2. Try another wall port. 3. Run "ipconfig /renew" (Windows) or turn the adapter off and on.'),
  ('hardware', 'Clear a printer paper jam or stuck queue', 'printer jam paper print queue stuck',
   '1. Open the front and back doors and remove paper gently. 2. On your PC open Printers and clear the queue. 3. Turn the printer off for 30 seconds.'),
  ('hardware', 'Second monitor flickering or not detected', 'monitor screen display flicker flickering hdmi second external',
   '1. Reseat the HDMI/DisplayPort cable at both ends. 2. Press Win+P and choose Extend. 3. Try another cable. 4. Update the display driver.'),
  ('hardware', 'Laptop battery not charging', 'battery charging charger power laptop',
   '1. Try another wall socket. 2. Check the charger light. 3. Shut down, unplug for 1 minute, then charge again.'),
  ('software', 'Install licensed software from Software Center', 'install software licence license matlab office app',
   '1. Open Software Center. 2. Search the app. 3. Click Install. Licensed apps not listed need a ticket.'),
  ('software', 'Microsoft Teams will not open or keeps crashing', 'teams crash meeting open freeze',
   '1. Quit Teams from the system tray. 2. Clear the Teams cache folder. 3. Open Teams again.'),
  ('access',   'Reset your NetID password', 'password reset forgot locked account netid login',
   '1. Go to password.campus.edu. 2. Choose "Forgot password". 3. Verify with your registered mobile. IT will NEVER ask for your password.'),
  ('access',   'Set up MFA on a new phone', 'mfa authenticator otp new phone two factor',
   '1. Sign in at mysignins.campus.edu from your laptop. 2. Add a sign-in method. 3. Scan the QR code with the Authenticator app.'),
  ('email',    'Outlook stuck on "Updating folder"', 'outlook email mail sync updating stuck',
   '1. Check service status for Outlook Email. 2. Close and reopen Outlook. 3. Use webmail at mail.campus.edu meanwhile.'),
  ('email',    'Mailbox full: archive old mail', 'mailbox full storage quota archive email',
   '1. Empty Deleted Items. 2. File > Tools > Mailbox Cleanup. 3. Archive mail older than 1 year.');

insert into service_status (service, category, status, message) values
  ('Campus Wi-Fi',  'network',  'operational', ''),
  ('VPN',           'network',  'degraded',    'Slow logins for off-campus users. Engineers are monitoring.'),
  ('Outlook Email', 'email',    'down',        'Mail sync outage since 8:10 am. Fix expected by 11:00 am. Use webmail meanwhile.'),
  ('ERP Portal',    'software', 'operational', ''),
  ('Printing',      'hardware', 'operational', ''),
  ('SSO Login',     'access',   'operational', '');

insert into technicians (id, name, skill, max_active) values
  ('T01', 'Arun Kumar',    'network',  2),
  ('T02', 'Divya Raj',     'network',  3),
  ('T03', 'Meena Pillai',  'hardware', 3),
  ('T04', 'Rahul Verma',   'software', 3),
  ('T05', 'Sneha Joseph',  'access',   2),
  ('T06', 'Vikram Singh',  'email',    3);

insert into tickets (employee_id, asset_id, category, priority, title, description, status, technician_id, sla_due_at, created_at) values
  ('E002', 'LT-2001', 'network',  'high',   'Wi-Fi drops in Admissions block', 'Wi-Fi disconnects every 10 minutes on all laptops in Admissions.', 'in_progress', 'T01', now() + interval '2 hours',  now() - interval '2 hours'),
  ('E003', 'DT-3001', 'network',  'medium', 'Library kiosk offline',            'The catalogue kiosk shows "no network".',                            'open',        'T01', now() + interval '20 hours', now() - interval '4 hours'),
  ('E004', 'LT-4001', 'network',  'low',    'Slow LAN in Accounts',             'Wired internet is slow in the afternoon.',                           'open',        'T02', now() + interval '60 hours', now() - interval '12 hours'),
  ('E001', 'PR-301',  'hardware', 'medium', 'Printer jams on every page',       'CS office printer jams after the first page.',                       'in_progress', 'T03', now() + interval '18 hours', now() - interval '6 hours'),
  ('E001', null,      'software', 'low',    'Renew MATLAB licence',             'MATLAB says the licence expires in 3 days.',                         'open',        'T04', now() + interval '70 hours', now() - interval '2 hours');

insert into ticket_events (ticket_id, actor, note)
  select id, employee_id, 'Ticket created' from tickets;

-- ---------- Business rules: create a ticket (all or nothing) ----------
create or replace function create_ticket(
  p_employee_id text,
  p_category    text,
  p_priority    text,
  p_title       text,
  p_description text,
  p_asset_id    text default null
) returns json
language plpgsql
as $$
declare
  v_active    int;
  v_dup_id    int;
  v_service   text;
  v_message   text;
  v_tech_id   text;
  v_tech_name text;
  v_sla       timestamptz;
  v_ticket_id int;
begin
  -- Lock the employee row so two quick requests cannot both pass the limit check.
  perform 1 from employees where id = p_employee_id for update;
  if not found then
    raise exception 'Employee % not found.', p_employee_id;
  end if;

  if p_category not in ('network','hardware','software','access','email') then
    raise exception 'Unknown category "%". Use network, hardware, software, access or email.', p_category;
  end if;
  if p_priority not in ('low','medium','high','critical') then
    raise exception 'Unknown priority "%". Use low, medium, high or critical.', p_priority;
  end if;

  if p_asset_id is not null and not exists (
       select 1 from assets where id = p_asset_id and employee_id = p_employee_id) then
    raise exception 'Device % is not registered to you.', p_asset_id;
  end if;

  select service, message into v_service, v_message
    from service_status where category = p_category and status = 'down' limit 1;
  if found then
    raise exception 'Known outage: % is down (%). IT is already fixing it, so no new ticket is needed.', v_service, v_message;
  end if;

  select id into v_dup_id from tickets
   where employee_id = p_employee_id
     and category = p_category
     and coalesce(asset_id, '') = coalesce(p_asset_id, '')
     and status in ('open','in_progress')
   limit 1;
  if found then
    raise exception 'Duplicate: ticket #% is already open for this problem.', v_dup_id;
  end if;

  select count(*) into v_active from tickets
   where employee_id = p_employee_id and status in ('open','in_progress');
  if v_active >= 3 then
    raise exception 'You already have % active tickets (limit 3). Cancel an open one or wait until one is resolved.', v_active;
  end if;

  -- Pick the least-busy technician with the right skill who still has room.
  perform 1 from technicians where skill = p_category for update;
  select t.id, t.name into v_tech_id, v_tech_name
    from technicians t
   where t.skill = p_category
     and (select count(*) from tickets k
           where k.technician_id = t.id and k.status in ('open','in_progress')) < t.max_active
   order by (select count(*) from tickets k
              where k.technician_id = t.id and k.status in ('open','in_progress')), t.id
   limit 1;
  -- If nobody has room, v_tech_id stays null and the ticket waits in the queue.

  v_sla := now() + case p_priority
                     when 'critical' then interval '2 hours'
                     when 'high'     then interval '4 hours'
                     when 'medium'   then interval '24 hours'
                     else                 interval '72 hours'
                   end;

  insert into tickets (employee_id, asset_id, category, priority, title, description, technician_id, sla_due_at)
  values (p_employee_id, p_asset_id, p_category, p_priority, p_title, p_description, v_tech_id, v_sla)
  returning id into v_ticket_id;

  insert into ticket_events (ticket_id, actor, note)
  values (v_ticket_id, p_employee_id,
          'Ticket created' || coalesce(' and assigned to ' || v_tech_name, ', waiting in queue'));

  return json_build_object(
    'ticket_id',      v_ticket_id,
    'status',         'open',
    'category',       p_category,
    'priority',       p_priority,
    'technician',     coalesce(v_tech_name, 'Unassigned (queue)'),
    'sla_due_at',     v_sla,
    'active_tickets', v_active + 1
  );
end;
$$;

-- ---------- Business rules: cancel a ticket ----------
create or replace function cancel_ticket(p_employee_id text, p_ticket_id int)
returns json
language plpgsql
as $$
declare
  v_status text;
begin
  select status into v_status from tickets
   where id = p_ticket_id and employee_id = p_employee_id
   for update;
  if not found then
    raise exception 'Ticket #% was not found in your tickets.', p_ticket_id;
  end if;
  if v_status = 'in_progress' then
    raise exception 'Ticket #% cannot be cancelled: the technician has already started work.', p_ticket_id;
  end if;
  if v_status <> 'open' then
    raise exception 'Ticket #% is already %, so it cannot be cancelled.', p_ticket_id, v_status;
  end if;

  update tickets set status = 'cancelled', updated_at = now() where id = p_ticket_id;
  insert into ticket_events (ticket_id, actor, note) values (p_ticket_id, p_employee_id, 'Cancelled by employee');

  return json_build_object('ticket_id', p_ticket_id, 'status', 'cancelled');
end;
$$;

-- ---------- Security: only the server (secret key) may touch this data ----------
alter table employees      enable row level security;
alter table assets         enable row level security;
alter table kb_articles    enable row level security;
alter table service_status enable row level security;
alter table technicians    enable row level security;
alter table tickets        enable row level security;
alter table ticket_events  enable row level security;

revoke execute on function create_ticket(text, text, text, text, text, text) from public, anon, authenticated;
revoke execute on function cancel_ticket(text, integer) from public, anon, authenticated;
```

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

---

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
- Process: the build follows live-demo/LIVE_BUILD_PROMPTS.md one step at a time, tracked in live-demo/PROGRESS.md. Do exactly one step per request, follow its STEP GUARD, then stop. Never handle API keys, run SQL against Supabase, push or deploy — tell the user instead.
- UI (from Step 6): build screens only with components/ui/desk-ui.tsx and components/ui/device-stack.tsx and the tokens in app/globals.css (bg-card, text-muted-foreground, accent, warn, danger). No raw Tailwind colours (slate-, red-, emerald-…). Every number, id and time is font-mono tabular-nums. Colour = meaning: lime healthy/primary, lilac in progress, amber warning, coral down/breached. One lime hero tile per screen. Respect prefers-reduced-motion.
```

> **Key idea:** a short rules file gives better code from every prompt.

### 2. The progress file (`live-demo/PROGRESS.md`)
Copilot creates this on your first "Run the next step" (section 00). This is the exact template:

```markdown
# DeskPilot build progress
Tick a line only when its "Test in the app" checks pass. Commit after every tick.

- [ ] setup — 04 Setup (MANUAL)
- [ ] rules — 05.1 Rules file
- [ ] step1 — 06 Plan with AI (Ask)
- [ ] step2 — 07 Read tools
- [ ] step3 — 08 Write tools
- [ ] step4 — 09 System prompt
- [ ] step5 — 10 API routes
- [ ] step6-kit — 11 Part A design kit (MANUAL paste)
- [ ] step6 — 11 Parts B and C employee screen
- [ ] step7 — 12 IT Desk screen
- [ ] step8-build — 13 npm run build (MANUAL + Ask)
- [ ] step8-deploy — 13 Commit, push, Vercel (MANUAL)
- [ ] test — 14 Six moments (MANUAL)

## Optional (after test)
- [ ] stretch-1 — 16.1 Did that fix it?
- [ ] stretch-2 — 16.2 Me too on outages
- [ ] stretch-3 — 16.3 Ticket notes
- [ ] stretch-4 — 16.4 SLA escalation
- [ ] stretch-5 — 16.5 Warranty-aware advice
- [ ] stretch-6 — 16.6 Passes wallet
- [ ] stretch-7 — 16.7 Mobile check
```

### 3. Run one step at a time (the step guard)
Copilot can write almost all of DeskPilot, but **only if you feed it one step at a time**. Ask for everything at once and it loses context, skips business rules and writes tickets straight into the table.

1. Save this handbook in your repo as `live-demo/LIVE_BUILD_PROMPTS.md` (every prompt points to it with `#file:`). The easy way is the single prompt in section 00, where Copilot picks the right block for you. You can also copy each block below by hand; both use the same guard.
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

---

## 06 Step 1: Plan with AI

* **MODE:** `Ask` (Ask only answers; it does not change files. Ask for planning, Agent for building.)

**COPILOT PROMPT:**
```text
STEP 1 (Plan) ONLY. Context: #file:.github/copilot-instructions.md and section 06 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Setup — repo, .env.local, seed/deskpilot.sql run in Supabase, rules file.
#codebase Read this Next.js starter, .github/copilot-instructions.md and seed/deskpilot.sql.
I want to turn this starter into DeskPilot, an AI IT helpdesk agent for campus staff.
Employees describe IT problems in plain English; the agent first searches the knowledge base for a self-fix, checks service status for known outages, looks at the employee's devices and existing tickets, and only then raises a ticket. An IT Desk screen shows live tickets that technicians move from open to in progress to resolved to closed.
Give me a short build plan: which files to create or change, which read tools and write tools we need (name, arguments, table), which API routes and pages. Do not write code yet.

STEP GUARD (follow exactly):
- Ask mode: do NOT write, create or change any file.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- In the plan, show where each business rule lives (database function vs TypeScript) and number the steps exactly like the handbook: Step 2 read tools, Step 3 write tools, Step 4 system prompt, Step 5 API routes, Step 6 employee screen, Step 7 IT Desk, Step 8 build and deploy.
- End with "STEP 1 done — waiting for you." Then STOP.
```

* **Check:** the plan names six tools (4 read, 2 write), `lib/deskpilot.ts`, the API routes (`/api/status`, `/api/me`, `/api/desk`), the `/desk` page, and says to use `create_ticket` / `cancel_ticket` instead of inserting tickets directly.
* **Key idea:** good developers plan before they code, even with AI. If the plan is wrong, fix it now — it costs one prompt, not ten.

---

## 07 Step 2: Read tools (the agent's eyes)

* **MODE:** `Agent`

**COPILOT PROMPT:**
```text
STEP 2 (Read tools) ONLY. Context: #file:.github/copilot-instructions.md and section 07 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Setup and Step 1 (plan).
In #file:lib/agent/tools.ts replace the 3 task example tools with 4 read tools for DeskPilot, using defineTool like the existing examples.
Create lib/deskpilot.ts with: export const CURRENT_EMPLOYEE_ID = "E001"; export const CATEGORIES = ["network","hardware","software","access","email"] as const; a helper formatIST(iso) -> "12 Nov, 2:45 pm" in Asia/Kolkata; and slaText(iso) -> "due in 3h 20m" or "overdue by 40m".
- searchKnowledgeBase: args query (string, 2-100 chars) and optional category (enum CATEGORIES). Remove every character that is not a letter, digit or space from the query, split into words of 3+ letters, and match any word against title or keywords with ilike (use .or()). Rank by how many words matched and return the top 3 with id, category, title, steps. If nothing matches return { articles: [], note: "No self-fix article found" }.
- getServiceStatus: no args. Returns service, category, status, message for all rows, down first, then degraded, then operational.
- getMyAssets: no args. Returns id, type, model, warranty_until and in_warranty (boolean) for CURRENT_EMPLOYEE_ID.
- getMyTickets: no args. Returns the employee's last 10 tickets (newest first) with id, title, category, priority, status, asset_id, technician name (join technicians) and sla_due as formatIST plus slaText for open/in_progress tickets.
Descriptions must start with "Use this when...". Never take an employee id as an argument.

STEP GUARD (follow exactly):
- Do ONLY STEP 2. Do not start later steps, refactor, rename or "improve" anything else. Change only: lib/deskpilot.ts (new) and lib/agent/tools.ts (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Read tools only: no tool in this step may insert, update or delete anything.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 2 from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STEP 2 done — waiting for you." Then STOP.
```

* **Check before Keep:** `lib/deskpilot.ts` exists; the query is cleaned before `.or()` (otherwise a comma or bracket in the user's text breaks the filter); no tool takes an employee id; the `tools` array has the 4 tools.
* **Test in the app:** type (do not click the old sample buttons) `How do I connect to VPN from home?` and `Which of my devices are still under warranty?`. You should see the GlobalProtect steps (and maybe a note that VPN is degraded), and that laptop `LT-1042` is **out of warranty**.
* **Remember:** the screen does not change in this step. Only the agent's tools changed. The screen changes in Step 6.
* **Key idea:** an AI agent is only as good as its tools. Click the grey `Done · searchKnowledgeBase` box: Gemini chose `query: "vpn home"` and `category: "network"` by itself.

---

## 08 Step 3: Write tools (the agent's hands)

* **MODE:** `Agent`

**COPILOT PROMPT:**
```text
STEP 3 (Write tools) ONLY. Context: #file:.github/copilot-instructions.md and section 08 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Setup, Step 1, Step 2 (4 read tools + lib/deskpilot.ts).
In #file:lib/agent/tools.ts add 2 write tools (writes: true):
- createTicket: args category (enum CATEGORIES), priority (enum low, medium, high, critical), title (string 5-80 chars, a short summary written by the agent), description (string up to 1000 chars: symptoms, what the employee already tried, any deadline), asset_id (optional string, must be an id from getMyAssets).
  Call getSupabase().rpc("create_ticket", { p_employee_id: CURRENT_EMPLOYEE_ID, p_category: category, p_priority: priority, p_title: title, p_description: description, p_asset_id: asset_id ?? null }).
  Throw new Error(error.message) on error, else return data plus sla_due (formatIST) and sla_text (slaText).
- cancelTicket: arg ticket_id (positive integer). Call rpc("cancel_ticket", { p_employee_id: CURRENT_EMPLOYEE_ID, p_ticket_id: ticket_id }) the same way.
Do not insert or update tickets, technicians or ticket_events directly in TypeScript; the database functions do all checks.
The tools array must be exactly: searchKnowledgeBase, getServiceStatus, getMyAssets, getMyTickets, createTicket, cancelTicket.

STEP GUARD (follow exactly):
- Do ONLY STEP 3. Do not start later steps, refactor, rename or "improve" anything else. Change only: lib/agent/tools.ts (and lib/deskpilot.ts only if a helper is missing) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Keep the 4 read tools exactly as they are. The write tools must return the database function's refusal message as-is so the agent can explain it.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 3 from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STEP 3 done — waiting for you." Then STOP.
```

* **Check before Keep:** both tools have `writes: true` and use `rpc(...)`; there is no `.insert(` or `.update(` on `tickets`; the rpc argument names start with `p_` and match the SQL exactly; all 6 tools are in the array.
* **Remember:** do not test ticket creation yet. Without the Step 4 system prompt the agent may invent asset ids, pick the wrong priority, skip the self-fix, or cancel its own ticket. Go straight to Step 4.
* **Key idea:** a write tool is a *thin* wrapper. The TypeScript only passes arguments; the database decides. That is why the AI cannot break the rules.

---

## 09 Step 4: System prompt (the agent's job description)

* **MODE:** `Agent`

**COPILOT PROMPT:**
```text
STEP 4a (System prompt) ONLY. Context: #file:.github/copilot-instructions.md and section 09 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Setup and Steps 1–3 (6 tools).
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
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 4a from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STEP 4a done — waiting for you." Then STOP.
```

Then give the agent a little more room:

**COPILOT PROMPT:**
```text
STEP 4b (Agent rounds) ONLY. Context: #file:.github/copilot-instructions.md and section 09 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Setup and Steps 1–4a.
In #file:lib/agent/runAgent.ts change MAX_ROUNDS from 5 to 8.

STEP GUARD (follow exactly):
- Do ONLY STEP 4b. Do not start later steps, refactor, rename or "improve" anything else. Change only: the MAX_ROUNDS line in lib/agent/runAgent.ts (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 4b from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STEP 4b done — waiting for you." Then STOP.
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

---

## 10 Step 5: API routes

* **MODE:** `Agent`

API routes are the "waiters" that carry data between the screens and the database. The screens never talk to Supabase directly.

**COPILOT PROMPT:**
```text
STEP 5 (API routes) ONLY. Context: #file:.github/copilot-instructions.md and section 10 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Setup and Steps 1–4 (agent works in the chat).
Create 3 API routes, following the pattern of #file:app/api/tasks/route.ts:
1. app/api/status/route.ts GET: all service_status rows, down first, then degraded, then operational.
2. app/api/me/route.ts GET: the employee row for CURRENT_EMPLOYEE_ID, their assets, their last 5 tickets (with category, technician name, raw created_at and sla_due_at ISO strings, formatIST sla_due and slaText), active_count (tickets with status open or in_progress) and next_sla (the active ticket with the earliest sla_due_at: id, title, technician, created_at, sla_due_at, or null).
3. app/api/desk/route.ts GET: returns { tickets, kpis, hourly }. tickets = status open, in_progress or resolved, with category, employee name and department, asset model, technician name, raw created_at and sla_due_at, sla_due and sla_text, and breached (sla_due_at < now and status not resolved), sorted in TypeScript by priority rank (critical, high, medium, low), then sla_due_at oldest first. kpis = { open, in_progress, breached, resolved_today }. hourly = 12 objects { label: "2 pm", count } for tickets created in each of the last 12 hours (IST labels).
   POST { ticket_id, status }: validate with Zod. Only allow the next step: open -> in_progress -> resolved -> closed. Do the update with .eq("id", ticket_id).eq("status", previousStatus) so two technicians clicking at once cannot both win; if no row changed return 409. On success also insert a ticket_events row (actor "IT Desk", note "Status changed to <status>") and set updated_at.
Add export const dynamic = "force-dynamic" to each. Log errors with console.error.
Also update app/api/health/route.ts to check the kb_articles table instead of tasks.

STEP GUARD (follow exactly):
- Do ONLY STEP 5. Do not start later steps, refactor, rename or "improve" anything else. Change only: app/api/status/route.ts, app/api/me/route.ts, app/api/desk/route.ts (new) and app/api/health/route.ts (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- The IT Desk status move in /api/desk POST is the ONLY place TypeScript updates tickets directly, and only with the next-step check plus .eq("status", previousStatus). Use getSupabase() only inside app/api/ and lib/. Do not touch any UI yet.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 5 from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STEP 5 done — waiting for you." Then STOP.
```

* **Test in the app:** open `localhost:3000/api/status` (Outlook Email is `down` first), `/api/me` (Karthik, 3 devices, your tickets, `active_count: 3`, `next_sla` = the Wi-Fi ticket) and `/api/desk` (your new ticket on top of `tickets`, `kpis.open`, and 12 `hourly` buckets).
* **Why the extra fields?** The screens in Steps 6–7 draw SLA bars, a hero countdown and a bar chart. Shaping that data in the API keeps the components simple and the secret key on the server.
* **Key idea:** the `.eq("status", previousStatus)` trick is a tiny lock. A business rule (only the next step is allowed) is checked where the data changes.

---

## 11 Step 6: Employee screen (with the DeskPilot design kit)

* **MODE:** paste files (Part A), then `Agent` (Parts B and C)

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
   ```css
@import "tailwindcss";

/* DeskPilot design tokens (shadcn-compatible names). Dark by default. */
@custom-variant dark (&:is(.dark *));

:root {
  --radius: 26px;
  --background: oklch(0.145 0.004 260);
  --foreground: oklch(0.97 0.003 260);
  --card: oklch(0.19 0.005 260);
  --card-foreground: oklch(0.97 0.003 260);
  --muted: oklch(0.25 0.006 260);
  --muted-foreground: oklch(0.68 0.012 260);
  --border: oklch(1 0 0 / 0.08);
  --ring: oklch(0.89 0.2 128 / 0.6);

  --accent: oklch(0.89 0.2 128);   /* signal lime: live, healthy, primary action */
  --accent-2: oklch(0.74 0.12 300); /* lilac: in progress, info */
  --warn: oklch(0.82 0.15 75);      /* amber: degraded, high, SLA under 1h */
  --danger: oklch(0.7 0.19 25);     /* coral: down, critical, breached */
  --ink: oklch(0.24 0.06 135);      /* text on lime */
}

@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-accent: var(--accent);
  --color-accent-2: var(--accent-2);
  --color-warn: var(--warn);
  --color-danger: var(--danger);
  --color-ink: var(--ink);
}

body {
  @apply bg-background text-foreground antialiased;
  font-feature-settings: "ss01", "cv11";
}

::selection {
  background: color-mix(in oklch, var(--accent) 35%, transparent);
}

@keyframes dp-pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in oklch, currentColor 55%, transparent); }
  100% { box-shadow: 0 0 0 7px transparent; }
}
@keyframes dp-rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; transition-duration: 1ms !important; }
}
   ```
3. Replace **all** of `app/layout.tsx` with:
   ```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "DeskPilot · Campus IT helpdesk agent",
  description: "AI IT helpdesk agent: self-fix first, ticket second.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable} min-h-screen font-sans`}>{children}</body>
    </html>
  );
}
   ```
4. Create `components/ui/desk-ui.tsx` and paste:
   ```tsx
"use client";

import * as React from "react";
import { AppWindow, Cpu, KeyRound, Mail, Wifi, type LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tokens                                                             */
/* ------------------------------------------------------------------ */

export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export type Tone = "ok" | "info" | "warn" | "danger" | "muted";

export const TONE: Record<Tone, string> = {
  ok: "var(--accent)",
  info: "var(--accent-2)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  muted: "var(--muted-foreground)",
};

export const PRIORITY_TONE: Record<string, Tone> = { critical: "danger", high: "warn", medium: "info", low: "muted" };
export const STATUS_TONE: Record<string, Tone> = {
  open: "ok",
  in_progress: "info",
  resolved: "ok",
  closed: "muted",
  cancelled: "muted",
};
export const SERVICE_TONE: Record<string, Tone> = { operational: "ok", degraded: "warn", down: "danger" };

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  network: Wifi,
  hardware: Cpu,
  software: AppWindow,
  access: KeyRound,
  email: Mail,
};

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function tint(tone: Tone, pct = 16) {
  return `color-mix(in oklch, ${TONE[tone]} ${pct}%, transparent)`;
}

/** "3h 20m", "40m", "45s" */
export function formatLeft(ms: number) {
  const s = Math.max(0, Math.floor(Math.abs(ms) / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function useMounted() {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return on;
}

/** Animates from the previous value to the new one, so live updates glide instead of jump. */
export function useCountUp(target: number, duration = 1100) {
  const reduced = useReducedMotion();
  const [value, setValue] = React.useState(0);
  const from = React.useRef(0);
  React.useEffect(() => {
    if (reduced) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const v = start + (target - start) * (1 - Math.pow(1 - p, 4));
      from.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);
  return value;
}

/** Current time, ticking. Null on the server and first render, so there is no hydration mismatch. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

export function Tile({
  title,
  action,
  variant = "default",
  className,
  style,
  children,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const accent = variant === "accent";
  return (
    <section
      className={cx(
        "relative flex min-w-0 flex-col overflow-hidden rounded-[26px] p-5",
        accent ? "bg-accent text-ink" : "border border-border bg-card text-card-foreground",
        className,
      )}
      style={style}
    >
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h3 className={cx("text-[13px]", accent ? "font-semibold opacity-75" : "font-medium text-muted-foreground")}>{title}</h3>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Dot({ tone = "ok", pulse = false, className }: { tone?: Tone; pulse?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("inline-block size-2 shrink-0 rounded-full", className)}
      style={{
        background: TONE[tone],
        color: TONE[tone],
        animation: pulse ? "dp-pulse 1.6s ease-out infinite" : undefined,
      }}
    />
  );
}

export function Spinner({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin motion-reduce:animate-none" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Small mono pill. Colour comes from the tone, background is a soft tint of it. */
export function Chip({
  tone = "muted",
  spin = false,
  strike = false,
  children,
  className,
}: {
  tone?: Tone;
  spin?: boolean;
  strike?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-wide",
        strike && "line-through",
        className,
      )}
      style={{ background: tint(tone), color: TONE[tone] }}
    >
      {spin && <Spinner />}
      {children}
    </span>
  );
}

export function LiveBadge({ label = "Live" }: { label?: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[12px] font-medium">
      <Dot tone="ok" pulse />
      {label}
    </span>
  );
}

export function Pills<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-border p-0.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cx(
            "rounded-full px-2.5 py-1 font-mono text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === o ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** Big mono number that counts up. */
export function BigNumber({
  value,
  decimals = 0,
  suffix,
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: React.ReactNode;
  className?: string;
}) {
  const shown = useCountUp(value);
  return (
    <p className={cx("font-mono font-semibold leading-none tracking-[-0.04em] tabular-nums", className ?? "text-[40px]")}>
      {shown.toFixed(decimals)}
      {suffix && <span className="ml-0.5 text-[0.45em] tracking-normal opacity-70">{suffix}</span>}
    </p>
  );
}

/** Segmented "x of N" meter, e.g. active tickets 3 of 3. */
export function SegmentMeter({ value, max, label }: { value: number; max: number; label: string }) {
  const mounted = useMounted();
  const full = value >= max;
  return (
    <div role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className="flex gap-1.5">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className="h-2 flex-1 rounded-full bg-muted"
          style={{
            background: i < value && mounted ? (full ? TONE.warn : TONE.ok) : undefined,
            transition: `background 500ms ease ${i * 120}ms`,
          }}
        />
      ))}
    </div>
  );
}

/** Bar that drains from created → due. Lime with time left, amber under 1h, coral when breached. */
export function SlaBar({ createdAt, dueAt, now }: { createdAt: string; dueAt: string; now: number | null }) {
  if (now === null) return <div className="h-1.5 rounded-full bg-muted" />;
  const start = new Date(createdAt).getTime();
  const due = new Date(dueAt).getTime();
  const left = due - now;
  const pct = Math.max(0, Math.min(100, (left / Math.max(1, due - start)) * 100));
  const tone: Tone = left <= 0 ? "danger" : left < 3600_000 ? "warn" : "ok";
  return (
    <div className="space-y-1">
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${left <= 0 ? 100 : pct}%`, background: TONE[tone], transition: `width 900ms ${EASE}` }}
        />
      </div>
      <p className="font-mono text-[10.5px] tabular-nums" style={{ color: TONE[tone] }}>
        {left <= 0 ? `SLA breached ${formatLeft(left)} ago` : `SLA ${formatLeft(left)} left`}
      </p>
    </div>
  );
}

/** Animated bar strip (like a PnL strip). Hover or focus a bar to read its label. */
export function BarStrip({
  values,
  labels,
  tone = "ok",
  height = 64,
  caption = "",
}: {
  values: number[];
  labels: string[];
  tone?: Tone;
  height?: number;
  caption?: string;
}) {
  const mounted = useMounted();
  const [hover, setHover] = React.useState<number | null>(null);
  const max = Math.max(...values, 1);
  return (
    <div>
      <div className="flex items-end gap-[3px]" style={{ height }} onPointerLeave={() => setHover(null)}>
        {values.map((v, i) => (
          <button
            key={i}
            type="button"
            onPointerEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            aria-label={`${labels[i]}: ${v}`}
            className="flex-1 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              height: mounted ? `${10 + (v / max) * 90}%` : "6%",
              background: v === 0 ? "var(--muted)" : TONE[tone],
              opacity: hover === null ? 0.35 + (v / max) * 0.65 : hover === i ? 1 : 0.25,
              transition: `height 900ms ${EASE} ${i * 18}ms, opacity 200ms ease`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>{labels[0]}</span>
        <span className="text-foreground" aria-live="polite">
          {hover !== null ? `${labels[hover]} · ${values[hover]}` : caption}
        </span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}

/** Fade-and-rise entry with a stagger. Use inside lists. */
export function Rise({
  index = 0,
  as: As = "div",
  className,
  children,
}: {
  index?: number;
  as?: "div" | "li";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <As className={className} style={{ animation: `dp-rise 500ms ${EASE} both`, animationDelay: `${120 + index * 70}ms` }}>
      {children}
    </As>
  );
}

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = CATEGORY_ICON[category] ?? AppWindow;
  return (
    <span className={cx("grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-foreground", className)}>
      <Icon size={16} strokeWidth={1.9} aria-hidden />
    </span>
  );
}

/** One row in a list: icon, title, detail, right side. Same rhythm as an activity feed. */
export function FeedRow({
  icon,
  title,
  detail,
  right,
  index = 0,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  detail?: React.ReactNode;
  right?: React.ReactNode;
  index?: number;
}) {
  return (
    <Rise as="li" index={index} className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-muted/50">
      {icon}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">{title}</p>
        {detail && <p className="truncate text-[11px] text-muted-foreground">{detail}</p>}
      </div>
      {right && <div className="flex shrink-0 flex-col items-end gap-1 text-right">{right}</div>}
    </Rise>
  );
}
   ```
5. Create `components/ui/device-stack.tsx` and paste the **wallet card stack** — fanned, bank-card-shaped cards with a holographic glare; click a back card and it springs to the front, and a frosted panel underneath shows the front card's details:
   ```tsx
   "use client";

   import * as React from "react";
   import type { LucideIcon } from "lucide-react";
   import { Chip, Tile, useMounted, useReducedMotion, type Tone } from "@/components/ui/desk-ui";

   /* ------------------------------------------------------------------ */
   /*  Wallet-style card stack: fanned cards, click one to bring it front */
   /* ------------------------------------------------------------------ */

   export interface StackCard {
     id: string;
     /** Big label on the card face, e.g. "Laptop" */
     label: string;
     /** Short code in the top-right corner, e.g. the asset id "LT-1042" */
     code: string;
     /** First footer line when this card is in front, e.g. the model */
     title: string;
     /** Second footer line, e.g. "Covered until 31 Mar 2027" */
     subtitle?: string;
     /** Chip on the right of the footer */
     badge?: { label: string; tone: Tone };
     /** Optional icon on the card face (instead of the EMV chip) */
     icon?: LucideIcon;
     /** Face gradient: base colour, second colour, text colour */
     color: string;
     color2: string;
     ink: string;
   }

   /** Ready-made faces in the DeskPilot palette. */
   export const CARD_FACES = {
     lime: { color: "oklch(0.89 0.2 128)", color2: "oklch(0.74 0.17 165)", ink: "oklch(0.22 0.06 140)" },
     lilac: { color: "oklch(0.8 0.1 300)", color2: "oklch(0.64 0.15 285)", ink: "oklch(0.2 0.06 290)" },
     amber: { color: "oklch(0.82 0.11 55)", color2: "oklch(0.7 0.15 30)", ink: "oklch(0.25 0.05 40)" },
     steel: { color: "oklch(0.78 0.02 250)", color2: "oklch(0.55 0.03 260)", ink: "oklch(0.2 0.02 260)" },
   } as const;

   function CardChip() {
     return (
       <svg width="26" height="20" viewBox="0 0 26 20" aria-hidden>
         <rect x="0.5" y="0.5" width="25" height="19" rx="4.5" fill="oklch(0.9 0.06 90)" stroke="oklch(0.62 0.07 80 / 0.6)" />
         <path d="M0.5 7h7.5v6H0.5M25.5 7H18v6h7.5M8 0.5v19M18 0.5v19M8 10h10" fill="none" stroke="oklch(0.6 0.07 80 / 0.55)" strokeWidth="0.9" />
       </svg>
     );
   }

   function CardFace({ c, glare }: { c: StackCard; glare: number }) {
     const Icon = c.icon;
     return (
       <>
         <span
           aria-hidden
           className="absolute inset-0 overflow-hidden rounded-[12px]"
           style={{
             backgroundImage: [
               "linear-gradient(180deg, oklch(1 0 0 / 0.3) 0%, transparent 34%)",
               `radial-gradient(110% 90% at 100% 0%, ${c.color2} 0%, transparent 60%)`,
               `linear-gradient(135deg, ${c.color} 0%, ${c.color2} 100%)`,
             ].join(", "),
             boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.5), inset 0 0 0 1px oklch(1 0 0 / 0.16)",
           }}
         >
           {/* holographic film */}
           <span
             className="absolute inset-0"
             style={{
               backgroundImage:
                 "linear-gradient(115deg, transparent 18%, oklch(0.9 0.12 350 / 0.55) 32%, oklch(0.92 0.1 220 / 0.55) 42%, oklch(0.94 0.14 130 / 0.5) 52%, oklch(0.92 0.12 60 / 0.45) 62%, transparent 78%)",
               backgroundSize: "260% 100%",
               backgroundPosition: `${glare}% 0`,
               mixBlendMode: "soft-light",
               transition: "background-position 700ms cubic-bezier(0.22, 1, 0.36, 1)",
             }}
           />
         </span>

         <span className="relative flex items-center justify-between gap-3 px-4 pt-4">
           <span className="flex min-w-0 items-center gap-2.5">
             {Icon ? <Icon size={20} strokeWidth={2} aria-hidden /> : <CardChip />}
             <span className="truncate text-[13px] font-bold tracking-tight">{c.label}</span>
           </span>
           <span className="shrink-0 font-mono text-[12px] font-semibold tabular-nums">{c.code}</span>
         </span>

         <span className="absolute bottom-3.5 right-4 opacity-70" aria-hidden>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
             <path d="M8.5 7.5a6 6 0 0 1 0 9M12 5a9.5 9.5 0 0 1 0 14M15.5 2.5a13 13 0 0 1 0 19" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
           </svg>
         </span>
       </>
     );
   }

   export function CardStack({
     title,
     cards,
     onFrontClick,
     frontHint,
     className,
   }: {
     title: React.ReactNode;
     /** Back → front */
     cards: StackCard[];
     /** Called when the card already in front is clicked (e.g. to start a chat about it) */
     onFrontClick?: (card: StackCard) => void;
     /** Accessible hint for the front card action, e.g. "report a problem" */
     frontHint?: string;
     className?: string;
   }) {
     const reduced = useReducedMotion();
     const mounted = useMounted();
     const ids = cards.map((c) => c.id).join("|");
     const [order, setOrder] = React.useState(() => cards.map((c) => c.id));
     // Keep the order in sync when the data reloads (new or removed cards).
     React.useEffect(() => {
       setOrder((o) => {
         const next = cards.map((c) => c.id);
         const kept = o.filter((id) => next.includes(id));
         return [...next.filter((id) => !kept.includes(id)), ...kept];
       });
       // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [ids]);

     const dragGlare = React.useRef(false);
     const [glare, setGlare] = React.useState(30);
     React.useEffect(() => {
       if (reduced) return;
       let raf = 0;
       const t0 = performance.now();
       const tick = (now: number) => {
         setGlare((g) => (dragGlare.current ? g : 30 + Math.sin((now - t0) / 2600) * 30));
         raf = requestAnimationFrame(tick);
       };
       raf = requestAnimationFrame(tick);
       return () => cancelAnimationFrame(raf);
     }, [reduced]);

     const visible = order.map((id) => cards.find((c) => c.id === id)).filter((c): c is StackCard => Boolean(c));
     if (visible.length === 0) {
       return (
         <Tile title={title} className={className}>
           <p className="text-[13px] text-muted-foreground">Nothing here yet.</p>
         </Tile>
       );
     }
     const PEEK = 46;
     const depth = visible.length - 1;
     const front = visible[visible.length - 1];

     return (
       <Tile
         title={
           <span>
             {title} <sup className="font-mono text-[10px]">{visible.length}</sup>
           </span>
         }
         className={className}
       >
         <div
           className="relative -mx-5 -mb-5 flex flex-1 flex-col justify-end overflow-hidden pt-1"
           onPointerMove={(e) => {
             const r = e.currentTarget.getBoundingClientRect();
             dragGlare.current = true;
             setGlare(((e.clientX - r.left) / r.width) * 100);
           }}
           onPointerLeave={() => {
             dragGlare.current = false;
           }}
         >
           <div className="relative">
             {visible.map((c, pos) => {
               const fromFront = visible.length - 1 - pos; // 0 = front
               const isFront = fromFront === 0;
               return (
                 <button
                   key={c.id}
                   type="button"
                   onClick={() => (isFront ? onFrontClick?.(c) : setOrder((o) => [...o.filter((x) => x !== c.id), c.id]))}
                   aria-label={`${c.label} ${c.code}${isFront ? (frontHint ? `, ${frontHint}` : ", selected") : ", bring to front"}`}
                   aria-pressed={isFront}
                   className="group absolute left-1/2 block w-[calc(100%-32px)] max-w-[300px] rounded-[12px] p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                   style={{
                     top: (depth - fromFront) * PEEK,
                     zIndex: pos + 1,
                     transform: `translateX(-50%) scale(${1 - fromFront * 0.055}) translateY(${mounted ? 0 : 20}px)`,
                     transformOrigin: "top center",
                     opacity: mounted ? 1 : 0,
                     color: c.ink,
                     boxShadow: "0 -10px 28px -14px oklch(0 0 0 / 0.75)",
                     transition: reduced
                       ? "none"
                       : `top 650ms cubic-bezier(0.34, 1.35, 0.64, 1), transform 650ms cubic-bezier(0.34, 1.35, 0.64, 1), opacity 500ms ease ${pos * 90}ms`,
                     cursor: isFront && !onFrontClick ? "default" : "pointer",
                   }}
                 >
                   {/* bank-card ratio (85.6 × 54 mm) */}
                   <span className="relative block w-full" style={{ paddingTop: "63.08%" }}>
                     <span className="absolute inset-0 block">
                       <CardFace c={c} glare={glare + fromFront * 18} />
                     </span>
                   </span>
                 </button>
               );
             })}

             {/* Spacer: gives the stack its real height so the front card is never squeezed */}
             <div aria-hidden className="invisible mx-auto w-[calc(100%-32px)] max-w-[300px] shrink-0" style={{ marginTop: depth * PEEK }}>
               <div style={{ paddingTop: "30%" }} />
             </div>
           </div>

           {/* Frosted panel the stack tucks under */}
           <div
             className="relative z-10 flex shrink-0 items-end justify-between gap-3 px-5 pb-4"
             style={{
               height: 88,
               background: "color-mix(in oklch, var(--color-card) 72%, transparent)",
               backdropFilter: "blur(18px) saturate(1.3)",
               WebkitBackdropFilter: "blur(18px) saturate(1.3)",
               borderTop: "1px solid color-mix(in oklch, var(--color-foreground) 10%, transparent)",
             }}
             aria-live="polite"
           >
             <div className="min-w-0">
               <p className="truncate font-mono text-[15px] font-semibold tabular-nums tracking-[0.04em]">{front.title}</p>
               {front.subtitle && <p className="mt-1 truncate text-[11px] text-muted-foreground">{front.subtitle}</p>}
             </div>
             {front.badge && <Chip tone={front.badge.tone}>{front.badge.label}</Chip>}
           </div>
         </div>
       </Tile>
     );
   }
   ```
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

### Part B and C — Build the employee screen

**COPILOT PROMPT:**
```text
STEP 6 (Employee screen) ONLY. Context: #file:.github/copilot-instructions.md and section 11, Parts B and C of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Setup, Steps 1–5 and Step 6 Part A (design kit pasted and committed).
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
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 6 from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STEP 6 done — waiting for you." Then STOP.
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

---

## 12 Step 7: IT Desk screen

* **MODE:** `Agent`

The IT Desk is a wall screen: it must be readable from 3 metres and show *what needs attention now* without anyone touching it.

**COPILOT PROMPT:**
```text
STEP 7 (IT Desk screen) ONLY. Context: #file:.github/copilot-instructions.md and section 12 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Setup and Steps 1–6 (employee screen works).
Create app/desk/page.tsx, a full-screen IT Desk board built ONLY with #file:components/ui/desk-ui.tsx and the tokens in #file:app/globals.css (no raw Tailwind colour classes).
1. Top bar: lime Dot + wordmark "DeskPilot · IT Desk", a LiveBadge, the current IST time in big mono (from useNow, rendered only when not null), and Pills to filter by category: all, network, hardware, software, access, email.
2. KPI row (grid of 4 tiles): "Open" BigNumber; "In progress" BigNumber; "SLA breached" — this tile becomes Tile variant="accent" style but with background var(--danger) when breached > 0, otherwise a normal Tile showing 0 with a lime check; "Last 12 hours" with a BarStrip of hourly counts (labels like "2 pm", caption "Tickets per hour").
3. Board: 3 Tiles as columns — Open, In progress, Resolved — each header with a Dot (ok, info, ok) and a mono count Chip. Columns scroll inside on desktop and stack on mobile.
4. Ticket card (inside a column): rounded-2xl bg-muted/40 border border-border p-4, a 3px left stripe in the priority colour (PRIORITY_TONE). Row 1: mono "#id", priority Chip, and a CategoryIcon at the right. Row 2: title (15px, medium). Row 3: muted "employee · department · device model". Row 4: technician as a small pill with initials avatar, or a warn Chip "Unassigned". Row 5: SlaBar (hide it for resolved). If breached, the card gets a 1px danger ring and a danger Chip "SLA breached".
5. One full-width action button per card: "Start work" (open, lime bg, text-ink), "Mark resolved" (in_progress, lilac bg), "Close" (resolved, outline). It calls POST /api/desk, is disabled with a Spinner while the request runs, moves the card optimistically, and on 409 shows a small "Already updated" Chip and reloads.
6. A ticket created less than 15 seconds ago gets a soft lime glow (box-shadow with color-mix of var(--accent)) and a "NEW" Chip so the desk notices it.
7. Wrap cards in Rise keyed by ticket id so only new cards animate. Sort inside each column by priority rank then sla_due_at.
8. Reload /api/desk every 3 seconds. Handle related rows that may be an object or an array.

STEP GUARD (follow exactly):
- Do ONLY STEP 7. Do not start later steps, refactor, rename or "improve" anything else. Change only: app/desk/page.tsx and new files under components/desk/ (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- Build UI only with components/ui/desk-ui.tsx, components/ui/device-stack.tsx and the tokens in app/globals.css; do not edit those three kit files or app/layout.tsx. No raw Tailwind colours (slate-, red-, emerald-…), every number/id/time in font-mono tabular-nums.
- Do not change lib/agent/*, lib/deskpilot.ts or the SQL. Screens read data only through the API routes from Step 5.
- Do not change the employee screen or its components.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STEP 7 from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STEP 7 done — waiting for you." Then STOP.
```

* **Check:** the file must be exactly `app/desk/page.tsx`. If `/desk` shows `404`, restart with `Ctrl+C` and `npm run dev`.
* **Test in the app:** put the employee screen and `/desk` side by side.
  * Your ticket #6 appears near the top of **Open** with an amber stripe, a lime **NEW** glow and **Divya Raj** as the technician.
  * #1 and #4 sit under **In progress**; the "Last 12 hours" bars grow in from the bottom.
  * Click **Start work** on #6: the button shows a spinner, the card glides to **In progress**, and within 5 seconds the employee screen's chip turns lilac with a spinner.
* **Design check:** stand back 3 metres. Can you tell which ticket is most urgent in 2 seconds? If not, ask Copilot to increase the size contrast between the title and the meta line.

---

## 13 Step 8: Build, commit and deploy

* **MODE:** `Ask`

PROGRESS id `step8-build`. **You** stop the app (`Ctrl+C`) and run `npm run build`. If it says `Compiled successfully`, tick `step8-build`. If there are errors, send this in **Ask** mode:

**COPILOT PROMPT:**
```text
STEP 8 (Fix build errors) ONLY. Context: #file:.github/copilot-instructions.md and section 13 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Steps 1–7.
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

---

## 14 Full test: six moments

> **MANUAL — you do this, not Copilot.** PROGRESS id `test`. If a moment fails, start a new chat: `#file:live-demo/LIVE_BUILD_PROMPTS.md Moment <n> of section 14 fails: <what you see>. Find the cause in the step that built it, fix only that, keep every business rule.`

Run `seed/deskpilot.sql` again in Supabase for fresh data. Open the employee screen on the left and `/desk` on the right.

| # | Type or do | What you should see | What it shows |
| :--- | :--- | :--- | :--- |
| 1 | `"How do I connect to VPN from home?"` | `searchKnowledgeBase` with `category: network`; GlobalProtect steps; maybe a VPN "degraded" note; **no ticket** | Self-fix first: the cheapest ticket is the one never raised |
| 2 | `"My laptop won't connect to Wi-Fi since morning. I already restarted it and I have a lab class at 2 pm."` | Five tools; ticket #6, **high**, **Divya Raj**, SLA 4 h; meter shows 3 of 3; card appears on the IT Desk | One sentence, five tools, a technician picked by rules |
| 3 | `"My second monitor keeps flickering too, log it."` | Refused: limit of 3 active tickets; monitor self-fix steps; suggests cancelling #5 | Rules in the database cannot be broken |
| 4 | IT Desk: **Start work** on #6 | Employee badge turns `in_progress` within 5 seconds | Two screens share live data |
| 5 | `"Cancel my Wi-Fi ticket."` | Refused: the technician has already started work | Business rules protect the technician too |
| 6 | `"Cancel my MATLAB ticket."` then `"Now log the monitor flicker."` | #5 cancelled, meter drops to 2 of 3; new **medium** hardware ticket for `MN-220`, assigned to **Meena Pillai** | Every write can be undone correctly, and freed capacity is reused |

* **Tip:** click a grey tool step to see the arguments Gemini sent and the result your code returned. Look at the `title` and `description` the agent wrote for ticket #6 — that is the "well-written ticket" a human technician wants.
* **More to try:**
  * `"Outlook is not syncing, raise a ticket."` (known outage — refused with the webmail workaround)
  * `"The CS printer is jamming again."` (duplicate of #4)
  * `"Raise a ticket for Rohan's desktop DT-3001."` (device not registered to you)
  * `"I clicked a link in a weird email and typed my password."` (should be **critical**, 2 h SLA — cancel another ticket first if you are at 3 of 3)
  * `"Write me a poem."` (the agent stays on topic)
* **Reset any time:** run `seed/deskpilot.sql` again.

---

## 15 Understand the agent loop

Judges will ask: *"How does your agent work?"* Every team member should be able to answer.

1. Open `lib/agent/runAgent.ts` and select the `for` loop.
2. In Copilot Chat (**Ask** mode), type `/explain` and send.
3. In your own words, write 3 lines in `README.md` under the heading `"How the agent works"`.

* **Check:** your 3 lines cover: Gemini receives the message, the system prompt and the tool list; Gemini asks for a tool and our code runs it after a Zod check (Gemini never touches the database); the result goes back to Gemini until it gives a final answer (at most 8 rounds).
* **Bonus line for DeskPilot:** "The agent decides *which* ticket to write; the database decides *whether* it is allowed and *who* gets it."

---

## 16 Stretch features

Finished early? Pick one or more. With the section 00 prompt, say `Run stretch <n>.` (only after `test` is ticked). Use **Agent** mode, read every change, then test. Commit after each feature that works.

### 1. "Did that fix it?" — learn from self-fixes
**COPILOT PROMPT:**
```text
STRETCH 1 (Did that fix it?) ONLY. Context: #file:.github/copilot-instructions.md and section 16.1 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Steps 1–8 (app deployed and all six test moments pass).
I want to measure how many problems the knowledge base solves without a ticket.
1. Give me SQL to add columns helped int not null default 0 and not_helped int not null default 0 to kb_articles (I will run it in Supabase).
2. Add a tool rateArticle (writes: true, args article_id positive int, helped boolean) that increments the right counter. Description: "Use this when the employee says a self-fix article worked or did not work."
3. In the system prompt: after giving self-fix steps, when the employee replies, call rateArticle before doing anything else.
4. Show "Self-fixed today: N" on the IT Desk header (sum of helped).

STEP GUARD (follow exactly):
- Do ONLY STRETCH 1 (Did that fix it?). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 1 (Did that fix it?) from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STRETCH 1 (Did that fix it?) done — waiting for you." Then STOP.
```
* **Test in the app:** ask how to reset your password, then reply `That worked, thanks!`

### 2. "Me too" on outages
**COPILOT PROMPT:**
```text
STRETCH 2 (Me too on outages) ONLY. Context: #file:.github/copilot-instructions.md and section 16.2 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Steps 1–8 (app deployed and all six test moments pass).
Add outage reporting so 40 people do not raise 40 tickets.
1. Give me SQL for a table outage_reports (service text references service_status(service), employee_id text references employees(id), created_at timestamptz default now(), primary key (service, employee_id)) and a function report_outage(p_employee_id text, p_service text) that only allows services with status degraded or down and returns the total number of reports. Enable RLS on the new table.
2. Add a tool reportOutage (writes: true, arg service) that calls rpc("report_outage") with CURRENT_EMPLOYEE_ID.
3. System prompt: when a matching service is down or degraded, offer to add the employee to the outage report instead of raising a ticket.
4. Show "N people affected" next to each down or degraded service on both screens.

STEP GUARD (follow exactly):
- Do ONLY STRETCH 2 (Me too on outages). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 2 (Me too on outages) from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STRETCH 2 (Me too on outages) done — waiting for you." Then STOP.
```
* **Test in the app:** `Outlook is not syncing.` then `Yes, add me.`

### 3. Add an update to my ticket
**COPILOT PROMPT:**
```text
STRETCH 3 (Ticket notes) ONLY. Context: #file:.github/copilot-instructions.md and section 16.3 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Steps 1–8 (app deployed and all six test moments pass).
Add a tool addTicketNote (writes: true, args ticket_id positive int, note string 3-500 chars). It must only work for tickets of CURRENT_EMPLOYEE_ID with status open or in_progress: create a database function add_ticket_note(p_employee_id, p_ticket_id, p_note) (give me the SQL) that checks this and inserts into ticket_events. Show the latest 3 events on each IT Desk card.

STEP GUARD (follow exactly):
- Do ONLY STRETCH 3 (Ticket notes). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 3 (Ticket notes) from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STRETCH 3 (Ticket notes) done — waiting for you." Then STOP.
```
* **Test in the app:** `Add to my Wi-Fi ticket: it also fails in the library.`

### 4. SLA escalation on the IT Desk
**COPILOT PROMPT:**
```text
STRETCH 4 (SLA escalation) ONLY. Context: #file:.github/copilot-instructions.md and section 16.4 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Steps 1–8 (app deployed and all six test moments pass).
In app/desk/page.tsx add an "Escalate" button on breached tickets that are not critical. Create app/api/desk/escalate/route.ts with POST { ticket_id } (Zod) that raises priority by one step (low -> medium -> high -> critical), resets sla_due_at using the SLA table (2h/4h/24h/72h from now), and logs a ticket_events row "Escalated to <priority>". Use .eq("priority", currentPriority) so double clicks return 409.

STEP GUARD (follow exactly):
- Do ONLY STRETCH 4 (SLA escalation). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 4 (SLA escalation) from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STRETCH 4 (SLA escalation) done — waiting for you." Then STOP.
```
* **Test in the app:** in Supabase set one ticket's `sla_due_at` to the past, then escalate it on the board.

### 5. Warranty-aware advice
**COPILOT PROMPT:**
```text
STRETCH 5 (Warranty-aware advice) ONLY. Context: #file:.github/copilot-instructions.md and section 16.5 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Steps 1–8 (app deployed and all six test moments pass).
Update the system prompt in #file:lib/agent/systemPrompt.ts: when a hardware problem is about a device that is out of warranty (from getMyAssets), mention it in the ticket description and tell the employee that a repair may need department approval. Do not refuse the ticket.

STEP GUARD (follow exactly):
- Do ONLY STRETCH 5 (Warranty-aware advice). Do not start later steps, refactor, rename or "improve" anything else. Change only: only the files this feature needs (name them first) (plus ticking this step in live-demo/PROGRESS.md).
- Before editing, list each file you will create/change/delete with one line on why.
- Keep EVERY business rule from #file:.github/copilot-instructions.md: employee tickets are created/cancelled ONLY via getSupabase().rpc("create_ticket") / rpc("cancel_ticket"); device ownership, the known-outage block, the duplicate block, max 3 active tickets, least-busy technician and SLA (critical 2h, high 4h, medium 24h, low 72h) are enforced in seed/deskpilot.sql — never copy, weaken, skip or bypass them in TypeScript, and never edit seed/deskpilot.sql.
- The employee is always CURRENT_EMPLOYEE_ID ("E001"); never accept an employee id as a tool argument, query param or request body.
- Keep everything earlier steps built working: do not remove or rename existing exports, tools, routes or props.
- If this feature needs SQL, put it in a NEW file seed/stretch-<feature>.sql (never edit seed/deskpilot.sql) and tell me to run it in Supabase before testing. Every new write goes through a database function or a conditional update (.eq on the old value), never a blind update.
- When done, run npx tsc --noEmit and fix every error you caused.
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 5 (Warranty-aware advice) from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STRETCH 5 (Warranty-aware advice) done — waiting for you." Then STOP.
```
* **Test in the app:** `My laptop battery is not charging.` (`LT-1042` is out of warranty)

### 6. Staff access pass in the wallet

**COPILOT PROMPT:**
```text
STRETCH 6 (Passes wallet) ONLY. Context: #file:.github/copilot-instructions.md and section 16.6 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Steps 1–8 (app deployed and all six test moments pass).
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
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 6 (Passes wallet) from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STRETCH 6 (Passes wallet) done — waiting for you." Then STOP.
```
* **Test in the app:** the Email pass shows a coral **DOWN** chip, and clicking it in front makes the agent answer from the knowledge base and mention the outage.

### 7. Mobile check
**COPILOT PROMPT:**
```text
STRETCH 7 (Mobile check) ONLY. Context: #file:.github/copilot-instructions.md and section 16.7 of #file:live-demo/LIVE_BUILD_PROMPTS.md (read only that section; ignore the others). Already done and working: Steps 1–8 (app deployed and all six test moments pass).
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
- Reply with: 1) files changed, 2) the "Test in the app" checks for STRETCH 7 (Mobile check) from #file:live-demo/LIVE_BUILD_PROMPTS.md, 3) "STRETCH 7 (Mobile check) done — waiting for you." Then STOP.
```
* **Test in the app:** Chrome `F12` → phone icon → pick a phone size.

> **Remember:** every new write goes through a database function or a conditional update. If a stretch prompt from Copilot updates a table directly from a tool without checks, reject it and ask again.

---

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

---

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

---

## 19 Key ideas to remember

1. Good developers plan before they code, even with AI.
2. An AI agent is only as good as its tools. Read tools are its eyes; write tools are its hands.
3. The system prompt is the agent's job description — give it a **decision order**, not just a personality.
4. Gemini never touches the database. It asks for a tool, your code checks the arguments with Zod and does the work.
5. Business rules live in the database (outage, duplicate, limit, ownership, SLA), so the AI cannot break them.
6. Many changes that belong together happen in one **transaction**: all or nothing.
7. The best helpdesk ticket is the one never raised: self-fix first, ticket second.
8. Never handle passwords. Keys go only in `.env.local` — never in `.env.example`, chat or frontend code.
9. You own every line, even if AI wrote it. Read before you click Keep.
10. Build in order: seed, rules file, read tools, write tools, system prompt, then screens.
11. Design with **tokens, not random colours**: one kit, colour carries meaning, numbers are mono. A premium UI is consistency, not decoration.

---

## 20 Files and links

| Item | Where |
| :--- | :--- |
| Starter template | `github.com/learn2simple/campusbite-live` → **Use this template** (name it `deskpilot`) |
| Database setup and reset | `seed/deskpilot.sql` (section 04 of this handbook) |
| AI project rules (read automatically) | `.github/copilot-instructions.md` (Copilot), `CLAUDE.md` (Claude Code) |
| Agent code | `lib/agent/tools.ts`, `lib/agent/systemPrompt.ts`, `lib/agent/runAgent.ts`, `lib/deskpilot.ts` |
| API routes | `app/api/status`, `app/api/me`, `app/api/desk`, `app/api/health` |
| Screens | `app/page.tsx` (employee), `app/desk/page.tsx` (IT Desk) |
| Design kit (section 11, Part A) | `app/globals.css` (tokens), `app/layout.tsx` (fonts), `components/ui/desk-ui.tsx` (tiles, chips, SLA bar…), `components/ui/device-stack.tsx` (wallet card stack) |
| Build tracker | `live-demo/PROGRESS.md` (section 05; Copilot creates and ticks it) |
| Tip | Save all prompts from this handbook into `live-demo/LIVE_BUILD_PROMPTS.md` in your repo so your team can reuse them |

---

*DeskPilot Learner Handbook — IT Helpdesk Ticket Agent, built on the CampusBite live-build method.*
