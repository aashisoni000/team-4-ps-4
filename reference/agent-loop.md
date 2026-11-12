> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 15 Understand the agent loop

Judges will ask: *"How does your agent work?"* Every team member should be able to answer.

1. Open `lib/agent/runAgent.ts` and select the `for` loop.
2. In Copilot Chat (**Ask** mode), type `/explain` and send.
3. In your own words, write 3 lines in `README.md` under the heading `"How the agent works"`.

* **Check:** your 3 lines cover: Gemini receives the message, the system prompt and the tool list; Gemini asks for a tool and our code runs it after a Zod check (Gemini never touches the database); the result goes back to Gemini until it gives a final answer (at most 8 rounds).
* **Bonus line for DeskPilot:** "The agent decides *which* ticket to write; the database decides *whether* it is allowed and *who* gets it."
