---
name: perf
description: Evidence-led performance investigation for web apps and their backends. Identifies the affected journey or workload, measures before recommending, finds the demonstrated bottleneck across browser, rendering, server, database or platform, and, when asked to improve it, makes the smallest change and measures again under comparable conditions. Audits and unspecified requests stay diagnostic and do not change code.
argument-hint: "[slow page, operation or workload, or what to improve]"
disable-model-invocation: true
---

# Perf

The performance question: $ARGUMENTS

Answer three things: where time and resources go, what causes the problem, and whether a change improved it. Every claim rests on evidence, and the strength of that evidence is part of the answer.

## Mode

- **Audit or diagnose** (including any request that does not ask for changes): findings and recommendations. Do not modify code.
- **Improve:** diagnose first, then make a focused change and verify it.

## Frame the question

Name the affected user journey, operation or workload, and who feels it. Recover targets and constraints the project already has (in `PRODUCT.md`, `ARCHITECTURE.md`, monitoring or the user's words). Do not invent a budget; public thresholds such as Core Web Vitals describe the web at large, not this product's goal.

## Evidence

These are not equivalent, so label each finding with its kind:

1. **Field:** observations from actual user traffic or operational workloads, such as real-user monitoring, production traces, logs and metrics. A synthetic test run against production is lab evidence, not field evidence.
2. **Lab:** controlled measurements of a production build.
3. **Diagnostic:** traces and profiles that show where time goes.
4. **Static:** facts verified by reading code or configuration, such as a query inside a loop or a missing index.
5. **Hypothesis:** unmeasured claims about runtime impact, including how much a static fact costs, and best-practice rules applied without measurement.

Measure before recommending whenever measurement is possible. A static finding establishes what the code does, not what it costs: report the fact as static and its runtime impact as a hypothesis until a measurement supports it. When no runtime measurement is available, say so, rank hypotheses by likely impact, and give the cheapest measurement that would confirm each.

Record enough conditions to make a comparison meaningful: revision and build mode, workload and data size, environment, cache state (cold or warm), device and network conditions when relevant, how you measured, and how much the numbers varied across runs. Development-mode timings are not production performance, and development instrumentation changes what it measures.

## Investigate

Find the bottleneck the evidence shows, and inspect only the surfaces that could plausibly explain it. Use the tools the project and environment already have (browser developer tools or a browser automation tool, the framework's profiler, server logs and traces, the database's query plans, the hosting platform's observability). Check what a tool actually measures before relying on it. Use the project's installed framework versions and the documentation for those versions; if the platform or framework maintainer offers a specialised skill or tool for this, use it for the technique and keep the judgment here.

Read a reference when the investigation reaches its area:

- [references/web.md](references/web.md): page load, Core Web Vitals, interaction latency, main-thread and memory work, React and Next.js rendering.
- [references/server.md](references/server.md): server execution, database queries, external services, caching layers, serverless and deployment platforms such as Vercel.

## Improve

Only once evidence supports a bottleneck:

1. State the hypothesis and the result that would confirm or refute it.
2. Choose the smallest meaningful change. Removing unnecessary work comes before adding machinery; caching, concurrency, new dependencies or infrastructure need evidence that their complexity pays for itself.
3. Preserve correctness, behaviour, data freshness, compatibility, accessibility and, where the change touches it, adopted design intent (`DESIGN.md`). If a fix would need to compromise that intent, say so and let the user decide.
4. Measure again under comparable conditions, with enough runs to see the variation.
5. Keep the change if the evidence supports it. If the difference is within the noise, the result is inconclusive, not a success or a failure; say so and decide with the user whether the change is worth keeping on other grounds.

## Report

- The operation and its user impact.
- The bottleneck and the evidence for it, labelled by kind.
- Baseline and result, with conditions, where measured.
- What changed, if anything, and the tradeoffs.
- What remains unverified. Lab evidence alone does not demonstrate a production improvement.
- A practical way to notice a regression, using what the project already has where possible.
