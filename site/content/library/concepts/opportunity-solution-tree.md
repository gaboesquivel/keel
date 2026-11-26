---
title: Opportunity Solution Tree
summary: A map from one outcome to the customer needs that could drive it, the solutions for a chosen need, and the assumption tests that decide between them.
topic: discovery
byline: Teresa Torres · Continuous Discovery Habits
origin: source
keywords: [ost, opportunity space, assumption testing, compare and contrast, product outcomes, evidence before commitment, discovery map]
sources:
  - title: "Opportunity Solution Trees: Visualize Your Discovery to Stay Aligned and Drive Outcomes"
    author: Teresa Torres
    publisher: Product Talk
    kind: post
    url: https://www.producttalk.org/opportunity-solution-trees/
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261102004100/https://www.producttalk.org/opportunity-solution-trees/
  - title: Continuous Discovery Habits
    author: Teresa Torres
    publisher: Product Talk
    year: 2021
    kind: book
    url: https://www.producttalk.org/continuous-discovery-habits/
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117095430/https://www.producttalk.org/continuous-discovery-habits/
relations:
  builds-on: [continuous-discovery]
  related: [riskiest-assumption-first, outcomes-over-output, problem-interviews, jobs-to-be-done]
---

## The idea

Teams tend to jump from a goal straight to a favorite feature. An opportunity solution tree puts two layers in between: the customer needs that could move the goal, and the assumptions each candidate solution depends on. The team commits to building only after it has compared several solutions and tested the assumptions that would sink them.

## What the source says

Teresa Torres describes the tree as a visual map of the paths a product team could take to reach an outcome. It has four levels.

At the top is a single **outcome**. Torres recommends a product outcome, a measure of customer behavior or sentiment that the team can directly influence, rather than a business result several steps removed.

Below it is the **opportunity space**: unmet needs, pain points and desires that, if addressed, would move the outcome. Torres insists these come from story-based customer interviews, not brainstorming. A tree built on invented opportunities, she warns, misses the point. Large opportunities break down into smaller ones, and the team picks one small target opportunity at a time. She assesses opportunities by how many customers they affect and how often, by market and company fit, and by how much customers care and how dissatisfied they are today. She deliberately leaves effort out at this stage, having seen teams dismiss needs that later turned out to have simple solutions.

Under the target opportunity sit **solutions**, generated only for that opportunity. Torres recommends exploring at least three, because comparing options produces better decisions than evaluating one idea on its merits.

At the bottom are **assumption tests**. Rather than test each whole idea, the team breaks the solutions into the assumptions they rest on, identifies the riskiest, and runs small tests on those across all the candidates. The results let the team drop ideas, refine one for delivery, or return to the opportunity space.

## Keel's perspective

This is where "evidence before solution commitment" becomes a concrete practice. The tree makes two common failures visible. A solution hanging directly off an outcome, with no opportunity above it, is a guess about customers. A single solution under an opportunity is a decision made before any comparison. Both show up on the page.

The assumption layer matters most when building is cheap. When an agent can build a prototype in an afternoon, the tempting test is to ship the whole idea and see. That test is slow to read and confounded by everything else in the build. Testing the one assumption that would kill the idea, such as whether users will connect their calendar at all, is faster and tells you more. Cheap building should make the assumption tests richer, not replace them.

## When to use it

- A team has an outcome and a backlog of feature ideas with no visible link between them.
- Stakeholders argue about solutions without agreeing on the problem.
- Deciding which of several promising ideas to build next.

## Example

For example, a team owns the outcome "more trial users invite a teammate in week one." Interviews surface opportunities such as "I don't know if my teammate will bother" and "setting up access is tedious." The team targets the second, sketches three solutions (a shareable link, an import from the team's chat tool, a pre-filled invite email), and lists each one's riskiest assumption. A one-day fake-door test shows trial users rarely click an import option, so they drop it and test the shareable link next.

## Limitations

The tree is only as good as the interviews beneath it; a team without a regular research habit tends to fill it with internal opinions. It assumes a team owns an outcome and can choose how to reach it, which many organizations do not allow. Torres acknowledges that comparing three solutions is not always practical under time pressure. And the tree can become a documentation chore, maintained for its own sake rather than used to make the next decision.
