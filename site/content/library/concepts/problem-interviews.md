---
title: Problem Interviews
summary: Learn from customer conversations by asking about their lives and past behavior, not your idea; compliments and hypotheticals are not evidence.
topic: discovery
byline: Rob Fitzpatrick · The Mom Test
origin: source
keywords: [the mom test, customer interviews, talking to users, validation, bias, compliments, commitments]
sources:
  - title: The Mom Test
    author: Rob Fitzpatrick
    year: 2013
    kind: book
    url: https://www.momtestbook.com/
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117095801/https://www.momtestbook.com/
    note: The book's official page describes its purpose but not its rules. The three rules and the treatment of compliments, fluff and commitments summarized here are widely documented about the book; the year is the commonly cited first publication date.
relations:
  related: [riskiest-assumption-first, customer-development, jobs-to-be-done, continuous-discovery, validated-learning]
---

## The idea

Most customer conversations produce false comfort. People are polite, so when you describe your idea they say they like it and would probably use it. A problem interview avoids the trap by not discussing the idea at all: it asks about the person's real situation and what they have actually done, which they cannot easily flatter.

## What the source says

Rob Fitzpatrick's *The Mom Test* (2013) takes its name from a simple standard: ask questions that even your mother could not lie to you about, because they do not invite her to protect your feelings. The book reduces this to three rules.

- **Talk about their life instead of your idea.** Once you pitch, the conversation becomes a verdict on you, and politeness takes over.
- **Ask about specifics in the past instead of generics or opinions about the future.** "Would you use this?" and "How often do you usually…?" invite optimistic guesses. "When did this last happen, and what did you do?" gets facts.
- **Talk less and listen more.** The interviewer's job is to learn, not to persuade.

Fitzpatrick also names the kinds of bad data that conversations generate. Compliments feel like validation but carry no information. Fluff, meaning generic claims, hypotheticals and promises about future behavior, should be steered back to concrete past events. Ideas and feature requests from customers are worth hearing, but the useful move is to dig for the motivation behind them. Real signal comes from facts about past behavior and from commitments: time, reputation or money the person gives up to move forward. A meeting that ends warmly with no next step, he argues, usually means the answer was no.

The book also argues for keeping these conversations casual and frequent rather than formal and rare, and for deciding before each one what you most need to learn.

## Keel's perspective

The core value is a filter for evidence. Every interview produces some mix of facts, opinions and politeness, and the Mom Test gives you a way to sort them afterwards. Writing down only the facts and the commitments is a good discipline; the notes get shorter and more honest.

This pairs naturally with testing the [riskiest assumption first](/library/riskiest-assumption-first). Decide which belief would sink the product if false, then design the questions to find past behavior that bears on it. When an agent can build the first version over a weekend, the temptation is to skip interviews and "let the product decide." A shipped product tells you whether people use what you built; it rarely tells you why the ones who left never had the problem.

## When to use it

- Before building, to check that a problem is real, frequent and costly for a specific group.
- Whenever customer feedback feels encouraging but nothing is converting.
- Preparing questions for [customer development](/library/customer-development) or [continuous discovery](/library/continuous-discovery).

## Example

For example, a founder thinks small landlords struggle to track repairs. A poor interview asks whether a repair-tracking app would help, and gets an enthusiastic yes. A better one asks the landlord to walk through the last repair: how they heard about it, what they used to track it, what went wrong. If the answer is "a text from the tenant, and I fixed it that afternoon," the problem may not be worth solving for this landlord, whatever they say about apps.

## Limitations

Past behavior is a strong guide to existing problems and a weaker one for genuinely new categories, where people have no history to describe. Interviews reveal problems and context; they do not size a market or prove willingness to pay at scale. Asking for commitments too early can sour relationships in small or tight-knit markets. The rules are also easy to follow mechanically while still leading the witness: a question about the past can be just as loaded as one about the future.
