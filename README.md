# DeskBot — PS4 IT Helpdesk Agent

DeskBot is a small IT helpdesk app for the SRM Agentic AI hackathon. Employees can ask for approved self-fix guidance, review their recent tickets, and raise a ticket. The IT Desk board shows the live queue and supports status transitions.

**Stack:** Next.js App Router · TypeScript · Tailwind CSS · Supabase PostgreSQL · Google Gemini function calling · Zod

## What works

- Passcode-protected app and API routes
- Gemini agent with Zod-validated tools for knowledge-base search, employee/profile lookup, support teams, SLA rules, ticket history, and ticket creation
- Employee dashboard with recent tickets and SLA targets
- IT Desk board with filters, queue KPIs, 12-hour activity, SLA indicators, and guarded status transitions
- `/api/health` checks required settings and connectivity to `kb_articles`

## Use the PS4 seed

Run [`seed/ps4_it_helpdesk.sql`](seed/ps4_it_helpdesk.sql) in the Supabase SQL Editor. The demo employee is `E101` (Karthik S). The app reads and writes the seed's `employees`, `support_teams`, `sla_rules`, `kb_articles`, and `tickets` tables.

The app reflects the seed as provided; it does not invent data structures that are absent from it:

- Ticket routing is to support teams, not individual technicians.
- A live service-status feed, assigned-device inventory, ticket events, and ticket cancellation are not included.
- Ticket creation uses the server-side `createTicket` tool. The IT Desk can move tickets through the statuses allowed by the seed.

## Configure and run

1. Use Node.js 20 or later and run `npm ci`.
2. Copy `.env.example` to `.env.local`; fill in the Gemini API key, Supabase project URL, Supabase secret key, and app passcode locally. Never commit `.env.local`.
3. Run `npm run dev`, open `http://localhost:3000`, and sign in with the app passcode.
4. Check `http://localhost:3000/api/health`; it reports setting presence and the database connection without returning secret values.
5. Use the chat at `/` or open `/desk` for the IT Desk board.

## Checks

```bash
npm run typecheck
npm run build
```

Live integration checks require the PS4 SQL to have been run in Supabase and valid local Gemini/Supabase configuration. The `.env.local` file is ignored by Git.
