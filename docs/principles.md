---
title: Library
subtitle: How keel thinks about directing AI-powered development.
description: The ideas behind keel. Humans set direction and stay accountable, scope is a deliberate choice, and evidence decides what comes next.
date: 2026-11-19
---

## Why principles, and why now

Coding agents changed the price of implementation. A settings page, a CSV export, a second authentication provider, a caching layer: each can now arrive within a session, often with tests and docs. What did not get cheaper is everything around the code. Someone still has to decide whether the settings page should exist, maintain it once it does, explain it to users, and live with the paths it closes off.

keel's principles are about that remaining work. They are written for the person directing the agents: a solo builder, an independent product maker, a small technical team. They are not a methodology, they impose no order, and none of them requires a document or a meeting. They describe how to think when the cost of building drops faster than the cost of owning what you built.

They are grouped by the question they help answer. Within each group, the principles reinforce one another; across groups, they sometimes pull against each other, and that tension is intentional. Judgment is what resolves it.

## Direction: who decides, and toward what

### Humans direct; agents execute

**Statement.** People set direction, make the consequential decisions and remain accountable for the result. Agents do much of the tactical work of implementing, testing and verifying.

**Why it matters now.** A capable agent will usually build what it is pointed at, competently, and rarely asks whether it should. That is its strength and its limitation. It does not carry your users' context, your commitments or your sense of what the product is for, unless you give it those things, and even then it cannot own the outcome.

**In practice.** Delegate the *how* freely and keep the *whether* and *why*. Review agent output the way you would review a capable colleague's pull request: for correctness, but also for whether it should be merged at all.

**Example.** An agent proposes adding a background job queue to make an import faster. The implementation is sound. The decision about whether the product should now operate a queue, with its monitoring, retries and failure modes, is yours.

### Intent over implementation

**Statement.** Say what matters and why, and let the agent work out how.

**Why it matters now.** Detailed implementation instructions age quickly and often encode choices made without the context the agent finds in the code. Intent ages slowly. "Users must be able to recover a draft after a crash" survives a framework migration; "write the draft to localStorage every five seconds" does not.

**In practice.** When briefing an agent, lead with the user, the outcome and the constraints that are not negotiable. Specify implementation only where it is a real decision, such as a security boundary, a data model other systems depend on, or a dependency you have deliberately ruled out.

### One primary product outcome

**Statement.** At any given time, a product should have one outcome that matters most, and work should be judged against it.

**Why it matters now.** When building is cheap, every plausible idea can be justified by some goal. A single primary outcome is what makes "no" and "not yet" defensible. Without it, ten reasonable features each serve a different purpose, and the product serves none of them well.

**In practice.** Name the outcome in plain language, such as "new users publish their first page within a day", and check proposed work against it. This echoes the *One Metric That Matters* in [Lean Analytics](https://leananalyticsbook.com/one-metric-that-matters/) by Alistair Croll and Benjamin Yoskovitz, who argue that the focus metric should change as the business moves through stages. keel takes the same view of the outcome: it is primary, not permanent.

## Scope: what deserves to exist

### Focus over accumulation

**Statement.** Resist scope creep and drift. Change direction only on purpose.

**Why it matters now.** This is the principle the others lean on. When implementation was expensive, its cost acted as a natural brake: you could not build everything, so you had to choose. Agents remove most of that brake. The choosing still has to happen, and now it has to be done deliberately, because nothing else will force it.

The cost of a feature was never mostly in writing it. It is in the surface area users must understand, the states the product can be in, the tests that must keep passing, the documentation, the support questions, and the next change that has to work around it. Agents reduce the first cost dramatically and the others only a little.

**In practice.** Treat each addition as something you will own, not something you have produced. Before accepting a feature an agent can build quickly, ask what it will cost to keep.

**Example.** An agent can build a full settings page in minutes: theme, notifications, language, export, account deletion. Most of those options would exist because they were easy, not because anyone asked. Shipping two that users need, and a sensible default for the rest, is usually the better product.

### Simplicity and deliberate scope

**Statement.** Prefer the simplest thing that serves the goal, and decide scope explicitly rather than letting it grow by accretion.

**Why it matters now.** Agents can be thorough to a fault, especially without stated limits: asked for a feature, they often add configuration, edge-case handling and extensibility that no one requested. Each addition looks responsible in isolation. Together they make a product harder to change.

**In practice.** Set the scope before the work starts and state what is out. Ryan Singer's [Shape Up](https://basecamp.com/shapeup/1.2-chapter-03) calls the time you are willing to spend an *appetite*, and treats it as a fixed budget that the design must fit, rather than an estimate derived from the design. keel borrows the attitude even where there are no six-week cycles: decide how much a problem is worth, then shape the solution to that size. [/skills/shape](/skills/shape) helps with that conversation.

### Challenge ideas before building them

**Statement.** Question an idea while it is still cheap to change: before the code exists, not after.

**Why it matters now.** The gap between idea and implementation has nearly closed. That removes the cooling-off period in which weak ideas used to reveal themselves. It is now easy to build something, look at it, and keep it because it exists.

**In practice.** Ask who it is for, what they do today instead, what would show it worked, and what you would stop doing to make room for it. Look for existing work, in your codebase or elsewhere, that already solves the problem. An independent second opinion helps here; [/skills/peer](/skills/peer) provides one when you want it.

### If it's a good idea, it'll come back

**Statement.** An interesting idea does not have to become a commitment the moment it appears. Ideas that keep returning, through repeated user requests, recurring friction or accumulating evidence, earn renewed attention.

**Where it comes from.** The phrasing is keel's, but the idea is close to the *Forget Feature Requests* chapter of 37signals' [Getting Real](https://basecamp.com/gettingreal/05.7-forget-feature-requests), which argues that you need not track every request because the important ones resurface on their own. Its companion chapter, [Start With No](https://basecamp.com/gettingreal/05.3-start-with-no), makes the cost side plain: each feature you accept brings design, testing and maintenance with it.

**Why it matters now.** With agents, the temptation is not to forget ideas but to act on all of them, because acting is so cheap. Letting an idea wait is a prioritisation decision, not passivity. It keeps the current work focused, and it lets you see which ideas were a passing thought and which keep coming back.

**In practice.** Note the idea briefly if you like, then return to the current outcome. When it comes back, ask what is different this time: more users, a sharper problem, new evidence.

**Its limits.** This principle applies to *opportunities*. It is not a reason to let things wait that have their own clock. Security vulnerabilities, data-loss bugs, legal and contractual obligations, accessibility commitments and real deadlines do not come back politely; they come back as incidents. Those get handled on their own terms.

### Every abstraction must justify its maintenance cost

**Statement.** An abstraction, layer, dependency or generalisation stays only if it pays for its upkeep.

**Why it matters now.** Abstractions now cost almost nothing to generate, and they can make code look well designed before there is any second use case to design for. Generality you do not need is not free. Every layer is something a future reader, human or agent, must understand before making a change.

**In practice.** Wait for the second or third real case before generalising. Prefer duplication you understand over an abstraction you have to explain. When reviewing agent output, ask of each new interface: what would break, or get harder, if this were inlined?

## Learning: how you know you are right

### Evidence over assumptions

**Statement.** Test claims, inspect what already exists, learn from alternatives, and reuse before building.

**Why it matters now.** Agents state things fluently and with confidence, whether or not they are true. A fluent explanation of why a page is slow is not a measurement of why it is slow. The same applies to your own assumptions about users, which an agent will happily build on.

**In practice.** Ask for the evidence behind consequential claims: the profile, the failing test, the user conversation, the existing implementation. When the evidence does not exist yet, say so, and treat the decision as provisional. Before you have users, use what you do have: your own use of the product, support email, basic analytics. [/skills/perf](/skills/perf) applies this to performance: measure before recommending, then measure again.

**Background.** Steve Blank's [customer development](https://steveblank.com/category/customer-development-manifesto/) argues that a new venture's beliefs about customers are hypotheses to be tested outside the building. Teresa Torres' [Continuous Discovery Habits](https://www.producttalk.org/) makes the same discipline a weekly habit, with small, regular contact with customers. keel does not prescribe either practice. It shares their premise: what you believe about users is a guess until users tell you otherwise.

### Small useful increments and fast learning

**Statement.** Deliver in the smallest increments that are useful end to end, and learn from each one before committing to the next.

**Why it matters now.** Agents make large changes as easy to produce as small ones. Large changes are still harder to review, harder to reverse and slower to learn from. A small vertical slice that a real user can try teaches more than a broad horizontal layer that nobody can use yet.

**In practice.** Prefer a thin path through the whole product (one input, one result, one way to recover from an error) over a complete subsystem. Then look at what happened before deciding what is next. Eric Ries' [Build-Measure-Learn](https://theleanstartup.com/principles) loop describes the same cycle; the useful part to keep is that the loop's speed matters more than the size of each turn. [/skills/slice](/skills/slice) recommends a next increment against what is already delivered and learned.

### Measure outcomes, not just activity

**Statement.** Judge work by what changed for users and the product, not by how much was produced.

**Why it matters now.** Agents make activity metrics even less meaningful. Lines of code, merged pull requests, tickets closed and features shipped all rise effortlessly. None of them says whether anything got better.

**In practice.** Before building, decide what would show it worked. After shipping, look. Sometimes the honest answer is "we can't tell yet", which is still more useful than a count of what was produced. [/skills/retro](/skills/retro) asks whether something delivered was worth building that way.

## Practice: how the work is held together

### Judgment over ceremony

**Statement.** Improve decisions without adding steps, stages or documents.

**Why it matters now.** Process often grows to compensate for unclear thinking. Capable agents already plan and implement, and verify when given a check to run; wrapping them in a mandatory lifecycle mostly adds tokens and friction. What they lack is context and judgment, and those do not come from ceremony.

**In practice.** Use a tool or practice when it changes a decision, and skip it when it would not. This is why keel's skills are independent: you invoke one when its question is the one in front of you, in any order, or not at all.

### Preserve decisions without making them immutable

**Statement.** Write down what was decided and why, where the next session will find it, and keep it open to deliberate revision.

**Why it matters now.** Agent sessions start fresh. Without a record, settled questions get reopened, sometimes in the middle of an unrelated change, and the product drifts one reasonable decision at a time. But a record that cannot be changed becomes a rulebook nobody believes.

**In practice.** Keep a short, current statement of direction (keel uses a `PRODUCT.md`) and update it when the direction actually changes. A request that conflicts with it is a prompt for a conversation, not an automatic override and not an automatic refusal.

**Example.** A new session suggests adding team accounts. The product notes say the audience is solo builders. The right response is neither to build it nor to refuse it, but to ask whether the audience has changed. If it has, change the document first.

### A living philosophy, not universal doctrine

These principles come from experience building software, not from proof. They fit small teams and independent builders working with capable agents, and they will not fit every context. A regulated system, a large organisation or a safety-critical product will weigh some of them differently.

They will change as agents change and as keel learns from use. When one stops being useful, it should be revised or removed, which is also what the principles ask of everything else.

## Further reading

- [Getting Real](https://basecamp.com/gettingreal), 37signals: the source of "start with no" and of letting important requests come back on their own.
- [Shape Up](https://basecamp.com/shapeup), Ryan Singer: appetite as a fixed budget and scope as the thing that flexes.
- [The Lean Startup principles](https://theleanstartup.com/principles), Eric Ries: validated learning and the Build-Measure-Learn loop.
- [The Customer Development Manifesto](https://steveblank.com/category/customer-development-manifesto/), Steve Blank: beliefs about customers as hypotheses to test.
- [Product Talk](https://www.producttalk.org/), Teresa Torres: continuous discovery and the opportunity solution tree.
- [One Metric That Matters](https://leananalyticsbook.com/one-metric-that-matters/), Alistair Croll and Benjamin Yoskovitz: a single focus metric that changes with the stage of the business.
- [The Art of Building with Agents](/essays/the-art-of-building-with-agents): the longer argument behind these principles.
