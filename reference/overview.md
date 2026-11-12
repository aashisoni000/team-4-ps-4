> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

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
