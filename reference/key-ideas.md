> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

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
