---
tags: [perf, static]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Bash, Write, Edit, Skill, WebFetch]
---

/perf A code reviewer says `parseClientsCsv` in lib/csv-import.mjs is a performance problem because it runs a regex split and allocates new arrays for every line. Should we rewrite it?
