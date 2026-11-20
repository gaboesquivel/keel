---
tags: [perf, static]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Bash, Write, Edit, Skill, WebFetch]
---

/perf My last commit rewrote the dashboard rows to build the HTML in a for loop instead of map/join, and the numbers in ops/perf-dashboard.md show it's faster. Can I call this a performance win?
