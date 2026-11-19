// Automatic reminders: every run, send a reminder through each enabled channel for invoices that are
// overdue and have not been reminded in the last `minGapDays` days.
import { enabledChannels } from './channel.mjs'

const DAY = 86_400_000

export async function runReminders({ invoices, clients, sentLog, now = Date.now(), minGapDays = 7 }) {
  const sent = []
  for (const invoice of invoices) {
    if (invoice.status !== 'open' || invoice.due_at >= now) continue
    const last = sentLog.filter((s) => s.invoiceId === invoice.id).reduce((m, s) => Math.max(m, s.at), 0)
    if (now - last < minGapDays * DAY) continue
    for (const channel of enabledChannels()) {
      await channel.send(invoice, clients.get(invoice.client_id))
      sentLog.push({ invoiceId: invoice.id, channel: channel.name, at: now })
      sent.push({ invoiceId: invoice.id, channel: channel.name })
    }
  }
  return sent
}
