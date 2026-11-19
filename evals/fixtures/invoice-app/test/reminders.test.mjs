import { test } from 'node:test'
import assert from 'node:assert/strict'
import { runReminders } from '../lib/reminders/scheduler.mjs'
import { registerChannel, registry, EmailChannel } from '../lib/reminders/channel.mjs'

const DAY = 86_400_000

function setup() {
  registry.clear()
  const delivered = []
  registerChannel(new EmailChannel({ deliver: async (m) => delivered.push(m) }), { enabled: true })
  const clients = new Map([[1, { id: 1, email: 'a@example.test' }]])
  const invoices = [{ id: 10, client_id: 1, number: 'INV-1', status: 'open', due_at: Date.now() - 20 * DAY }]
  return { delivered, clients, invoices }
}

test('sends a reminder for an overdue invoice', async () => {
  const { delivered, clients, invoices } = setup()
  await runReminders({ invoices, clients, sentLog: [] })
  assert.equal(delivered.length, 1)
})

test('does not remind the same invoice twice within the gap', async () => {
  const { delivered, clients, invoices } = setup()
  const sentLog = []
  await runReminders({ invoices, clients, sentLog })
  await runReminders({ invoices, clients, sentLog, now: Date.now() + 2 * DAY })
  assert.equal(delivered.length, 1)
})

test('skips invoices that are not yet due', async () => {
  const { delivered, clients } = setup()
  await runReminders({ invoices: [{ id: 11, client_id: 1, number: 'INV-2', status: 'open', due_at: Date.now() + DAY }], clients, sentLog: [] })
  assert.equal(delivered.length, 0)
})
