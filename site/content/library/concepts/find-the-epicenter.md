---
title: Find the Epicenter
summary: Identify the one element a screen or product cannot exist without, build that first and well, and only then work outward to the parts around it.
topic: simplicity
byline: 37signals · Getting Real
origin: source
keywords: [epicenter design, core feature, essentials first, interface design, prioritization, core loop]
sources:
  - title: Epicenter Design
    author: Jason Fried, David Heinemeier Hansson, Matthew Linderman
    work: Getting Real
    publisher: 37signals
    year: 2006
    kind: book-chapter
    url: https://basecamp.com/gettingreal/09.2-epicenter-design
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261020104122/https://basecamp.com/gettingreal/09.2-epicenter-design
    note: In the book, "epicenter design" is about designing a page or screen. Applying it to a whole product draws on the Half, Not Half-Assed chapter below.
  - title: Half, Not Half-Assed
    author: Jason Fried, David Heinemeier Hansson, Matthew Linderman
    work: Getting Real
    publisher: 37signals
    year: 2006
    kind: book-chapter
    url: https://basecamp.com/gettingreal/05.1-half-not-half-assed
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261022043923/https://basecamp.com/gettingreal/05.1-half-not-half-assed
    note: Describes Basecamp starting with only its messages section, which the authors saw as the heart of the app.
relations:
  related: [small-vertical-slices, half-not-half-assed, build-less, jobs-to-be-done]
---

## The idea

Every screen, and every product, has a center: the thing it exists to do. Find it, build it first, and finish it before touching anything around it. Navigation, chrome, settings and secondary features come later, in order of how much the core needs them.

## What the source says

Getting Real introduces epicenter design as a way to design a page. The epicenter is whatever the page cannot live without; on a page that shows a blog post, it is the post itself, not the sidebar, header or comment form. 37signals advise designing that unit first, then the second most important element, then the third. They contrast this with the habit of building the frame first, adding navigation and marketing material, and then fitting the actual purpose of the page into whatever space is left, which they call backwards. Their stated benefits are a more focused, usable screen and an earlier start to the conversation between designer and developer.

The book makes a related point at the level of the product in its chapter on building half a product. There, the authors say Basecamp launched with only its messages section, because they saw messaging as the heart of the app, and deferred milestones and to-do lists so that later decisions could rest on real use. The book does not use the word epicenter for that product-level choice; connecting the two is this entry's reading.

## Keel's perspective

The useful move is the question, not the layout technique: what is this thing for, at its core? Teams often skip it because the periphery is easier to start on. A login page, a settings screen and a nav bar are well understood; the core interaction is where the hard, uncertain design lives. Starting at the edges feels like progress while postponing the real risk.

With agents doing the building, the periphery appears almost for free, which makes it easy to end up with a complete-looking shell around an unfinished center. Naming the epicenter explicitly, and refusing to accept work outside it until it is good, keeps the effort where the product's value is.

## When to use it

- Starting a new screen, feature or product from a blank page.
- A design review where most of the discussion is about chrome rather than content.
- Deciding the first slice of a new product to put in front of users.
- Briefing an agent: say what the center is, and ask for it first.

## Example

For example, a team building a habit-tracking app could begin with onboarding, accounts and a dashboard. Asking for the epicenter instead points at one interaction: marking today's habit as done, and seeing the streak. They build that screen first with fake data and no login, use it themselves for a week, and adjust it. Only once checking in feels right do they add accounts, reminders and history.

## Limitations

Some products have no single center; a platform or a toolkit may have several equally important uses, and forcing one epicenter distorts it. Peripheral parts are sometimes on the critical path: if nobody can sign up, the core never gets used, and security or data handling cannot be bolted on at the end. The technique also says nothing about whether the center is the right one; that is a discovery question it assumes is answered.
