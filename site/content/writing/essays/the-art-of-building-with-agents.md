---
title: The Art of Building with Agents
subtitle: When execution becomes cheap, judgment becomes the advantage.
description: As coding agents take on implementation, the scarce work is deciding what deserves building, holding scope, and owning the result.
date: 2026-11-19
---

## The bottleneck moved

For most of the time I have been building software, the hard constraint was implementation. There were always more good ideas than hours to build them, and the work of choosing was partly done for you by that scarcity. A feature that would take three weeks had to be worth three weeks. A refactor that would stall everything else had to be urgent. Cost was a crude filter, but it was a filter.

Coding agents have loosened that constraint more than any tool I have used. A capable agent can read a codebase, propose a plan, write the change, run the tests and explain what it did, often faster than I could have described the change to a colleague. Work that used to fill a week can now fill an afternoon of review.

That is genuinely good news, and I do not want to argue against it. But it moves the bottleneck. When implementation stops being the scarce resource, the scarce resources become the things implementation never covered: knowing what deserves to be built, knowing when something is good enough, knowing what to leave out, and being accountable for what ships. None of those got cheaper. Some got harder, because the old filter is gone and nothing has replaced it by default.

This essay is about the work that becomes more valuable as that happens. I think of it as an art rather than a process, closer to editing than to following steps.

## From implementing to directing

The most visible change is in what a working day looks like. Less of it is spent writing code line by line. More of it is spent on four other activities.

**Framing.** Deciding what problem the next piece of work addresses, for whom, and what would count as done. A well-framed task gives an agent room to make good implementation choices. A badly framed one produces a correct solution to the wrong problem.

**Constraining.** Saying what is out of scope, which dependencies are off the table, which interfaces must not change, how much the problem is worth. Agents are thorough by temperament. Without stated limits, thoroughness turns into sprawl.

**Reviewing.** Reading what came back, not only for correctness but for fit. Does this change make the product simpler or more complicated? Does it introduce a concept the rest of the system does not have? Would I be comfortable maintaining it in a year?

**Deciding.** Merging, rejecting, redirecting, or stopping. This is the part that cannot be delegated, because it is where accountability lives.

Directing is not a lesser form of engineering; it is the part that was always the most consequential and the least visible. Its failure modes are new enough to be worth naming.

One is the *rubber stamp*: the agent's output looks reasonable, the tests pass, and so it ships. Over weeks, the codebase fills with reasonable-looking decisions that nobody actually made. Another is the *micromanager*: specifying every function signature and file name, which wastes the agent's ability and usually produces worse code than a clear statement of intent would have. A third is the *accumulator*: because each feature is cheap, every idea gets built, and the product slowly loses its shape.

The common thread is that the agent is doing what it was asked. The problem is upstream, in what it was asked to do.

## Why product thinking matters more, not less

There is a tempting argument that cheap implementation makes product thinking less important: if building is nearly free, why not build everything and see what sticks?

It does not work, for a simple reason. Building is nearly free, but *owning* is not. Every feature that ships becomes part of what users must understand, what support must explain, what tests must cover, what the next change must work around, and what the next agent session must read before it can do anything useful. The cost of a feature was never mostly in writing it. Agents have shrunk the small part of the cost and left the large part largely intact.

Consider a settings page. An agent can build a thorough one in minutes: theme, notifications, language, data export, account deletion, keyboard shortcuts, a dozen toggles for behaviours that might matter to someone. Each option is individually defensible. Together they make a product with dozens of states nobody tested in combination, a page users scan and leave, and a set of commitments that are awkward to withdraw once someone depends on them. The question was never "can we build a settings page?" It was "which two settings would a new user miss if they were not there?"

This is where product thinking earns its place. Not as a document or a stage, but as a habit of asking, before work starts, who it is for, what they do today instead, what would show it helped, and what it will cost to keep.

Much of the best thinking on this predates agents, and reads differently now. Eric Ries' [Lean Startup](https://theleanstartup.com/principles) framed product development as a loop of building, measuring and learning, with the goal of *validated learning* rather than output. When building was slow, the emphasis tended to fall on building less before you learned. With agents, the building part of the loop is fast enough that learning becomes the limiting step. If the loop now spins faster than you can learn from it, you are producing output, not insight.

Steve Blank's [customer development](https://steveblank.com/category/customer-development-manifesto/) insists that a founder's beliefs about customers are hypotheses, to be tested by talking to the people involved. Teresa Torres' [continuous discovery](https://www.producttalk.org/) turns that into a regular practice of small, frequent contact with customers. My interpretation, not theirs: agents make it easier than ever to skip this step, because the prototype is already built before anyone thinks to ask whether it should be. A working prototype is persuasive in a way a question is not, so the discipline has to come from you.

## More features are not more value

It helps to be blunt about this. A product is not a list of capabilities. It is a small number of things done well enough that someone chooses it over the alternatives, including the alternative of doing nothing.

37signals made this case in [Getting Real](https://basecamp.com/gettingreal) long before agents existed, arguing that the default answer to a feature request should be no, and that each feature you say yes to is something you must look after indefinitely. The point lands harder now. When saying yes cost three weeks, the cost was visible and people hesitated. When saying yes costs a prompt, the cost is invisible at the moment of decision and arrives later, spread across every subsequent change.

The same book suggests not keeping a backlog of every request, on the basis that requests that matter will keep coming back. keel turns that into a principle: *if it's a good idea, it'll come back.* It is easy to misread as permission to ignore things, so I want to be precise about what it means. It applies to opportunities, not obligations. It means an interesting idea need not become a commitment the moment it appears, and that ideas which return, through repeated requests, recurring friction or new evidence, earn renewed attention. It does not apply to a security issue, a data-loss bug, a legal obligation or a deadline. Those come back too, but as incidents.

Used well, letting ideas wait is a real form of prioritisation. It keeps the current work focused, lets weak ideas fade without a debate, and shows you which ideas keep returning.

## What engineering experience is for now

If agents write the code, what is engineering experience for?

I think it becomes more important, but its role changes. It shifts from producing solutions to evaluating them. The experience that used to show up as knowing how to write the thing now shows up as knowing whether the thing that was written is right. That means a few specific kinds of judgment.

**Architecture.** An agent can produce a working design for the problem in front of it. It is less reliable at seeing how that design interacts with the problems that are coming, or with the parts of the system it did not read. Experience is what tells you that this service boundary will hurt in six months, or that this data model will make the obvious next feature awkward.

**Tradeoffs.** Most engineering decisions are not right or wrong; they trade one cost for another. A cache trades latency for staleness and operational complexity. A new dependency trades implementation time for supply-chain risk and upgrade work. An agent will usually pick a defensible option. Deciding which cost your product can afford is a judgment about your context, not about code.

**Correctness.** Passing tests are evidence, not proof. Experience tells you where tests tend to lie: concurrency, time zones, partial failures, migrations, permission checks, money. Those are the places to read slowly, whoever wrote the code.

**Maintainability.** Agents are prolific with abstractions. They will introduce a strategy pattern, a plugin registry or a configuration layer because the problem resembles one where such a thing helped. The [Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns) catalogue by Gamma, Helm, Johnson and Vlissides gave the industry a shared vocabulary for these structures, and that vocabulary is valuable. But a pattern is a solution to a recurring problem, and if the problem has not recurred, the pattern is just indirection. keel's rule is that every abstraction must justify its maintenance cost. Experience is what lets you tell, when reading an agent's change, which abstractions are earning their keep.

**Language.** Eric Evans' [Domain-Driven Design](https://www.domainlanguage.com/ddd/) argues that software should be built around a model of the domain, expressed in a language shared by the people who understand the domain and the people who build for it. With agents, this shared language matters more, because the agent is now one of the participants. A codebase whose names match the way users and the business talk about the problem is far easier to direct than one where every concept has three names. Keeping that language coherent is a human job; the agent will adopt whatever vocabulary it finds.

None of these is exotic. What has changed is that they are now most of the job, rather than the part you did between bouts of typing.

## Strategy, discipline and constraints

The word *strategy* gets inflated, so I use it narrowly. A strategy is a coherent set of choices about what to pursue and, just as importantly, what not to. A strategist knows what is worth pursuing, how to allocate limited effort, what to measure, when to change direction, and which fights not to pick.

The last of those matters more than it sounds. Not every bug needs fixing this week. Not every inconsistency in the codebase needs a refactor. Not every competitor's feature needs a response. Agents make it tempting to fight every battle because each one is cheap to start. But each one still costs attention, review and risk. Choosing not to fight is part of the strategy.

Discipline is what keeps the choices in place once they are made. In practice, I find it comes down to a small number of habits:

- Name one primary outcome for the product at a time, and judge work against it. Alistair Croll and Benjamin Yoskovitz's idea of [One Metric That Matters](https://leananalyticsbook.com/one-metric-that-matters/) is the clearest statement I know of why a single focus beats a dashboard of equals. They also stress that the focus changes as the product matures, which is an important qualifier.
- Decide how much a problem is worth before deciding how to solve it. Ryan Singer's [Shape Up](https://basecamp.com/shapeup/1.2-chapter-03) calls this *appetite*: a fixed time budget the solution must fit, as opposed to an estimate derived from a solution. Fixing the time and flexing the scope works just as well with an agent as with a team, and it is one of the most effective ways I know to stop a feature from growing in the dark.
- Ship in small slices that are useful end to end, and look at what happened before deciding what is next.
- Write down decisions where the next session will find them, and change them deliberately rather than by drift.

Constraints are the underrated part. A constraint is a decision you made once so that you do not have to make it a hundred times. "No new runtime dependencies without discussion." "This product does not do team accounts." "Pages must work without JavaScript." Each one closes off options, and that is the point. Agents work better with clear constraints, in the same way people do: they spend less effort on paths that were never going to be accepted.

## Taste, and knowing when to stop

Taste is hard to talk about without sounding mystical, so here is a working definition: taste is the ability to tell, before the evidence arrives, which of several working solutions is better, and to be right often enough that it is worth acting on.

It shows up in small decisions. Whether an error message blames the user or helps them. Whether a page has one obvious action or five equal ones. Whether an API is easy to use correctly and hard to use wrongly. Whether a feature feels like it belongs to the product or was bolted on. Agents can be steered toward good taste, and they often have reasonable defaults, but they do not have yours, and they do not know which compromises your users will forgive.

Knowing when to stop is the part of taste that agents make hardest. When the next improvement costs a prompt, it is always tempting to make one more. Another edge case handled, another option added, another refactor for elegance. An old maxim, usually credited to Kent Beck though older versions exist, puts the order as *make it work, make it right, make it fast*. It is worth adding an implicit fourth step: *then stop, and see whether anyone needed it.* Beck's [Extreme Programming](https://www.oreilly.com/library/view/extreme-programming-explained/0321278658/) is, among other things, a sustained argument for short feedback loops, and stopping is how you let the feedback in.

A useful test: if I imagine removing this change a month from now, would anyone notice? If not, it probably did not need to exist, however cheaply it was made.

## Ownership does not delegate

Agents can do a great deal of work. They cannot be accountable for it.

When something ships, someone answers for it: to users, to colleagues, to customers, sometimes to regulators. That person needs to understand what was built well enough to defend it, fix it and change it. If the honest answer to "why does it work this way?" is "the agent did it", the decision was never really made.

This is not an argument for reviewing every line with suspicion. It is an argument for keeping the decisions that matter in human hands, and for being clear about which those are: what the product is for, who it serves, what it will not do, which risks are acceptable, what gets measured, and when to change course. Everything else can be delegated freely, and much of it should be.

It also means being honest about uncertainty. Agents tend to present their output with confidence, whatever its quality. Part of directing them well is supplying the scepticism they do not: asking for the profile behind a performance claim, the test behind a correctness claim, the user conversation behind a product claim. Where the evidence does not exist, the honest move is to say so and treat the decision as provisional.

## Keep learning the fundamentals

It might seem that fundamentals matter less now. If an agent can write a correct SQL query, a reasonable caching strategy and a working authentication flow, why learn how any of them work?

Because you cannot judge what you do not understand. Reviewing is a skill built on the same knowledge as writing. To notice that an index is missing, you have to know what an index does. To notice that a retry loop will amplify an outage, you have to know how outages unfold. To notice that a permissions check sits in the wrong layer, you have to know where it belongs and why. The agent's fluency makes these problems harder to spot, not easier, because the surrounding code looks so competent.

Fundamentals are also what let you ask good questions, and directing an agent is largely a matter of asking the right question at the right time. Data structures, networking, databases, concurrency, security: these change slowly, and they are what lets you tell a good answer from a plausible one.

So I keep reading, keep building small things by hand now and then, and keep asking agents to explain their choices rather than only accepting them. Not out of nostalgia, but because it is the part of the job that keeps the rest of it honest.

## Where keel fits

keel is a small, practical response to all of this. It is a set of independent agent skills, each aimed at one kind of judgment that capable agents do not reliably supply on their own: shaping what to build ([/skills/shape](/skills/shape)), choosing the next useful increment ([/skills/slice](/skills/slice)), getting an independent second opinion ([/skills/peer](/skills/peer)), looking back at whether something was worth building ([/skills/retro](/skills/retro)), and focused investigation of performance, usability and visual design.

They are not a methodology and have no required order. You use one when its question is the one in front of you, or not at all. The [principles](/principles) behind them are the longer version of this essay's argument, and like the skills, they are meant to change as agents and experience change.

The underlying conviction is simple. Agents provide the speed. Direction has to come from someone, and it is worth doing well.

## Further reading

- [The Lean Startup principles](https://theleanstartup.com/principles), Eric Ries: validated learning and the Build-Measure-Learn loop, which becomes learning-limited when building is fast.
- [The Customer Development Manifesto](https://steveblank.com/category/customer-development-manifesto/), Steve Blank: beliefs about customers as hypotheses to test.
- [Product Talk](https://www.producttalk.org/), Teresa Torres: continuous discovery as a regular habit rather than a phase.
- [Getting Real](https://basecamp.com/gettingreal), 37signals: starting with no, and letting important requests come back on their own.
- [Shape Up](https://basecamp.com/shapeup), Ryan Singer: appetite, fixed time and variable scope.
- [One Metric That Matters](https://leananalyticsbook.com/one-metric-that-matters/), Alistair Croll and Benjamin Yoskovitz: one focus at a time, changing with the stage of the business.
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/), Eric Evans: a shared domain language, now shared with agents too.
- [Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns), Gamma, Helm, Johnson and Vlissides: a vocabulary for recurring structures, and a reminder that a pattern needs a recurring problem.
- [Extreme Programming Explained](https://www.oreilly.com/library/view/extreme-programming-explained/0321278658/), Kent Beck: short feedback loops as the core of the practice.
