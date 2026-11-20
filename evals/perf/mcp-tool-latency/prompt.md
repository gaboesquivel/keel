---
tags: [perf, live, mcp]
max_turns: 60
timeout_seconds: 1500
allowed_tools: [Read, Glob, Grep, Bash, Write, Edit, Skill, WebFetch]
---

/perf When I ask Claude Desktop "who owes me money?", it takes about 40 seconds to answer using the Duesy MCP server (`node mcp-server.mjs`, stdio). Why is the tool so slow?
