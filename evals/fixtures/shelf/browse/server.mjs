// Shelf: lend and borrow tools between neighbours. Evaluation fixture.
// Run: node server.mjs   (PORT=0 picks a free port; the URL is printed on start)
import http from 'node:http'
import { TOOLS } from './seed.mjs'

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const layout = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · Shelf</title></head>
<body><header><a href="/">Shelf</a> · Alder Street</header><main>${body}</main></body></html>`

function list() {
  const items = TOOLS.map((t) => `<li><a href="/tools/${t.id}">${esc(t.name)}</a> · ${esc(t.category)} · ${esc(t.owner)}</li>`).join('')
  return layout('Tools', `<h1>Tools on Alder Street</h1><ul>${items}</ul>`)
}

function detail(tool) {
  return layout(tool.name, `<h1>${esc(tool.name)}</h1>
<p>${esc(tool.category)} · ${esc(tool.condition)}</p><p>Lent by ${esc(tool.owner)}</p>
${tool.notes ? `<p>${esc(tool.notes)}</p>` : ''}<p><a href="/">All tools</a></p>`)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (status, body) => { res.writeHead(status, { 'content-type': 'text/html; charset=utf-8' }); res.end(body) }
  if (req.method === 'GET' && url.pathname === '/') return send(200, list())
  const m = url.pathname.match(/^\/tools\/(\d+)$/)
  const tool = m && TOOLS.find((t) => t.id === Number(m[1]))
  if (req.method === 'GET' && tool) return send(200, detail(tool))
  send(404, layout('Not found', '<h1>Not found</h1>'))
})

server.listen(Number(process.env.PORT ?? 0), '127.0.0.1', () => console.log(`Shelf listening on http://127.0.0.1:${server.address().port}`))
// Fixture safety: stop on its own so no evaluation leaves a server behind.
setTimeout(() => process.exit(0), Number(process.env.EXIT_AFTER_MS ?? 45 * 60_000)).unref()
