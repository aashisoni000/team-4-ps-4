# DeskBot project rules

- App: DeskBot, an IT helpdesk assistant for the PS4 seed. The demo employee is always `E101` (`CURRENT_EMPLOYEE_ID` in `lib/deskbot.ts`); never accept an employee id from a model argument, query parameter, or request body.
- Stack: Next.js App Router, TypeScript, Tailwind CSS, Supabase, Gemini function calling, and Zod.
- Seed tables: `employees`, `support_teams`, `sla_rules`, `kb_articles`, and `tickets`. Use the schema in `seed/ps4_it_helpdesk.sql`; do not assume there are assets, technicians, service-status rows, ticket-event rows, or database RPC functions.
- Ticket categories and priorities must match `lib/deskbot.ts` and the seed. Valid statuses are `open`, `in_progress`, `waiting_for_user`, `resolved`, and `closed`.
- Ticket assignment is to a support team. Do not invent a technician name or device id. Resolve the team's id from the matching knowledge-base category.
- Employee ticket creation happens only in the server-side `createTicket` tool. The IT Desk status transition happens only in `app/api/desk/route.ts`, with an allowed transition and an optimistic `.eq("status", previousStatus)` guard.
- The seed has no cancellation status or cancel RPC; do not claim a ticket was cancelled. The seed has no live outage feed or device inventory; state those limitations rather than guessing.
- Use `getSupabase()` only from `lib/` and `app/api/`. Never expose the Supabase secret key in client components and never read or commit `.env.local`.
- Use `formatIST()` / `slaText()` from `lib/deskbot.ts` for ticket target times. SLA targets come from `sla_rules`; do not hardcode a target.
- Keep error messages explicit. Validate tool/API input with Zod, log server-side query failures, and do not silently report successful writes when a database operation failed.
