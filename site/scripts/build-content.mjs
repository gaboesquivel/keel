// Builds the site's content from the authoritative skill sources in ../skills/<name>/SKILL.md.
// Output: content/generated/content.json (gitignored; regenerated before every dev start, type check and build).
// `--watch` regenerates whenever a file under ../skills changes.
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, watch, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ORDER, PRESENTATION } from '../content/skills.mjs'
import { commandsFor, createRenderer, createSiteRoutes, parseSkill, validatePresentation } from './content-lib.mjs'

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(siteRoot, '..')
const skillsRoot = join(repoRoot, 'skills')
const outDir = join(siteRoot, 'content/generated')
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
  if (problems.length) return problems

  const { render } = createRenderer({ repoUrl, branch: REPO.branch, siteRouteFor: createSiteRoutes(names) })

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
  const content = { generatedAt: new Date().toISOString(), commit, repo: { ...REPO, url: repoUrl }, skills }
  writeFileSync(join(outDir, 'content.json'), `${JSON.stringify(content)}\n`)
  console.log(`content: ${skills.length} skills from skills/*/SKILL.md (${skills.map((s) => s.name).join(', ')})`)
  return []
}

const report = (problems) => {
  if (!problems.length) return true
  console.error(`content: the skill sources do not meet the site's contract\n${problems.map((p) => `  - ${p}`).join('\n')}`)
  return false
}

const ok = report(build())

if (process.argv.includes('--watch')) {
  let timer
  watch(skillsRoot, { recursive: true }, () => {
    clearTimeout(timer)
    timer = setTimeout(() => report(build()), 100)
  })
  console.log('content: watching skills/ for changes')
} else if (!ok) {
  process.exit(1)
}
