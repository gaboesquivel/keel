---
title: Strategic Programming
summary: Treat working code as the minimum, and spend a steady slice of effort improving the design, because complexity accumulates one small shortcut at a time.
topic: software-design
byline: John Ousterhout · A Philosophy of Software Design
origin: source
keywords: [tactical programming, tactical tornado, technical debt, design investment, incremental complexity, code quality]
sources:
  - title: A Philosophy of Software Design
    author: John Ousterhout
    publisher: Yaknyam Press
    year: 2018
    kind: book
    url: https://web.stanford.edu/~ouster/cgi-bin/book.php
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117232900/https://web.stanford.edu/~ouster/cgi-bin/book.php
    note: Second edition 2021. The "roughly 10 to 20 percent" investment figure is widely reported from the book but was not verified against the text during this check.
  - title: "Episode 520: John Ousterhout on A Philosophy of Software Design"
    author: John Ousterhout (interviewed by Jeff Doolittle)
    publisher: Software Engineering Radio
    year: 2022
    kind: talk
    url: https://se-radio.net/2022/07/episode-520-john-ousterhout-on-a-philosophy-of-software-design/
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20260712174710/https://se-radio.net/2022/07/episode-520-john-ousterhout-on-a-philosophy-of-software-design/
    note: In this interview Ousterhout discusses tactical versus strategic programming and the tactical tornado, and frames the cost as letting a schedule slip by around 5 to 10 percent.
  - title: A Philosophy of Software Design vs Clean Code
    author: John Ousterhout, Robert C. Martin
    publisher: GitHub
    year: 2025
    kind: article
    url: https://github.com/johnousterhout/aposd-vs-clean-code
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20260714114443/https://github.com/johnousterhout/aposd-vs-clean-code
relations:
  in-tension-with:
    - concept: simple-design
      note: Ousterhout argues for investing in design beyond the immediate need, while XP's simple design and YAGNI defer it to refactoring; up-front thought wins when the problem is understood, deferral wins when requirements are still moving.
  related: [code-is-a-liability, deep-modules, refactoring, information-hiding]
---

## The idea

There are two ways to write code. Tactical programming aims to get the current task working as fast as possible. Strategic programming aims to leave the system in a good design, with working code as a side effect. Because complexity creeps in through many small, individually reasonable shortcuts, the only defense is a small, continuous investment in design rather than an occasional cleanup.

## What the source says

John Ousterhout sets out the distinction early in *A Philosophy of Software Design* (2018). His starting point is that complexity is incremental: no single dependency or special case makes a system hard to work in, but hundreds of them do, and by the time it is obvious the cost of removing them is large. A tactical programmer adds one more of these each time, because each looks cheap. The strategic programmer treats the long-term structure as the actual product.

He does not argue for big up-front design. He argues for a modest, steady overhead: taking a little longer on each task to find a cleaner design, fixing small problems when you see them, and writing good comments. The figure commonly cited from the book is roughly 10 to 20 percent of development time; in a 2022 interview on Software Engineering Radio he put it as accepting a schedule slip of around 5 to 10 percent. He presents it as an investment that returns more than it costs, because future changes get faster, while conceding in that interview that nobody has quantified the return.

He also names the *tactical tornado*: a prolific developer who ships features quickly and is often celebrated for it, while leaving a trail of complexity that others spend their time absorbing. In his published debate with Robert C. Martin, Ousterhout argues that test-driven development, as practiced in very small increments, pushes developers toward tactical work.

## Keel's perspective

The useful part of this idea is not the percentage but the accounting. A shortcut is never free; it is a loan against everyone who touches the code later, including you. Naming the two modes lets a team say out loud which one it is in, and why.

Agents shift the balance in an interesting way. They make the tactical path nearly free, which means the tornado can now be a tool rather than a person, producing working changes faster than anyone can review their structure. The response is not to slow the agent down but to spend some of the time it saves on the strategic part: asking for the cleaner design, merging the duplicated helpers, and reviewing structure as seriously as behavior.

## When to use it

- Planning work on a codebase you expect to maintain for more than a few months.
- Setting expectations for a team, or for agent-generated changes, about what "done" means.
- Noticing that small features now take much longer than they used to.
- Deciding whether a deadline genuinely justifies a shortcut, and recording it if so.

## Example

For example, a task asks for a new export format. The tactical version copies the existing exporter and changes a few branches; it ships the same day. The strategic version takes perhaps half a day longer to separate what every export shares from what differs, so the third format costs an hour. Neither choice is visible to a user this week. Both are visible to the team in six months.

## Limitations

The approach assumes the code will live long enough for the investment to return; a throwaway prototype, or a product still searching for its market, can rationally stay tactical for a while. "Strategic" can become a license for gold-plating or speculative architecture, which is the opposite of what he describes. The investment figures are his experienced judgment, not measured data, and his critique of TDD is contested; Robert C. Martin's responses are in the same debate.
