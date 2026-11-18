import { readFile, readdir } from 'node:fs/promises'
import { join, basename, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const skillsRoot = join(root, 'skills')
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const errors = []

const parseFrontmatter = (content) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null

  const block = match[1]
  const name = block.match(/^name:[ \t]*(.*)$/m)?.[1]?.trim()
  const descriptionLine = block.match(/^description:[ \t]*(.*)$/m)?.[1]?.trim()
  const lines = block.split(/\r?\n/)
  const descriptionIndex = lines.findIndex((line) => line.startsWith('description:'))
  const following = lines.slice(descriptionIndex + 1).find((line) => line.trim() && !line.trimStart().startsWith('#'))
  const hasContinuation = following && !/^[a-zA-Z][\w-]*:/.test(following)
  const unclosedQuote = descriptionLine?.startsWith('"')
    ? !/^"(?:[^"\\]|\\.)*"(?:[ \t]+#.*)?$/.test(descriptionLine)
    : descriptionLine?.startsWith("'") && !/^'(?:[^']|'')*'(?:[ \t]+#.*)?$/.test(descriptionLine)

  return { name, descriptionLine, multilineDescription: hasContinuation || unclosedQuote }
}

const walkSkillFiles = async (dir, files = []) => {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walkSkillFiles(path, files)
    else if (entry.name === 'SKILL.md') files.push(path)
  }
  return files
}

const config = JSON.parse(await readFile(join(root, 'skills.sh.json'), 'utf8'))
const groupedNames = config.groupings.flatMap((group) => group.skills)
const skillFiles = await walkSkillFiles(skillsRoot)
const seenNames = new Set()

for (const file of skillFiles) {
  const rel = relative(root, file)
  const folderName = basename(dirname(file))
  const content = await readFile(file, 'utf8')
  const frontmatter = parseFrontmatter(content)

  if (!frontmatter) {
    errors.push(`${rel}: missing YAML frontmatter`)
    continue
  }

  const { name, descriptionLine, multilineDescription } = frontmatter

  if (!name) errors.push(`${rel}: missing name in frontmatter`)
  else if (name !== folderName)
    errors.push(`${rel}: name "${name}" does not match folder "${folderName}"`)
  else if (!namePattern.test(name))
    errors.push(`${rel}: name "${name}" has invalid characters`)
  else if (seenNames.has(name)) errors.push(`${rel}: duplicate skill name "${name}"`)
  else seenNames.add(name)

  if (!descriptionLine) errors.push(`${rel}: missing description in frontmatter`)
  else if (/^[|>]/.test(descriptionLine) || multilineDescription)
    errors.push(`${rel}: description must be a single line, not a YAML block`)
  else if (descriptionLine.length > 1024)
    errors.push(`${rel}: description exceeds 1024 characters (${descriptionLine.length})`)

  if (content.includes('@cursor/skills'))
    errors.push(`${rel}: contains @cursor/skills reference — use catalog-relative paths`)
}

const groupedSet = new Set(groupedNames)
for (const name of seenNames)
  if (!groupedSet.has(name)) errors.push(`skills.sh.json: skill "${name}" is not in any grouping`)

for (const name of groupedNames)
  if (!seenNames.has(name)) errors.push(`skills.sh.json: grouped skill "${name}" has no SKILL.md`)

const readRequired = (file) =>
  readFile(join(root, file), 'utf8').catch(() => {
    errors.push(`${file}: missing or unreadable`)
    return null
  })

// README.md: the table whose header starts with "Skill", up to the first non-table line.
const skillsTable = (content) => {
  const lines = content.split(/\r?\n/)
  const start = lines.findIndex((line) => /^\|\s*Skill\s*\|/.test(line))
  if (start === -1) return null
  const end = lines.findIndex((line, i) => i > start && !line.startsWith('|'))
  return lines.slice(start + 2, end === -1 ? undefined : end).join('\n')
}

// PRODUCT.md: the "## Scope" section, up to the next level-2 heading.
const scopeSection = (content) =>
  content.match(/^## Scope[ \t]*\r?\n([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1] ?? null

const readme = await readRequired('README.md')
const product = await readRequired('PRODUCT.md')
const table = readme === null ? null : skillsTable(readme)
const scope = product === null ? null : scopeSection(product)
if (readme !== null && table === null) errors.push('README.md: no skills table (header "| Skill |")')
if (product !== null && scope === null) errors.push('PRODUCT.md: no "## Scope" section')

for (const name of seenNames) {
  if (table !== null && !table.includes(`(skills/${name}/SKILL.md)`))
    errors.push(`README.md: skill "${name}" is not linked in the skills table`)
  if (scope !== null && !scope.includes(`\`${name}\``))
    errors.push(`PRODUCT.md: skill "${name}" is not named in its Scope section`)
}

for (const [, name] of (table ?? '').matchAll(/\(skills\/([^/)]+)\/SKILL\.md\)/g))
  if (!seenNames.has(name)) errors.push(`README.md: skills table links "${name}", which has no SKILL.md`)

if (groupedNames.length !== seenNames.size)
  errors.push(
    `skills.sh.json lists ${groupedNames.length} skills but catalog has ${seenNames.size}`,
  )

if (errors.length) {
  console.error('Catalog validation failed:\n')
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`Catalog OK: ${seenNames.size} skills, frontmatter valid, skills.sh.json, README.md and PRODUCT.md in sync`)
