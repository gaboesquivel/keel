// Hourly job (cron): sends automatic reminders. Email is the only enabled channel.
import { registerChannel, EmailChannel, SmsChannel, WebhookChannel } from '../lib/reminders/channel.mjs'
import { runReminders } from '../lib/reminders/scheduler.mjs'

export async function main({ store, emailProvider }) {
  registerChannel(new EmailChannel(emailProvider), { enabled: true })
  registerChannel(new SmsChannel(null), { enabled: false })
  registerChannel(new WebhookChannel(process.env.REMINDER_WEBHOOK_URL ?? ''), { enabled: false })
  const { invoices, clients, sentLog } = await store.load()
  const sent = await runReminders({ invoices, clients, sentLog })
  await store.saveSentLog(sentLog)
  return sent.length
}
