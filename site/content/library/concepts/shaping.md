---
title: Shaping
summary: "Before committing a team, turn a raw idea into a rough but solved and bounded concept: the problem, an appetite, the solution's main elements, known risks and what is out."
topic: simplicity
byline: Ryan Singer · Shape Up
origin: source
keywords: [shape up, pitch, rabbit holes, no-gos, betting table, circuit breaker, fat marker sketch]
sources:
  - title: Principles of Shaping
    author: Ryan Singer
    work: Shape Up
    publisher: Basecamp
    year: 2019
    kind: book-chapter
    url: https://basecamp.com/shapeup/1.1-chapter-02
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261118031116/https://basecamp.com/shapeup/1.1-chapter-02
  - title: Risks and Rabbit Holes
    author: Ryan Singer
    work: Shape Up
    publisher: Basecamp
    year: 2019
    kind: book-chapter
    url: https://basecamp.com/shapeup/1.4-chapter-05
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261114111747/https://basecamp.com/shapeup/1.4-chapter-05
  - title: Write the Pitch
    author: Ryan Singer
    work: Shape Up
    publisher: Basecamp
    year: 2019
    kind: book-chapter
    url: https://basecamp.com/shapeup/1.5-chapter-06
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261118031116/https://basecamp.com/shapeup/1.5-chapter-06
  - title: The Betting Table
    author: Ryan Singer
    work: Shape Up
    publisher: Basecamp
    year: 2019
    kind: book-chapter
    url: https://basecamp.com/shapeup/2.2-chapter-08
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261029163533/https://basecamp.com/shapeup/2.2-chapter-08
relations:
  builds-on: [appetite]
  in-tension-with:
    - concept: continuous-discovery
      note: Shape Up concentrates problem definition in a small group of senior shapers working ahead of fixed-length cycles, while continuous discovery keeps the whole product trio in weekly customer contact; shaping suits teams that need clear, bounded bets, continuous discovery suits teams whose main risk is not knowing what customers need.
  related: [forget-feature-requests, intent-over-implementation, half-not-half-assed, decision-records]
---

## The idea

Most projects go wrong before anyone starts building, because they are either specified too tightly or too vaguely. Shaping is the work in between: a small group defines the problem, sets how much time it is worth, sketches a solution at a coarse level, removes the risks they can see, and states what is out. The result leaves the builders room to design the details without leaving them to solve the whole problem under a deadline.

## What the source says

Ryan Singer's Shape Up, describing how Basecamp builds product, argues that wireframes are too concrete, because they fix details too early and hide complexity, and that a few words like "build a calendar view" are too abstract, because nobody can make trade-offs or see where to stop. Shaped work sits between them and has three properties: it is rough, so the team can see where their judgment is needed; it is solved, meaning the main elements are worked out and connect; and it is bounded, with an appetite and explicit exclusions.

Singer describes four steps. First, set boundaries: decide the appetite and narrow the problem, often by asking customers when they hit it rather than what they want. Second, rough out the elements of a solution with breadboards and fat-marker sketches. Third, look for rabbit holes: walk through use cases slowly, question technical assumptions, patch holes with explicit decisions, declare cases out of bounds, and check with technical experts. Fourth, write a pitch covering the problem, appetite, solution, rabbit holes and no-gos.

Shaping is done privately by one or two technically literate people, on a separate track from building. Pitches go to a betting table, a short meeting of senior people who choose what the next six-week cycle will build. A circuit breaker backs this up: if a project does not ship within its cycle, it does not get an automatic extension, and the problem goes back to shaping.

## Keel's perspective

Shaping is the discipline of deciding what to build before deciding how. Its outputs are exactly what an agent needs and rarely gets: a clear problem, a size, the shape of the solution, the traps already spotted and the things not to do. A well-shaped pitch is close to a good brief for a coding agent, and an unshaped request is close to a bad one.

The separation of shaping from building also protects judgment. The people deciding scope have done the thinking before the deadline starts, so trade-offs are not made under pressure in the middle of the build.

## When to use it

- A raw idea or request needs to become a commitment someone can build.
- Projects keep running long because they hit unseen problems mid-way.
- Teams receive either pixel-perfect mockups or one-line tickets.
- Preparing work to hand to an agent or to another team.

## Example

For example, a team hears that users want to share documents publicly. The shaper sets a two-week appetite, learns that the real need is sending a read-only link to one client, sketches a share button that creates an unlisted link, flags revocation as a risk to settle up front, and lists out of scope: permissions per person, analytics and custom domains. The pitch fits on one page.

## Limitations

Shaping concentrates product judgment in a few people, which works when those people are skilled and trusted and fails when they are not. Teresa Torres's continuous discovery takes a different view, putting the whole product trio in regular contact with customers rather than having discovery happen mostly before handoff. The full method, with six-week cycles, a cool-down and a betting table, was designed for Basecamp's size and culture, and teams that adopt the ceremony without the authority to cut scope get little of the benefit.
