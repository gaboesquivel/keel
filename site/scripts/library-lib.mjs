// Pure helpers for the Library: the concept source contract, the curated index (topics and questions) and the search
// terms. Nothing here reads the repository or the network; build-content.mjs passes sources in. Tested by
// lib/library-source.test.ts.
import { parse as parseYaml } from 'yaml'

import { plain } from './content-lib.mjs'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u
const DATE = /^\d{4}-\d{2}-\d{2}$/u
/** Route segments under /library that are not concepts. */
export const RESERVED = ['topics', 'questions', 'ask', 'search']

export const ORIGINS = ['source', 'keel']
export const SOURCE_KINDS = ['book', 'book-chapter', 'article', 'essay', 'paper', 'talk', 'slides', 'post', 'documentation']
export const SOURCE_STATUS = ['live', 'archived-only']
export const RELATION_KINDS = ['builds-on', 'in-tension-with', 'related']

/** Body sections in reading order. `source` and `keel` origins differ only in how the second section is named. */
export const SECTIONS = [
  { id: 'idea', title: 'The idea', required: true },
  { id: 'source', title: 'What the source says', origin: 'source', required: true },
  { id: 'origin', title: 'Where it comes from', origin: 'keel', required: true },
  { id: 'perspective', title: "Keel's perspective", required: true },
  { id: 'when', title: 'When to use it', required: false },
  { id: 'example', title: 'Example', required: false },
  { id: 'limitations', title: 'Limitations', required: false },
]

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u

/** Split a body into its `##` sections. Text before the first heading is reported, not dropped. */
export const splitSections = (body) => {
  const parts = []
  let preamble = ''
  let current = null
  let fence = null
  for (const line of body.split(/\r?\n/u)) {
    const f = line.match(/^\s{0,3}(`{3,}|~{3,})/u)
    if (f) fence = fence ? (f[1][0] === fence ? null : fence) : f[1][0]
    const h = !fence && line.match(/^##\s+(.+?)\s*#*\s*$/u)
    if (h) {
      current = { title: h[1].replace(/[’`]/gu, "'"), lines: [] }
      parts.push(current)
    } else if (current) current.lines.push(line)
    else preamble += `${line}\n`
  }
  return { preamble: preamble.trim(), sections: parts.map((p) => ({ title: p.title, markdown: p.lines.join('\n').trim() })) }
}

const asList = (value) => (value === undefined || value === null ? [] : Array.isArray(value) ? value : [value])

/**
 * Validate one concept file and return what the site publishes (sections still as Markdown).
 * Cross-references (relations to other concepts, topics) are checked later by `validateLibrary`.
 */
export const parseConcept = ({ slug, source, text }) => {
  const problems = []
  const fail = (reason) => problems.push(`${source}: ${reason}`)
  if (!SLUG.test(slug)) fail(`file name "${slug}" must be kebab-case`)
  if (RESERVED.includes(slug)) fail(`"${slug}" is reserved for a Library route`)
  const m = text.match(FRONTMATTER)
  if (!m) {
    fail('missing front matter')
    return { concept: null, problems }
  }
  let data
  try {
    data = parseYaml(m[1]) ?? {}
  } catch (error) {
    fail(`front matter is not valid YAML (${error.message.split('\n')[0]})`)
    return { concept: null, problems }
  }
  const body = text.slice(m[0].length)

  const str = (key, { max, required = true } = {}) => {
    const v = data[key]
    if (v === undefined || v === null || v === '') {
      if (required) fail(`front matter has no "${key}"`)
      return null
    }
    if (typeof v !== 'string') {
      fail(`"${key}" must be text`)
      return null
    }
    if (/\n/u.test(v.trim())) fail(`"${key}" must be a single line`)
    if (max && v.length > max) fail(`"${key}" exceeds ${max} characters (${v.length})`)
    return v.trim()
  }
  const title = str('title', { max: 80 })
  const summary = str('summary', { max: 200 })
  const topic = str('topic')
  const byline = str('byline', { max: 120 })
  const origin = str('origin')
  if (origin && !ORIGINS.includes(origin)) fail(`origin "${origin}" must be one of ${ORIGINS.join(', ')}`)

  const keywords = asList(data.keywords)
  if (keywords.some((k) => typeof k !== 'string' || !k.trim())) fail('keywords must be a list of words or phrases')

  const sources = []
  if (data.sources !== undefined && !Array.isArray(data.sources)) fail('sources must be a list')
  for (const [i, s] of asList(data.sources).entries()) {
    const at = `source ${i + 1}`
    if (!s || typeof s !== 'object') {
      fail(`${at} must be a record`)
      continue
    }
    if (typeof s.title !== 'string' || !s.title.trim()) fail(`${at} has no title`)
    const hasAuthor = typeof s.author === 'string' && s.author.trim()
    const hasPublisher = typeof s.publisher === 'string' && s.publisher.trim()
    if (!hasAuthor && !hasPublisher) fail(`${at} needs an author or a publisher`)
    if (typeof s.url !== 'string' || !/^https?:\/\/[^\s]+$/u.test(s.url)) fail(`${at} needs an http(s) url`)
    if (!SOURCE_KINDS.includes(s.kind)) fail(`${at} kind "${s.kind}" must be one of ${SOURCE_KINDS.join(', ')}`)
    const status = s.status ?? 'live'
    if (!SOURCE_STATUS.includes(status)) fail(`${at} status "${status}" must be one of ${SOURCE_STATUS.join(', ')}`)
    const checked = s.checked instanceof Date ? s.checked.toISOString().slice(0, 10) : String(s.checked ?? '')
    if (!DATE.test(checked)) fail(`${at} needs "checked" as YYYY-MM-DD`)
    if (s.archive !== undefined && (typeof s.archive !== 'string' || !/^https:\/\/web\.archive\.org\/web\/\d{4,14}[a-z_]*\/\S+$/u.test(s.archive)))
      fail(`${at} archive must be a web.archive.org snapshot URL`)
    if (status === 'archived-only' && !s.archive) fail(`${at} is archived-only but has no archive URL`)
    if (s.year !== undefined && !(Number.isInteger(s.year) && s.year > 1500 && s.year < 2100)) fail(`${at} year must be a whole year`)
    sources.push({
      title: String(s.title ?? '').trim(),
      author: typeof s.author === 'string' ? s.author.trim() : null,
      work: typeof s.work === 'string' ? s.work.trim() : null,
      publisher: typeof s.publisher === 'string' ? s.publisher.trim() : null,
      year: Number.isInteger(s.year) ? s.year : null,
      kind: s.kind,
      url: s.url,
      checked,
      status,
      archive: s.archive ?? null,
      note: typeof s.note === 'string' ? s.note.trim() : null,
    })
  }
  if (origin === 'source' && !sources.length) fail('an idea from a source needs at least one source')

  const relations = { 'builds-on': [], 'in-tension-with': [], related: [] }
  const rel = data.relations ?? {}
  if (typeof rel !== 'object' || Array.isArray(rel)) fail('relations must be a record')
  else
    for (const [kind, value] of Object.entries(rel)) {
      if (!RELATION_KINDS.includes(kind)) {
        fail(`unknown relation "${kind}" (use ${RELATION_KINDS.join(', ')})`)
        continue
      }
      for (const item of asList(value)) {
        if (kind === 'in-tension-with') {
          if (!item || typeof item.concept !== 'string' || typeof item.note !== 'string' || !item.note.trim())
            fail('each in-tension-with item needs a concept and a note')
          else relations[kind].push({ slug: item.concept, note: item.note.trim() })
        } else if (typeof item !== 'string') fail(`${kind} must list concept slugs`)
        else relations[kind].push({ slug: item, note: null })
      }
    }
  const seen = new Set()
  for (const kind of RELATION_KINDS)
    for (const r of relations[kind]) {
      if (r.slug === slug) fail(`relates to itself under ${kind}`)
      if (seen.has(r.slug)) fail(`lists "${r.slug}" under more than one relation`)
      seen.add(r.slug)
    }

  const { preamble, sections: raw } = splitSections(body)
  if (preamble) fail('has text before the first ## section')
  const allowed = SECTIONS.filter((s) => !s.origin || s.origin === origin)
  const sections = []
  let last = -1
  for (const s of raw) {
    const def = allowed.find((d) => d.title.toLowerCase() === s.title.toLowerCase())
    if (!def) {
      fail(`unexpected section "## ${s.title}" (allowed: ${allowed.map((d) => d.title).join(', ')})`)
      continue
    }
    const index = allowed.indexOf(def)
    if (index <= last) fail(`section "## ${def.title}" is out of order or repeated`)
    last = index
    if (!s.markdown) fail(`section "## ${def.title}" is empty`)
    sections.push({ id: def.id, title: def.title, markdown: s.markdown })
  }
  for (const d of allowed) if (d.required && !sections.some((s) => s.id === d.id)) fail(`missing section "## ${d.title}"`)

  if (problems.length) return { concept: null, problems }
  const words = plain(sections.map((s) => s.markdown).join(' ')).split(' ').filter(Boolean).length
  return {
    concept: { slug, source, title, summary, topic, byline, origin, keywords: keywords.map((k) => k.trim()), sources, relations, sections, words },
    problems,
  }
}

/** Parse library.yaml: topics in display order and the questions that start exploration. */
export const parseIndex = ({ source, text }) => {
  const problems = []
  const fail = (reason) => problems.push(`${source}: ${reason}`)
  let data
  try {
    data = parseYaml(text) ?? {}
  } catch (error) {
    fail(`not valid YAML (${error.message.split('\n')[0]})`)
    return { index: null, problems }
  }
  const topics = []
  for (const t of asList(data.topics)) {
    if (!t || !SLUG.test(t.slug ?? '') || typeof t.title !== 'string' || typeof t.description !== 'string') {
      fail('each topic needs a kebab-case slug, a title and a description')
      continue
    }
    topics.push({ slug: t.slug, title: t.title.trim(), short: typeof t.short === 'string' ? t.short.trim() : t.title.trim(), description: t.description.trim() })
  }
  const questions = []
  for (const q of asList(data.questions)) {
    if (!q || !SLUG.test(q.slug ?? '') || typeof q.title !== 'string' || typeof q.framing !== 'string') {
      fail('each question needs a kebab-case slug, a title and a framing')
      continue
    }
    const concepts = []
    for (const c of asList(q.concepts)) {
      if (!c || typeof c.concept !== 'string' || typeof c.why !== 'string') fail(`question "${q.slug}": each concept needs a concept slug and a why`)
      else concepts.push({ slug: c.concept, why: c.why.trim() })
    }
    if (concepts.length < 2) fail(`question "${q.slug}" needs at least two concepts`)
    questions.push({ slug: q.slug, title: q.title.trim(), framing: q.framing.trim(), concepts })
  }
  if (!topics.length) fail('no topics')
  if (!questions.length) fail('no questions')
  for (const list of [topics, questions]) {
    const dup = list.map((x) => x.slug).filter((s, i, a) => a.indexOf(s) !== i)
    if (dup.length) fail(`duplicate slugs: ${[...new Set(dup)].join(', ')}`)
  }
  return { index: problems.length ? null : { topics, questions }, problems }
}

/** Links inside concept text that point at /library/<slug>. */
export const libraryLinks = (markdown) => [...markdown.matchAll(/\]\(\/library\/([a-z0-9-]+)(?:#[^)]*)?\)/gu)].map((m) => m[1])

/** Cross-references: topics, relations, question concepts and in-text links must all resolve. */
export const validateLibrary = ({ concepts, index, indexSource }) => {
  const problems = []
  const slugs = new Set(concepts.map((c) => c.slug))
  const topicSlugs = new Set(index.topics.map((t) => t.slug))
  for (const c of concepts) {
    if (!topicSlugs.has(c.topic)) problems.push(`${c.source}: topic "${c.topic}" is not defined in ${indexSource}`)
    for (const kind of RELATION_KINDS)
      for (const r of c.relations[kind]) if (!slugs.has(r.slug)) problems.push(`${c.source}: ${kind} "${r.slug}" is not a concept`)
    for (const s of c.sections) for (const link of libraryLinks(s.markdown)) if (!slugs.has(link) && !RESERVED.includes(link)) problems.push(`${c.source}: links to /library/${link}, which is not a concept`)
  }
  for (const q of index.questions)
    for (const c of q.concepts) if (!slugs.has(c.slug)) problems.push(`${indexSource}: question "${q.slug}" lists "${c.slug}", which is not a concept`)
  for (const t of index.topics) if (!concepts.some((c) => c.topic === t.slug)) problems.push(`${indexSource}: topic "${t.slug}" has no concepts`)
  return problems
}

/**
 * Connections for one concept, both directions. A relation declared on either side shows on both pages: builds-on
 * reads as "builds on" here and "built on by" there; tension and related are symmetric.
 */
export const connectionsFor = (slug, concepts) => {
  const self = concepts.find((c) => c.slug === slug)
  const out = { buildsOn: [], builtOnBy: [], tension: [], related: [] }
  const add = (list, item) => {
    if (!list.some((x) => x.slug === item.slug)) list.push(item)
  }
  for (const r of self.relations['builds-on']) add(out.buildsOn, r)
  for (const r of self.relations['in-tension-with']) add(out.tension, r)
  for (const r of self.relations.related) add(out.related, r)
  for (const other of concepts) {
    if (other.slug === slug) continue
    for (const r of other.relations['builds-on']) if (r.slug === slug) add(out.builtOnBy, { slug: other.slug, note: null })
    for (const r of other.relations['in-tension-with']) if (r.slug === slug) add(out.tension, { slug: other.slug, note: r.note })
    for (const r of other.relations.related) if (r.slug === slug) add(out.related, { slug: other.slug, note: null })
  }
  const taken = new Set([...out.buildsOn, ...out.builtOnBy, ...out.tension].map((r) => r.slug))
  out.related = out.related.filter((r) => !taken.has(r.slug))
  return out
}
