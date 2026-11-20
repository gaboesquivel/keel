// Duesy MCP server: lets an AI assistant read overdue invoices.
// Transport: stdio, newline-delimited JSON-RPC 2.0. Written without the SDK because Duesy has no
// dependencies. Run: node mcp-server.mjs
import { createInterface } from 'node:readline'
import { DatabaseSync } from 'node:sqlite'
import { seed } from './seed.mjs'
import { contactFor } from './lib/crm.mjs'

const db = new DatabaseSync(':memory:')
seed(db)

const TOOLS = [
  {
    name: 'overdue_summary',
    description: 'Overdue invoices with balances, grouped by client, with each client\'s preferred contact.',
    inputSchema: { type: 'object', properties: {} },
  },
]

async function overdueSummary() {
  const now = Date.now()
  const open = db.prepare('SELECT * FROM invoices WHERE status = ? ORDER BY due_at').all('open')
  const byClient = new Map()
  for (const inv of open) {
    const paid = db.prepare('SELECT COALESCE(SUM(amount_cents), 0) AS paid FROM payments WHERE invoice_id = ?').get(inv.id).paid
    if (inv.due_at >= now || paid >= inv.amount_cents) continue
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(inv.client_id)
    if (!byClient.has(client.id)) byClient.set(client.id, { client, invoices: [] })
    byClient.get(client.id).invoices.push({ ...inv, balance_cents: inv.amount_cents - paid })
  }
  const groups = []
  for (const group of byClient.values()) {
    group.contact = await contactFor(group.client)
    groups.push(group)
  }
  return groups
}

const reply = (id, result) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n')
const fail = (id, code, message) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n')

createInterface({ input: process.stdin }).on('line', async (line) => {
  let msg
  try { msg = JSON.parse(line) } catch { return fail(null, -32700, 'Parse error') }
  const { id, method, params } = msg
  if (id === undefined) return // notifications, such as notifications/initialized
  if (method === 'initialize')
    return reply(id, { protocolVersion: params?.protocolVersion ?? '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'duesy', version: '0.3.0' } })
  if (method === 'ping') return reply(id, {})
  if (method === 'tools/list') return reply(id, { tools: TOOLS })
  if (method === 'tools/call' && params?.name === 'overdue_summary') {
    const groups = await overdueSummary()
    return reply(id, { content: [{ type: 'text', text: JSON.stringify(groups) }] })
  }
  fail(id, -32601, `Unknown method ${method}`)
})
