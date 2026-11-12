> Part of the DeskPilot build pack. Start at [`live-demo/README.md`](../README.md). Copilot: read only this file for this step.

## 14 Full test: six moments

> **MANUAL — you do this, not Copilot.** PROGRESS id `test`. If a moment fails, start a new chat: `#file:live-demo/README.md Moment <n> of #file:live-demo/steps/10-full-test.md fails: <what you see>. Find the cause in the step that built it, fix only that, keep every business rule.`

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
