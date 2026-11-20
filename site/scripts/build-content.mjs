// Builds the site's content from the authoritative skill sources in ../skills/<name>/SKILL.md and the authored writing
// in content/writing/ (library.md, essays/*.md, guides/*.md; KEEL_WRITING_DIR overrides the directory for local tests).
// Output: content/generated/content.json (gitignored; regenerated before every dev start, type check and build).
// `--watch` regenerates whenever a file under ../skills or the writing directory changes.
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, watch, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ORDER, PRESENTATION } from '../content/skills.mjs'
import { WRITING_KINDS, commandsFor, createRenderer, createSiteRoutes, parseSkill, parseWriting, sortWriting, validatePresentation } from './content-lib.mjs'

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(siteRoot, '..')
const skillsRoot = join(repoRoot, 'skills')
const outDir = join(siteRoot, 'content/generated')
const writingRoot = process.env.KEEL_WRITING_DIR ? resolve(process.env.KEEL_WRITING_DIR) : join(siteRoot, 'content/writing')
// Essays are published only when KEEL_ESSAYS is on (set per branch in Vercel). Off by default, so main hides them.
const essaysOn = /^(?:1|true|on)$/iu.test(process.env.KEEL_ESSAYS ?? '')
const publishedKinds = WRITING_KINDS.filter((k) => k.kind !== 'essay' || essaysOn)
const hiddenRoutes = WRITING_KINDS.filter((k) => !publishedKinds.includes(k)).map((k) => k.route)
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
  if (problems.length) return problems

  const { render } = createRenderer({ repoUrl, branch: REPO.branch, siteRouteFor: createSiteRoutes(names) })
  const { render: renderWriting } = createRenderer({ repoUrl, branch: REPO.branch, siteRouteFor: createSiteRoutes(names), rootLinksAreRoutes: true, hiddenRoutes })
  const writing = written.entries.map(({ body, ...entry }) => ({ ...entry, ...renderWriting(body, entry.source) }))

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
  const content = { generatedAt: new Date().toISOString(), commit, repo: { ...REPO, url: repoUrl }, skills, writing }
  writeFileSync(join(outDir, 'content.json'), `${JSON.stringify(content)}\n`)
  console.log(`content: ${skills.length} skills from skills/*/SKILL.md (${skills.map((s) => s.name).join(', ')})`)
  if (hiddenRoutes.length) console.log(`content: not published in this build: ${hiddenRoutes.join(', ')} (set KEEL_ESSAYS=on to publish essays)`)
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
  console.log('content: watching skills/ and the writing directory for changes')
} else if (!ok) {
  process.exit(1)
}
