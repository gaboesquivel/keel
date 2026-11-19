// Import clients from a CSV with a header row: name,email
export function parseClientsCsv(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/)
  const cols = header.split(',').map((c) => c.trim().toLowerCase())
  const ni = cols.indexOf('name')
  const ei = cols.indexOf('email')
  if (ni < 0 || ei < 0) throw new Error('CSV needs name and email columns')
  return lines.filter(Boolean).map((line) => {
    const cells = line.split(',').map((c) => c.trim())
    return { name: cells[ni], email: cells[ei] }
  })
}
