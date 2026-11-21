---
title: Code Is Spent, Not Produced
summary: Lines of code are a cost to be carried, not output to be counted; the value lies in what the software does, not in how much of it exists.
topic: software-design
byline: Edsger W. Dijkstra · EWD 1036
origin: source
keywords: [code is a liability, lines of code, maintenance cost, productivity metrics, deleting code, ownership]
sources:
  - title: On the cruelty of really teaching computing science (EWD 1036)
    author: Edsger W. Dijkstra
    publisher: E. W. Dijkstra Archive, University of Texas at Austin
    year: 1988
    kind: essay
    url: https://www.cs.utexas.edu/~EWD/transcriptions/EWD10xx/EWD1036.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261118061711/https://www.cs.utexas.edu/~EWD/transcriptions/EWD10xx/EWD1036.html
    note: Dated 2 December 1988. The lines-of-code remark is a short aside; the essay is mainly about teaching programming through formal reasoning.
  - title: Code is not an asset
    author: Marcel Weiher
    publisher: metablog
    year: 2008
    kind: post
    url: https://blog.metaobject.com/2008/08/code-is-not-asset.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20260615141036/https://blog.metaobject.com/2008/08/code-is-not-asset.html
    note: An early explicit "code is a liability" accounting argument. Who first coined that phrase is uncertain; it is attributed variously to Weiher, Tim Ottinger and others.
relations:
  related: [earn-your-abstractions, build-less, strategic-programming, deep-modules, refactoring]
---

## The idea

Every line of code is something someone must read, test, secure, upgrade and eventually remove. Its value comes from the behavior it provides, not from its existence. So the same behavior with less code is worth more, and a growing line count is a cost, not a sign of progress.

## What the source says

In EWD 1036 (1988), Edsger Dijkstra criticizes measuring programmer productivity in lines of code produced per month. He calls it a costly unit because it rewards bloated, insipid code, and then makes a sharper point from a business view: if lines are to be counted at all, they belong on the other side of the ledger. In his words, they should be counted as "lines spent", not as output.

The remark is an aside in a long essay about teaching programming as formal reasoning, and Dijkstra does not develop a theory of maintenance from it. The fuller accounting version came later and from others. Marcel Weiher's 2008 post, responding to Michael Feathers on technical debt, argues that the functionality is the asset and the code is the liability, which explains why removing code while keeping behavior adds value. The phrase "code is a liability" now circulates widely and its first coiner is unclear.

## Keel's perspective

Coding agents have made the cost side of this ledger easy to forget. Generating code is now nearly free; owning it is not. Each generated file still needs someone who understands why it exists, still breaks when a dependency moves, still widens the surface an attacker or a bug can reach, and still has to be read by the next person, or the next agent, before they can change anything near it. Across a product's life, keeping software working usually costs more than writing it did, and cheap generation only shifts more of the total into that later phase.

So keel treats maintaining software, not producing code, as the job. The useful questions are whether this needs to exist, whether existing code already covers it, and whether the change leaves less to understand than before. A pull request that deletes more than it adds while keeping behavior is often the best one of the week.

## When to use it

- Judging progress, especially when agent output makes volume look like velocity.
- Deciding whether to build a feature, adopt a dependency or add an abstraction.
- Reviewing generated changes that add helpers, wrappers or copies of existing logic.
- Planning cleanup: deleting dead features and paths is real work with real return.

## Example

For example, an agent asked to add CSV export writes a new 400-line module with its own formatting, escaping and file handling. A reviewer applying this lens asks first what already exists, finds an export path used for reports, and has the agent extend it with one new format. The feature is the same. The amount of code the team now owns is a fraction of the first version.

## Limitations

"Less code" is a heuristic, not a target. Code golf, dense one-liners and over-clever abstractions reduce line count while making code harder to own. Tests, clear names and explicit error handling add lines and lower the real cost. Some code is a durable asset in practice, such as a well-designed core that many features build on. The point is that cost scales with what must be understood and maintained, which lines of code only roughly track.
