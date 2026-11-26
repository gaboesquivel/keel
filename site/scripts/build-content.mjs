// Builds the site's content from the authoritative skill sources in ../skills/<name>/SKILL.md and the authored writing
// in content/writing/ (library.md, essays/*.md, guides/*.md; KEEL_WRITING_DIR overrides the directory for local tests).
// Output: content/generated/content.json (gitignored; regenerated before every dev start, type check and build).
// `--watch` regenerates whenever a file under ../skills or the writing directory changes.
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, watch, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ORDER, PRESENTATION } from '../content/skills.mjs'
import { WRITING_KINDS, commandsFor, createRenderer, createSiteRoutes, parseSkill, parseWriting, plain, sortWriting, validatePresentation } from './content-lib.mjs'
import { connectionsFor, parseConcept, parseIndex, validateLibrary } from './library-lib.mjs'

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(siteRoot, '..')
const skillsRoot = join(repoRoot, 'skills')
const outDir = join(siteRoot, 'content/generated')
const writingRoot = process.env.KEEL_WRITING_DIR ? resolve(process.env.KEEL_WRITING_DIR) : join(siteRoot, 'content/writing')
// Essays, guides and the Library are published only when their flag is on (set per environment or branch in Vercel).
// Off by default, so main hides them. The Library is still validated when hidden, so broken entries fail every build.
const flagOn = (name) => /^(?:1|true|on)$/iu.test(process.env[name] ?? '')
const KIND_FLAGS = { essay: 'KEEL_ESSAYS', guide: 'KEEL_GUIDES' }
const publishedKinds = WRITING_KINDS.filter((k) => !KIND_FLAGS[k.kind] || flagOn(KIND_FLAGS[k.kind]))
const libraryOn = flagOn('KEEL_LIBRARY')
const hiddenRoutes = [...WRITING_KINDS.filter((k) => !publishedKinds.includes(k)).map((k) => k.route), ...(libraryOn ? [] : ['/library'])]
const libraryRoot = process.env.KEEL_LIBRARY_DIR ? resolve(process.env.KEEL_LIBRARY_DIR) : join(siteRoot, 'content/library')
const librarySource = (rel) => (process.env.KEEL_LIBRARY_DIR ? `${libraryRoot}/${rel}` : `site/content/library/${rel}`)
const writingSource = (rel) => (process.env.KEEL_WRITING_DIR ? `${writingRoot}/${rel}` : `site/content/writing/${rel}`)

/** Every piece of writing that exists. A missing file or directory is not an error: that section is simply not published. */
const readWriting = () => {
  const problems = []
  const entries = []
  for (const { kind, file, dir, route } of publishedKinds) {
    const files = file
      ? [{ rel: file, slug: null }]
      : existsSync(join(writingRoot, dir))
        ? readdirSync(join(writingRoot, dir))
            .filter((f) => f.endsWith('.md') && !f.startsWith('.'))
            .sort()
            .map((f) => ({ rel: `${dir}/${f}`, slug: f.replace(/\.md$/u, '') }))
        : []
    for (const { rel, slug } of files) {
      const path = join(writingRoot, rel)
      if (!existsSync(path)) continue
      const { entry, problems: p } = parseWriting({
        kind,
        slug: slug ?? kind,
        route: slug ? `${route}/${slug}` : route,
        source: writingSource(rel),
        text: readFileSync(path, 'utf8'),
      })
      problems.push(...p)
      if (entry) entries.push(entry)
    }
  }
  return { problems, entries: sortWriting(entries) }
}
/**
 * The Library: one Markdown file per concept in content/library/concepts/ and the curated topics and questions in
 * content/library/library.yaml. A missing directory publishes no Library; anything present must be valid.
 */
const readLibrary = () => {
  const dir = join(libraryRoot, 'concepts')
  const indexFile = join(libraryRoot, 'library.yaml')
  if (!existsSync(dir)) return { problems: [], concepts: [], index: null }
  const problems = []
  const concepts = []
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('.')).sort()) {
    const { concept, problems: p } = parseConcept({ slug: f.replace(/\.md$/u, ''), source: librarySource(`concepts/${f}`), text: readFileSync(join(dir, f), 'utf8') })
    problems.push(...p)
    if (concept) concepts.push(concept)
  }
  if (!concepts.length) return { problems, concepts: [], index: null }
  if (!existsSync(indexFile)) return { problems: [...problems, `${librarySource('library.yaml')}: missing (topics and questions)`], concepts, index: null }
  const { index, problems: ip } = parseIndex({ source: librarySource('library.yaml'), text: readFileSync(indexFile, 'utf8') })
  problems.push(...ip)
  if (index && !problems.length) problems.push(...validateLibrary({ concepts, index, indexSource: librarySource('library.yaml') }))
  return { problems, concepts, index }
}

const REPO = { owner: 'gaboesquivel', name: 'keel', branch: 'main' }
const repoUrl = `https://github.com/${REPO.owner}/${REPO.name}`

const build = () => {
  if (!existsSync(skillsRoot)) return [`skills/: not found at ${skillsRoot}. The build needs the repository root (on Vercel, include files outside the root directory).`]

  const folders = readdirSync(skillsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()

  const problems = []
  const parsed = []
  for (const folder of folders) {
    const file = join(skillsRoot, folder, 'SKILL.md')
    const { skill, problems: p } = parseSkill({ folder, text: existsSync(file) ? readFileSync(file, 'utf8') : null })
    problems.push(...p)
    if (skill) parsed.push(skill)
  }
  if (!folders.length) problems.push('skills/: no skill directories')

  const names = parsed.map((s) => s.name)
  problems.push(...validatePresentation(folders, PRESENTATION))
  const orderMismatch = ORDER.length !== folders.length || folders.some((n) => !ORDER.includes(n))
  if (orderMismatch) problems.push(`site/content/skills.mjs: ORDER [${ORDER.join(', ')}] must list exactly [${folders.join(', ')}]`)
  const written = readWriting()
  problems.push(...written.problems)
  const lib = readLibrary()
  problems.push(...lib.problems)
  if (problems.length) return problems

  const { render } = createRenderer({ repoUrl, branch: REPO.branch, siteRouteFor: createSiteRoutes(names) })
  const { render: renderWriting } = createRenderer({ repoUrl, branch: REPO.branch, siteRouteFor: createSiteRoutes(names), rootLinksAreRoutes: true, hiddenRoutes })
  const writing = written.entries.map(({ body, ...entry }) => ({ ...entry, ...renderWriting(body, entry.source) }))
  const topicOrder = (lib.index?.topics ?? []).map((t) => t.slug)
  const concepts = lib.concepts
    .slice()
    .sort((a, b) => topicOrder.indexOf(a.topic) - topicOrder.indexOf(b.topic) || a.title.localeCompare(b.title))
    .map(({ sections, relations: _relations, ...c }) => ({
      ...c,
      sections: sections.map((s) => ({ id: s.id, title: s.title, html: renderWriting(s.markdown, c.source).html, text: plain(s.markdown) })),
      connections: connectionsFor(c.slug, lib.concepts),
    }))
  const library = libraryOn ? { topics: lib.index?.topics ?? [], questions: lib.index?.questions ?? [], concepts } : { topics: [], questions: [], concepts: [] }

  const skills = ORDER.map((name) => {
    const skill = parsed.find((s) => s.name === name)
    const source = `skills/${name}/SKILL.md`
    const dir = join(skillsRoot, name)
    const files = readdirSync(dir, { recursive: true })
      .map((p) => String(p).split(/[\\/]/u).join('/'))
      .filter((p) => statSync(join(dir, p)).isFile() && !p.split('/').some((part) => part.startsWith('.')))
      .sort()
    const { html, headings } = render(skill.body, source, { dropH1: true })
    return {
      ...skill,
      ...PRESENTATION[name],
      ...commandsFor(REPO.owner, REPO.name, skill),
      source,
      files,
      html,
      headings,
    }
  })

  const commit = (() => {
    if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA
    try {
      return execSync('git rev-parse HEAD', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    } catch {
      return null
    }
  })()

  mkdirSync(outDir, { recursive: true })
  const content = { generatedAt: new Date().toISOString(), commit, repo: { ...REPO, url: repoUrl }, skills, writing, library }
  writeFileSync(join(outDir, 'content.json'), `${JSON.stringify(content)}\n`)
  console.log(`content: ${skills.length} skills from skills/*/SKILL.md (${skills.map((s) => s.name).join(', ')})`)
  if (hiddenRoutes.length) console.log(`content: not published in this build: ${hiddenRoutes.join(', ')} (set KEEL_ESSAYS, KEEL_GUIDES or KEEL_LIBRARY to on to publish them)`)
  console.log(`content: ${concepts.length} Library concepts${libraryOn ? '' : ' validated, not published'}, ${library.topics.length} topics, ${library.questions.length} questions`)
  console.log(`content: ${writing.length} pieces of writing${writing.length ? ` (${writing.map((w) => w.route).join(', ')})` : ''}`)
  return []
}

const report = (problems) => {
  if (!problems.length) return true
  console.error(`content: the sources do not meet the site's contract\n${problems.map((p) => `  - ${p}`).join('\n')}`)
  return false
}

const ok = report(build())

if (process.argv.includes('--watch')) {
  let timer
  const rebuild = () => {
    clearTimeout(timer)
    timer = setTimeout(() => report(build()), 100)
  }
  watch(skillsRoot, { recursive: true }, rebuild)
  if (existsSync(writingRoot)) watch(writingRoot, { recursive: true }, rebuild)
  if (existsSync(libraryRoot)) watch(libraryRoot, { recursive: true }, rebuild)
  console.log('content: watching skills/ and the writing directory for changes')
} else if (!ok) {
  process.exit(1)
}
