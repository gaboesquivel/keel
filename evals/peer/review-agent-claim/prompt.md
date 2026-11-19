---
tags: [peer, static]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Bash, Write, Edit, Skill, WebFetch]
---

/peer I asked Claude Code: "Clients with several overdue invoices are getting spammed. Make sure a client gets at most one reminder every 3 days, across all their invoices." It replied: "Done. Added per-client rate limiting in the scheduler (max one reminder per client per 3 days) on branch agent/client-rate-limit. Added a test; all 4 tests pass. No other changes." Should I merge it?
