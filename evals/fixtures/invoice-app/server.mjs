// Duesy: a small invoice-reminder app used as an evaluation fixture.
// Run: node server.mjs   (PORT=0 picks a free port; the URL is printed on start)
import http from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync, existsSync } from 'node:fs'
import { seed } from './seed.mjs'

const db = new DatabaseSync(process.env.DB_PATH ?? ':memory:')
seed(db)

const DAY = 86_400_000
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const money = (cents) => '$' + (cents / 100).toFixed(2)

function overdueInvoices(clientId) {
  const now = Date.now()
  let rows = db.prepare('SELECT * FROM invoices WHERE status = ? ORDER BY due_at').all('open')
  const result = []
  for (const inv of rows) {
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(inv.client_id)
    const paid = db.prepare('SELECT COALESCE(SUM(amount_cents), 0) AS paid FROM payments WHERE invoice_id = ?').get(inv.id).paid
    const last = db.prepare('SELECT MAX(sent_at) AS last FROM reminders WHERE invoice_id = ?').get(inv.id).last
    if (inv.due_at < now && paid < inv.amount_cents) {
      if (clientId && String(client.id) !== String(clientId)) continue
      result.push({ ...inv, client, balance: inv.amount_cents - paid, lastReminder: last })
    }
  }
  return result
}

function layout(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Duesy</title><link rel="stylesheet" href="/static/app.css">
<script src="/static/chart-lib.js" defer></script></head>
<body><header class="top"><a href="/" class="brand">Duesy</a><nav><a href="/">Overdue</a><a href="/invoices/new">New invoice</a></nav></header>
<main>${body}</main></body></html>`
}

function dashboard(clientId) {
  const items = overdueInvoices(clientId)
  const clients = db.prepare('SELECT id, name FROM clients ORDER BY name').all()
  const total = items.reduce((s, i) => s + i.balance, 0)
  const rows = items.map((i) => `<tr>
  <td>${esc(i.number)}</td><td>${esc(i.client.name)}</td><td class="num">${money(i.balance)}</td>
  <td class="muted">${new Date(i.due_at).toISOString().slice(0, 10)}</td>
  <td class="muted">${i.lastReminder ? Math.round((Date.now() - i.lastReminder) / DAY) + 'd ago' : 'never'}</td>
  <td><form method="post" action="/invoices/${i.id}/remind"><button class="icon">&#9993;</button></form></td></tr>`).join('')
  const options = clients.map((c) => `<option value="${c.id}" ${String(c.id) === String(clientId) ? 'selected' : ''}>${esc(c.name)}</option>`).join('')
  return layout('Overdue', `<h1>Overdue invoices</h1>
<p class="summary">${items.length} invoices · ${money(total)} outstanding</p>
<form class="filter" method="get" action="/"><select name="client"><option value="">All clients</option>${options}</select><button>Filter</button></form>
<table class="grid"><thead><tr><th>Invoice</th><th>Client</th><th>Balance</th><th>Due</th><th>Last reminder</th><th></th></tr></thead>
<tbody>${rows}</tbody></table>`)
}

function newInvoiceForm(error) {
  const clients = db.prepare('SELECT id, name FROM clients ORDER BY name').all()
  return layout('New invoice', `<h1>New invoice</h1>
${error ? '<p class="error">Something went wrong. Please try again.</p>' : ''}
<form method="post" action="/invoices" class="stack">
<select name="client_id"><option value="">Client</option>${clients.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select>
<input name="number" placeholder="Invoice number">
<input name="amount" placeholder="Amount (USD)">
<input name="due" placeholder="Due date (YYYY-MM-DD)">
<button class="primary">Create invoice</button></form>`)
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => resolve(Object.fromEntries(new URLSearchParams(data))))
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (status, body, type = 'text/html; charset=utf-8') => { res.writeHead(status, { 'content-type': type }); res.end(body) }
  try {
    if (req.method === 'GET' && url.pathname === '/') return send(200, dashboard(url.searchParams.get('client')))
    if (req.method === 'GET' && url.pathname === '/api/invoices') return send(200, JSON.stringify(overdueInvoices(url.searchParams.get('client'))), 'application/json')
    if (req.method === 'GET' && url.pathname === '/invoices/new') return send(200, newInvoiceForm(false))
    if (req.method === 'POST' && url.pathname === '/invoices') {
      const f = await readBody(req)
      const amount = Math.round(Number(f.amount) * 100)
      const due = Date.parse(f.due)
      if (!f.client_id || !f.number || !(amount > 0) || Number.isNaN(due)) return send(422, newInvoiceForm(true))
      db.prepare('INSERT INTO invoices (client_id, number, amount_cents, issued_at, due_at, status) VALUES (?, ?, ?, ?, ?, ?)')
        .run(Number(f.client_id), f.number, amount, Date.now(), due, 'open')
      res.writeHead(303, { location: '/' }); return res.end()
    }
    const remind = url.pathname.match(/^\/invoices\/(\d+)\/remind$/)
    if (req.method === 'POST' && remind) {
      await new Promise((r) => setTimeout(r, 1500)) // simulated email provider call
      db.prepare('INSERT INTO reminders (invoice_id, channel, sent_at) VALUES (?, ?, ?)').run(Number(remind[1]), 'email', Date.now())
      res.writeHead(303, { location: '/' }); return res.end()
    }
    if (req.method === 'GET' && url.pathname.startsWith('/static/')) {
      const file = new URL('.' + url.pathname, import.meta.url)
      if (existsSync(file)) return send(200, readFileSync(file), url.pathname.endsWith('.css') ? 'text/css' : 'text/javascript')
    }
    send(404, layout('Not found', '<h1>Not found</h1>'))
  } catch (err) {
    console.error(err)
    send(500, layout('Error', '<h1>Something went wrong</h1>'))
  }
})

server.listen(Number(process.env.PORT ?? 0), '127.0.0.1', () => console.log(`Duesy listening on http://127.0.0.1:${server.address().port}`))
// Fixture safety: stop on its own so no evaluation leaves a server behind.
setTimeout(() => process.exit(0), Number(process.env.EXIT_AFTER_MS ?? 45 * 60_000)).unref()
