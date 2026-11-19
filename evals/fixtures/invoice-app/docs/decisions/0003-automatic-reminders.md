# 0003: Automatic reminders through pluggable channels

Date: 2026-06-30. Status: accepted.

## Context

Freelancers forget to press the reminder button. Paid-within-30 sits at 41% (launch baseline). Interviews with six users: four said they would "set it and forget it" if reminders went out on their own.

## Decision

Send reminders automatically every 7 days for each overdue invoice. Build a channel abstraction (email, SMS, webhook) with a registry, so SMS and webhook delivery can be switched on per user later without touching the scheduler.

Expected outcome: paid-within-30 rises from 41% to 55% within one quarter of launch.

## Alternatives considered

- Use the email provider's built-in drip sequences (Postmark): rejected, because it would tie us to one channel.
- Keep reminders manual and add a weekly nudge email to the freelancer: rejected as too passive.

## Consequences

Three channel implementations to maintain. SMS needs a gateway contract; webhook needs retries.
