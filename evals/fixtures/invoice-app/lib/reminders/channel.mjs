// Delivery channels for reminders. Each channel implements send(invoice, client) and returns a receipt.
// Email is the only channel enabled in production; SMS and webhook were built for the roadmap in ADR 0003.
export class Channel {
  constructor(name) { this.name = name }
  async send() { throw new Error(`${this.name}: send() not implemented`) }
}

export class EmailChannel extends Channel {
  constructor(provider) { super('email'); this.provider = provider }
  async send(invoice, client) {
    return this.provider.deliver({ to: client.email, subject: `Reminder: ${invoice.number} is overdue`, invoiceId: invoice.id })
  }
}

export class SmsChannel extends Channel {
  constructor(gateway) { super('sms'); this.gateway = gateway }
  async send(invoice, client) {
    if (!client.phone) return { skipped: true }
    return this.gateway.text(client.phone, `Invoice ${invoice.number} is overdue`)
  }
}

export class WebhookChannel extends Channel {
  constructor(url, fetchImpl = fetch) { super('webhook'); this.url = url; this.fetch = fetchImpl }
  async send(invoice) {
    const res = await this.fetch(this.url, { method: 'POST', body: JSON.stringify({ type: 'invoice.overdue', invoice: invoice.id }) })
    return { status: res.status }
  }
}

export const registry = new Map()
export function registerChannel(channel, { enabled = false } = {}) { registry.set(channel.name, { channel, enabled }) }
export function enabledChannels() { return [...registry.values()].filter((c) => c.enabled).map((c) => c.channel) }
