// Deterministic seed data: 40 clients, 1,600 invoices, ~57,000 payments (paid invoices are settled in
// many instalments), ~2,400 reminders.
const DAY = 86_400_000

function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32)
}

export function seed(db) {
  db.exec(`
    CREATE TABLE clients (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL);
    CREATE TABLE invoices (id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, number TEXT NOT NULL,
      amount_cents INTEGER NOT NULL, issued_at INTEGER NOT NULL, due_at INTEGER NOT NULL, status TEXT NOT NULL);
    CREATE TABLE payments (id INTEGER PRIMARY KEY, invoice_id INTEGER NOT NULL, amount_cents INTEGER NOT NULL, paid_at INTEGER NOT NULL);
    CREATE TABLE reminders (id INTEGER PRIMARY KEY, invoice_id INTEGER NOT NULL, channel TEXT NOT NULL, sent_at INTEGER NOT NULL);
  `)
  const r = rng(42)
  const now = Date.now()
  const names = ['Acme', 'Birch', 'Cobalt', 'Delta', 'Ember', 'Fable', 'Granite', 'Harbor', 'Iris', 'Juniper']
  const insClient = db.prepare('INSERT INTO clients (name, email) VALUES (?, ?)')
  for (let i = 0; i < 40; i++) insClient.run(`${names[i % 10]} ${['Studio', 'Labs', 'Co', 'Works'][Math.floor(i / 10)]}`, `billing${i}@example.test`)
  const insInv = db.prepare('INSERT INTO invoices (client_id, number, amount_cents, issued_at, due_at, status) VALUES (?, ?, ?, ?, ?, ?)')
  const insPay = db.prepare('INSERT INTO payments (invoice_id, amount_cents, paid_at) VALUES (?, ?, ?)')
  const insRem = db.prepare('INSERT INTO reminders (invoice_id, channel, sent_at) VALUES (?, ?, ?)')
  db.exec('BEGIN')
  for (let i = 1; i <= 1600; i++) {
    const issued = now - Math.floor(r() * 300) * DAY
    const due = issued + 30 * DAY
    const amount = 20000 + Math.floor(r() * 480000)
    const paidFully = r() < 0.55
    insInv.run(1 + Math.floor(r() * 40), `INV-${String(i).padStart(5, '0')}`, amount, issued, due, paidFully ? 'paid' : 'open')
    const parts = paidFully ? 40 + Math.floor(r() * 50) : Math.floor(r() * 4)
    for (let p = 0; p < parts; p++) insPay.run(i, paidFully ? Math.ceil(amount / parts) : Math.floor(amount / 6), issued + Math.floor(r() * 60) * DAY)
    const reminders = Math.floor(r() * 4)
    for (let k = 0; k < reminders; k++) insRem.run(i, 'email', due + (k + 1) * 7 * DAY)
  }
  db.exec('COMMIT')
}
