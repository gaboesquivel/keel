# Ops notes

## Incidents

- 2026-07-21: duplicate automatic reminders for 31 invoices after a deploy restarted the scheduler mid-run. Two clients complained to their freelancer.
- 2026-08-30: SMS channel registry entry enabled by a config typo for one user; no gateway configured, so the scheduler threw and skipped that user's email reminders for a week.
- 2026-10-02: webhook channel test endpoint timed out and blocked the scheduler loop for 40 minutes.

## Channel usage since launch (2026-07-06)

- email: 100% of automatic reminders
- sms: 0 users (no gateway contract signed)
- webhook: 0 users

## Support themes (Jul-Nov)

- 19 tickets: "a client got a reminder after they already paid" (payment recorded late in the user's accounting tool)
- 11 tickets: "turned off auto reminders because the tone felt pushy for my long-term clients"
- 3 tickets: CSV import of clients (all resolved by fixing the header row)

## Feature usage

- CSV client import: used by 7 users since May; 0 code changes since it shipped.
