---
title: Earn Your Abstractions
summary: Tolerate duplication until real cases show what is truly shared, because the wrong abstraction costs more than the copies it replaced.
topic: software-design
byline: Sandi Metz · Don Roberts · Martin Fowler
origin: source
keywords: [wrong abstraction, rule of three, duplication, dry, premature abstraction, inlining, sunk cost]
sources:
  - title: The Wrong Abstraction
    author: Sandi Metz
    publisher: sandimetz.com
    year: 2016
    kind: post
    url: https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117173448/https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction
  - title: "Refactoring: Improving the Design of Existing Code"
    author: Martin Fowler
    publisher: Addison-Wesley
    year: 1999
    kind: book
    url: https://martinfowler.com/books/refactoring.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117081726/https://martinfowler.com/books/refactoring.html
    note: Source of the Rule of Three, which Fowler credits to Don Roberts in the book's discussion of when to refactor (second edition 2018). The credit is widely quoted from the book; the linked page describes the book and does not itself mention the rule.
relations:
  in-tension-with:
    - concept: deep-modules
      note: Ousterhout favors designing somewhat general interfaces early so modules stay deep, while this idea waits for repeated cases; early generality wins when the concept is well understood, waiting wins when it is still a guess.
  related: [code-is-a-liability, refactoring, simple-design]
---

## The idea

An abstraction should be earned by evidence, not granted on suspicion. Two similar pieces of code are a hint, not a pattern; merging them bets that they will keep changing together. When that bet is wrong, the shared code grows flags and branches until it is harder to work with than the duplication ever was. The title is keel's phrasing for a position that draws on two separate pieces of advice.

## What the source says

The Rule of Three comes from Martin Fowler's *Refactoring* (1999), where he credits it to Don Roberts as a guideline for when to refactor. The first time you do something, you just do it. The second time, you notice the duplication and do it anyway. The third time, you refactor. The point is timing: by the third case you have enough examples to see what actually varies.

Sandi Metz's 2016 post "The Wrong Abstraction" describes what happens when abstraction comes too early or is never revisited. A programmer extracts duplicated code into a shared method. A new requirement almost fits, so the next programmer adds a parameter and a conditional. This repeats until the abstraction is a tangle that no caller fully uses, and people keep extending it because so much has already been invested in it. Her remedy is to go backwards: inline the abstraction into every caller, delete from each copy what that caller does not need, and then look again for what is genuinely shared. Her central line is that "duplication is far cheaper than the wrong abstraction."

Neither author argues against abstraction. Fowler's book is about improving design continually; Metz's post is about recovering from a specific, common mistake. Combining the two into a single stance, wait for evidence and be willing to undo, is keel's synthesis.

## Keel's perspective

Abstractions are cheap to create and expensive to remove, because everything that calls them comes to depend on their shape. That asymmetry is the reason to wait. An abstraction that has to be argued for, with three real callers and a clear name for what they share, tends to be one worth keeping.

This matters with agents, which tend to deduplicate eagerly and will happily extract a helper from two lookalike blocks. The useful instruction is the opposite of "keep it DRY": leave the copies until the pattern is clear, and when an existing abstraction is fighting every change, inline it rather than adding another flag.

## When to use it

- Reviewing a change that extracts a shared function from two call sites.
- Adding a boolean or mode parameter to an existing shared function.
- Working in a helper whose branches mostly serve one caller each.
- Deciding whether two similar features should share code yet.

## Example

For example, a signup form and an invite form both validate email and name, so someone extracts a shared validator. Later, invites allow a missing name and signups add a password check, and the validator grows two flags. Following Metz's advice, a team inlines it back into both forms, removes the dead branches, and finds the only truly shared piece is a three-line email check, which they extract alone.

## Limitations

Three is a heuristic, not a law; duplication that encodes one business rule should be unified at the second copy, because the copies drifting apart is itself a bug. Waiting can become an excuse for copy-paste that never gets revisited. And John Ousterhout's argument for somewhat general, deep interfaces cautions that waiting for many special cases can leave a system of shallow, special-purpose code; see [Deep Modules](/library/deep-modules).
