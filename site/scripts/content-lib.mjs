// Pure content helpers shared by build-content.mjs and its tests: Markdown rendering and the skill source contract.
// Nothing here reads the repository or the network; callers pass sources in.
import { posix } from 'node:path'
import { Marked } from 'marked'

export const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/gu, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/gu, '-')

/** Flat scalar front matter. Duplicate keys are reported, never resolved silently. */
export const parseFrontmatter = (text) => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u)
  if (!match) return null
  const data = {}
  const duplicates = []
  for (const line of match[1].split(/\r?\n/u)) {
    const i = line.indexOf(':')
    if (i <= 0 || /^\s/u.test(line)) continue
    const key = line.slice(0, i).trim()
    if (key in data) duplicates.push(key)
    data[key] = line.slice(i + 1).trim().replace(/^["']|["']$/gu, '')
  }
  return { data, raw: match[1], body: text.slice(match[0].length), duplicates }
}

export const plain = (md) =>
  md
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, '')
    .replace(/[`*]/gu, '')
    .replace(/[>#|]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()

export const escapeHtml = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

// ---------- rendering ----------

/** Repository path → site route, or null (then the link goes to the file on GitHub). */
export const createSiteRoutes = (skillNames) => (repoPath) => {
  if (repoPath === 'skills' || repoPath === 'skills/') return '/skills'
  const m = repoPath.match(/^skills\/([a-z0-9-]+)(?:\/SKILL\.md|\/)?$/u)
  return m && skillNames.includes(m[1]) ? `/skills/${m[1]}` : null
}

/**
 * Markdown renderer bound to the repository. Relative links resolve against the source file and become a site route
 * when one exists, otherwise the file on GitHub. Raw HTML is shown as text and unsafe link schemes lose their link.
 */
export const createRenderer = ({ repoUrl, branch, siteRouteFor }) => {
  const rewriteHref = (href, sourcePath) => {
    if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/iu.test(href)) return href
    if (href.startsWith('#')) return href
    const [pathPart = '', hash] = href.split('#')
    const resolved = posix.normalize(posix.join(posix.dirname(sourcePath), pathPart))
    const route = siteRouteFor(resolved)
    if (route) return hash ? `${route}#${hash}` : route
    const kind = /\.[a-z0-9]+$/iu.test(resolved) ? 'blob' : 'tree'
    return `${repoUrl}/${kind}/${branch}/${resolved}${hash ? `#${hash}` : ''}`
  }

  /** Render Markdown to HTML with GitHub-compatible heading ids. `dropH1` omits level-1 headings. */
  const render = (markdown, sourcePath, { dropH1 = false } = {}) => {
    const headings = []
    const seen = new Map()
    const marked = new Marked({ gfm: true })
    marked.use({
      walkTokens(token) {
        if (token.type === 'link') token.href = rewriteHref(token.href, sourcePath)
      },
      renderer: {
        heading({ tokens, depth, text }) {
          const inner = this.parser.parseInline(tokens)
          const base = slugify(text.replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1').replace(/[`*_]/gu, ''))
          const n = seen.get(base) ?? 0
          seen.set(base, n + 1)
          const id = n ? `${base}-${n}` : base
          if (depth === 1 && dropH1) return ''
          if (depth <= 3) headings.push({ id, text: plain(text), depth })
          return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>\n`
        },
        code({ text, lang }) {
          const label = lang ? `<span class="code-lang">${escapeHtml(lang)}</span>` : ''
          return `<div class="code-block">${label}<pre><code${lang ? ` class="language-${escapeHtml(lang)}"` : ''}>${escapeHtml(text)}</code></pre></div>\n`
        },
        table(token) {
          const html = marked.Renderer.prototype.table.call(this, token)
          return `<div class="table-wrap" role="region" aria-label="Table" tabindex="0">${html}</div>\n`
        },
        html({ text, block }) {
          if (/^\s*<!--[\s\S]*-->\s*$/u.test(text)) return ''
          return block ? `<p>${escapeHtml(text.trim())}</p>\n` : escapeHtml(text)
        },
        link({ href, title, tokens }) {
          const inner = this.parser.parseInline(tokens)
          // A leading "//" or "/\\" leaves the site, so it is not treated as an internal link.
          if (!/^(?:https?:|mailto:|\/(?![/\\])|#)/iu.test(href)) return inner
          const t = title ? ` title="${escapeHtml(title)}"` : ''
          const rel = /^https?:/u.test(href) ? ' rel="noopener"' : ''
          return `<a href="${escapeHtml(href)}"${t}${rel}>${inner}</a>`
        },
        image({ text }) {
          return escapeHtml(text)
        },
      },
    })
    return { html: marked.parse(markdown), headings }
  }

  return { render, rewriteHref }
}

// ---------- skill source contract ----------

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u

/**
 * Validate one skill's SKILL.md against the catalog contract and return what the site publishes.
 * `folder` is the directory name under skills/; `text` the file contents (or null when missing).
 * @returns {{ skill: null | { name: string, description: string, argumentHint: string | null, frontmatter: string, body: string }, problems: string[] }}
 */
export const parseSkill = ({ folder, text }) => {
  const source = `skills/${folder}/SKILL.md`
  const problems = []
  const fail = (reason) => problems.push(`${source}: ${reason}`)
  if (text === null || text === undefined) {
    fail('missing')
    return { skill: null, problems }
  }
  const fm = parseFrontmatter(text)
  if (!fm) {
    fail('missing YAML front matter')
    return { skill: null, problems }
  }
  const { data, raw, body, duplicates } = fm
  if (duplicates.length) fail(`duplicate front matter keys: ${duplicates.join(', ')}`)
  if (!data.name) fail('front matter has no "name"')
  else if (data.name !== folder) fail(`name "${data.name}" does not match its folder "${folder}"`)
  else if (!NAME.test(data.name)) fail(`name "${data.name}" is not kebab-case`)
  if (!data.description) fail('front matter has no "description"')
  else if (/^[|>]/u.test(data.description)) fail('description must be a single line, not a YAML block')
  else if (data.description.length > 1024) fail(`description exceeds 1024 characters (${data.description.length})`)
  if (!body.trim()) fail('has no instructions after the front matter')
  if (problems.length) return { skill: null, problems }
  return {
    skill: { name: data.name, description: data.description, argumentHint: data['argument-hint'] || null, frontmatter: raw, body },
    problems,
  }
}

/**
 * Presentation metadata is human-oriented copy only (lede, three benefits, an example). It must cover exactly the
 * skills that exist, so a new, renamed or removed skill fails the build until the copy is updated.
 */
export const validatePresentation = (skillNames, presentation) => {
  const problems = []
  const file = 'site/content/skills.mjs'
  for (const name of skillNames) if (!(name in presentation)) problems.push(`${file}: no entry for skill "${name}"`)
  for (const [name, entry] of Object.entries(presentation)) {
    if (!skillNames.includes(name)) {
      problems.push(`${file}: entry "${name}" has no skills/${name}/SKILL.md`)
      continue
    }
    const fail = (reason) => problems.push(`${file}: "${name}" ${reason}`)
    if (typeof entry.headline !== 'string' || !entry.headline.trim()) fail('needs a short benefit headline')
    if (typeof entry.tagline !== 'string' || !entry.tagline.trim()) fail('needs a short tagline')
    if (typeof entry.lede !== 'string' || !entry.lede.trim()) fail('needs a lede')
    else if (entry.lede.length > 240) fail(`lede is ${entry.lede.length} characters; keep it near two lines (240 max)`)
    if (!Array.isArray(entry.benefits) || entry.benefits.length !== 3 || entry.benefits.some((b) => typeof b !== 'string' || !b.trim()))
      fail('needs exactly three benefits')
    const ex = entry.example
    if (!ex || typeof ex.situation !== 'string' || typeof ex.invocation !== 'string') fail('needs an example with a situation and an invocation')
    else if (!ex.invocation.startsWith(`/${name}`)) fail(`example invocation must start with "/${name}"`)
  }
  return problems
}

/** Copy the install and invocation strings from one place so every page shows the same commands. */
export const commandsFor = (owner, repo, skill) => ({
  install: `npx skills@latest add ${owner}/${repo} --skill ${skill.name} -y`,
  invocation: `/${skill.name}${skill.argumentHint ? ` ${skill.argumentHint}` : ''}`,
})
