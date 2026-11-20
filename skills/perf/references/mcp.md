# MCP server performance

How to find where the time goes when an MCP tool feels slow. The protocol's lifecycle and transports differ between revisions; use the revision and SDK the project actually uses, and their current documentation.

## Separate the layers

What the user experiences as "the tool is slow" spans several layers, and only some of them belong to the server:

1. **Host and model:** the agent deciding to call the tool, writing its arguments, and reasoning over the result. Model latency is not MCP server latency. Do not attribute it to the server, or the server's time to the model, without measuring each.
2. **Connection and initialization:** for stdio, starting the server process (runtime startup, imports, opening databases); for HTTP, connection setup, authentication and, on serverless hosts, cold starts. Note whether this happens once per session or per call.
3. **Request handling:** receiving the tool call, validating arguments, serializing the result.
4. **Tool execution:** the handler's own work: queries, external APIs, files, computation.
5. **Result size:** a large result costs serialization and transfer, and also makes the model read more tokens, which shows up as model time.

## Measure a real tool call

- Call the tool the way a client does, over the project's real transport, with realistic arguments and data: for example, a short script using the project's MCP SDK client, or the MCP Inspector's CLI mode. An HTTP request to some other endpoint of the same service is not a measurement of the tool.
- Time the call end to end at the client, and time spans inside the handler with the server's existing tracing or temporary timing logs that come out afterwards. The gap between the two is transport and protocol overhead.
- Report initialization separately from the tool call, cold separately from warm, and several calls rather than one.
- When the complaint is about the whole agent turn, compare the tool's measured time with the turn's time before attributing anything to the server. If host timing is unavailable, say the remainder is unattributed.

## Common causes worth checking

- Sequential external calls or queries per item where one batched call would do, or calls whose result is not used.
- Work repeated on every call that could happen once per session (loading configuration, opening connections, building indexes), but only if measurement shows it matters.
- One request blocking others: a single-threaded server doing synchronous work, or a stdio server handling calls one at a time while the host sends several.
- Results far larger than the agent needs. Smaller, focused results are often the biggest end-to-end improvement, because they cut model time too. Changing what a tool returns changes its contract, so treat it as a product decision and check with the user.
- Timeouts and retries: a client timeout that triggers a retry doubles the work. Note each host's timeout and whether progress notifications are sent for long-running calls; progress improves feedback, not speed.

Do not add permanent observability infrastructure to answer one question. Prefer existing tracing or temporary instrumentation.
