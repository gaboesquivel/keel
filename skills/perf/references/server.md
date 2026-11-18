# Server, database and platform performance

How to locate server-side time and read the evidence. Platform specifics change; check the hosting provider's current documentation and any skill or tool it maintains.

## Where the time goes

- Break a slow request into its spans: routing and middleware, application code, each database query, each external call, serialisation, and time waiting for a connection or a cold start. Use the tracing or logging the project already has; when there is none, a few temporary timing logs around the suspected spans are enough, and they come out afterwards.
- Report percentiles (p50 and p95 or p99) with the number of requests behind them. Averages hide tail latency, and the tail is often what users notice.
- Separate cold from warm: first request after a deploy or idle period, versus steady state.

## Database

- **N+1 queries:** count queries per request. A count that grows with the number of rows returned is the signature; batching or a join is the usual fix, but confirm the count drops and the latency follows.
- **Query plans:** in PostgreSQL, `EXPLAIN` shows the planner's estimate without running the query; `EXPLAIN ANALYZE` runs it and reports actual times and rows. Because `ANALYZE` executes the statement, prefer a staging copy for anything that writes. A transaction rollback undoes row changes but not every side effect: sequence increments stay consumed, and triggers, notifications or calls to other systems may already have acted. Never run it against production without the user's agreement. Add `BUFFERS` to see I/O. Large gaps between estimated and actual rows point to stale statistics or a misleading predicate.
- Run plans against realistic data volumes. A plan on a small development database can differ completely from production.
- An index that helps one query adds write cost and storage. Recommend it with the query it serves and the evidence.

## External services

- Time each external call separately and note whether calls run sequentially when they could run in parallel, or run at all when the result is not needed.
- Distinguish the provider's latency from your own retries, timeouts and connection setup.
- Caching a third-party response trades freshness for speed; state the freshness the product actually needs.

## Caching layers

These are different mechanisms with different failure modes. Name which one is in play:

- **CDN or edge cache:** whole responses, controlled by cache headers. Check the response headers (for example `x-vercel-cache` on Vercel) on repeated requests rather than assuming.
- **Incremental or on-demand regeneration (ISR):** pages rebuilt in the background on a schedule or on revalidation.
- **Runtime or data cache:** results stored by the application or framework during execution.
- **Browser cache:** controlled by the same headers, but per user.

A cache that hides a slow origin still leaves the slow path for misses, cold starts and new content. Measure both paths.

## Serverless and deployment platforms

- Function duration, cold starts, region placement relative to the database, and memory or CPU configuration all show up as server time. Check the platform's observability for the route before changing code.
- On Vercel, Speed Insights reports field Core Web Vitals and Observability reports function and request metrics. Use what the project has enabled; if a route-level metric needs a paid tier that is not enabled, say so instead of guessing.
- Resource consumption and cost are performance outcomes too. When the question is cost, compare the cost driver (invocations, duration, transfer, build minutes) before and after, not only latency.
