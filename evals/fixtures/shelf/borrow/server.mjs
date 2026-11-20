// Shelf: lend and borrow tools between neighbours. Evaluation fixture.
// Run: node server.mjs   (PORT=0 picks a free port; the URL is printed on start)
import http from 'node:http'
import { TOOLS } from './seed.mjs'

const requests = [] // { id, toolId, borrower, from, to, message, createdAt }

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const layout = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · Shelf</title></head>
<body><header><a href="/">Shelf</a> · Alder Street · <a href="/requests">Requests</a></header><main>${body}</main></body></html>`

function list() {
  const items = TOOLS.map((t) => `<li><a href="/tools/${t.id}">${esc(t.name)}</a> · ${esc(t.category)} · ${esc(t.owner)}</li>`).join('')
  return layout('Tools', `<h1>Tools on Alder Street</h1><ul>${items}</ul>`)
}

function detail(tool, error) {
  return layout(tool.name, `<h1>${esc(tool.name)}</h1>
<p>${esc(tool.category)} · ${esc(tool.condition)}</p><p>Lent by ${esc(tool.owner)}</p>
${tool.notes ? `<p>${esc(tool.notes)}</p>` : ''}
<h2>Ask to borrow</h2>${error ? '<p role="alert">Please give your name and both dates.</p>' : ''}
<form method="post" action="/tools/${tool.id}/requests">
<label>Your name and house number <input name="borrower" required></label>
<label>From <input type="date" name="from" required></label>
<label>Until <input type="date" name="to" required></label>
<label>Message <textarea name="message"></textarea></label>
<button>Send request</button></form><p><a href="/">All tools</a></p>`)
}

// Lenders check this page to see who asked for their tools.
function requestsPage() {
  const rows = requests.map((r) => {
    const tool = TOOLS.find((t) => t.id === r.toolId)
    return `<tr><td>${esc(tool.name)}</td><td>${esc(tool.owner)}</td><td>${esc(r.borrower)}</td><td>${esc(r.from)} to ${esc(r.to)}</td><td>${esc(r.message)}</td></tr>`
  }).join('')
  return layout('Requests', `<h1>Borrow requests</h1>
<table><thead><tr><th>Tool</th><th>Lender</th><th>Borrower</th><th>Dates</th><th>Message</th></tr></thead><tbody>${rows}</tbody></table>`)
}

const readBody = (req) => new Promise((resolve) => {
  let data = ''
  req.on('data', (c) => (data += c))
  req.on('end', () => resolve(Object.fromEntries(new URLSearchParams(data))))
})

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (status, body) => { res.writeHead(status, { 'content-type': 'text/html; charset=utf-8' }); res.end(body) }
  if (req.method === 'GET' && url.pathname === '/') return send(200, list())
  if (req.method === 'GET' && url.pathname === '/requests') return send(200, requestsPage())
  const m = url.pathname.match(/^\/tools\/(\d+)(\/requests)?$/)
  const tool = m && TOOLS.find((t) => t.id === Number(m[1]))
  if (req.method === 'GET' && tool && !m[2]) return send(200, detail(tool, false))
  if (req.method === 'POST' && tool && m[2]) {
    const f = await readBody(req)
    if (!f.borrower || !f.from || !f.to) return send(422, detail(tool, true))
    requests.push({ id: requests.length + 1, toolId: tool.id, borrower: f.borrower, from: f.from, to: f.to, message: f.message ?? '', createdAt: Date.now() })
    return send(201, layout('Request sent', `<h1>Request sent</h1><p>${esc(tool.owner)} will see your request on the Requests page.</p><p><a href="/">All tools</a></p>`))
  }
  send(404, layout('Not found', '<h1>Not found</h1>'))
})

server.listen(Number(process.env.PORT ?? 0), '127.0.0.1', () => console.log(`Shelf listening on http://127.0.0.1:${server.address().port}`))
// Fixture safety: stop on its own so no evaluation leaves a server behind.
setTimeout(() => process.exit(0), Number(process.env.EXIT_AFTER_MS ?? 45 * 60_000)).unref()
