---
title: Outcomes Over Output
summary: Judge work by the change in customer behavior it causes, not by the features shipped; an outcome is a behavior change that drives business results.
topic: strategy
byline: Joshua Seiden · Outcomes Over Output
origin: source
keywords: [outcomes, outputs, impact, behavior change, product goals, feature factory, okrs]
sources:
  - title: "Outcomes Over Output: Why Customer Behavior Is the Key Metric for Business Success"
    author: Joshua Seiden
    publisher: Sense & Respond Press
    year: 2019
    kind: book
    url: https://www.senseandrespondpress.com/managing-outcomes
    checked: 2026-11-20
    status: archived-only
    archive: https://web.archive.org/web/20240510113215/https://www.senseandrespondpress.com/managing-outcomes
    note: The publisher's domain no longer resolves; the archived page describes the book. Claims here are limited to the publisher description and Seiden's own interview.
  - title: Josh Seiden on why product teams should focus on outcomes over output
    author: Intercom (interview with Josh Seiden)
    publisher: Intercom
    year: 2019
    kind: post
    url: https://www.intercom.com/blog/podcasts/josh-seiden-on-why-product-teams-should-focus-on-outcome-vs-output
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20251208002611/https://www.intercom.com/blog/podcasts/josh-seiden-on-why-product-teams-should-focus-on-outcome-vs-output/
  - title: Books
    author: Joshua Seiden
    publisher: joshuaseiden.com
    kind: post
    url: https://www.joshuaseiden.com/books
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20250516025448/https://www.joshuaseiden.com/books
    note: The author's own page listing the book.
relations:
  related: [product-drift, opportunity-solution-tree, north-star-metric, build-less, intent-over-implementation]
---

## The idea

A feature is output: something the team made. What matters is whether anyone does something differently because of it. Set goals as the behavior you want to change, measure that behavior, and treat features as bets on how to change it.

## What the source says

Joshua Seiden, co-author of Lean UX and Sense & Respond, wrote Outcomes Over Output as a short practical guide. His starting point is that software is never finished, so "build these features" is a poor goal: teams can ship everything on the list and create no value. Instead, teams should be given an outcome to achieve.

His definition, stated in a 2019 interview: "An outcome is a change in human behavior that drives business results." He separates three layers. Output is what the team produces. Outcomes are changes in what customers, users or employees do. Impact is the high-level business result, such as lower costs or more revenue. Seiden argues that organizations often state the impact they want and then jump straight to features, skipping the outcome layer; no single feature delivers a broad impact on its own. He asks teams to say, before building, what will change for users once something ships, and to check adoption and value afterwards instead of moving on.

## Keel's perspective

Behavior is the right unit because it sits in the middle: concrete enough to observe within weeks, close enough to the business to matter. A team that can say "new customers will import their data on day one" can design, test and abandon features against that sentence.

The idea gets sharper when building is cheap. With coding agents, output is nearly free, and a backlog can be emptied faster than anyone can learn whether it should have been. Counting shipped features or merged changes becomes meaningless as a measure of progress. The behavior change is the only thing that still costs real time to observe, which makes it the honest bottleneck. Writing the intended outcome next to each piece of work is also the simplest defense against a product that grows in directions nobody chose.

## When to use it

- When planning a quarter or a roadmap, to state goals as behaviors instead of feature lists.
- When a feature ships and the team is about to move on without checking whether it was used.
- When directing agents or contractors, to give them the behavior the work should produce, not only the spec.

## Example

For example, a team is asked to "add CSV import". Framed as an outcome, the goal becomes: more new accounts bring their existing data in during the first session, because accounts that do tend to stay. That framing opens other options, such as importing from a competitor directly or offering a sample dataset, and it gives the team a measure to check after shipping. If import usage rises but retention does not, the theory, not the feature, was wrong.

## Limitations

Some work is genuinely output-shaped: compliance requirements, contractual commitments, infrastructure that must exist before any behavior can change. Behavior can be slow or noisy to measure in low-traffic products, and teams sometimes swap in a proxy that quietly becomes another output count. Choosing outcomes also requires authority; a team handed a fixed feature list cannot adopt the idea alone, so the idea is as much about how organizations plan as about how teams work.
