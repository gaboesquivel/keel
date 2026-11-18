import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

// Exercise the CLI against isolated catalogs rather than the real working tree.
const validator = await readFile(new URL('./validate-catalog.mjs', import.meta.url), 'utf8')

const readmeFor = (name) =>
  `# x\n\n| Skill | What it does |\n| --- | --- |\n| [\`${name}\`](skills/${name}/SKILL.md) | Things. |\n\n## Install\n`
const productFor = (name) => `# x\n\n## Scope\n\nToday: \`${name}\`.\n\n## Non-goals\n\n- None.\n`

const runCatalog = async (name, description, docs) => {
  const root = await mkdtemp(join(tmpdir(), 'skill-catalog-'))
  try {
    await mkdir(join(root, 'scripts'))
    await mkdir(join(root, 'skills', name), { recursive: true })
    await writeFile(join(root, 'scripts', 'validate.mjs'), validator)
    await writeFile(join(root, 'skills.sh.json'), JSON.stringify({ groupings: [{ skills: [name] }] }))
    await writeFile(join(root, 'skills', name, 'SKILL.md'), `---\nname: ${name}\ndescription: ${description}\n---\n`)
    for (const [file, content] of Object.entries(docs)) if (content !== null) await writeFile(join(root, file), content)
    return spawnSync(process.execPath, [join(root, 'scripts', 'validate.mjs')], { encoding: 'utf8' })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

for (const [label, name, description, valid] of [
  ['plain', 'example', 'Useful prose.', true],
  ['quoted', 'example', '"Write: clear prose."', true],
  ['double-quoted comment', 'example', '"Useful prose." # routing note', true],
  ['single-quoted comment', 'example', "'Useful prose.' # routing note", true],
  ['folded with chomping', 'example', '>-\n  continued', false],
  ['literal with chomping', 'example', '|-\n  continued', false],
  ['plain continuation', 'example', 'Useful\n  prose.', false],
  ['quoted continuation', 'example', '"Useful\n  prose."', false],
  ['empty description', 'example', '\nlicense: MIT', false],
  ['leading hyphen', '-example', 'Useful prose.', false],
  ['repeated hyphen', 'my--example', 'Useful prose.', false],
  ['trailing hyphen', 'example-', 'Useful prose.', false],
]) {
  test(label, async () => {
    const result = await runCatalog(name, description, { 'README.md': readmeFor(name), 'PRODUCT.md': productFor(name) })
    assert.equal(result.status, valid ? 0 : 1, result.stdout + result.stderr)
  })
}

const readme = readmeFor('example')
const product = productFor('example')
for (const [label, docs, valid, message] of [
  ['docs list the skill', { 'README.md': readme, 'PRODUCT.md': product }, true],
  ['README.md missing', { 'README.md': null, 'PRODUCT.md': product }, false, 'README.md: missing'],
  ['PRODUCT.md missing', { 'README.md': readme, 'PRODUCT.md': null }, false, 'PRODUCT.md: missing'],
  ['README has no skills table', { 'README.md': 'See [`example`](skills/example/SKILL.md).', 'PRODUCT.md': product }, false, 'no skills table'],
  [
    'README links the skill only outside the table',
    {
      'README.md': '| Skill | What |\n| --- | --- |\n| [`other`](skills/other/SKILL.md) | x |\n\nAlso [`example`](skills/example/SKILL.md).',
      'PRODUCT.md': product,
    },
    false,
    'not linked in the skills table',
  ],
  ['PRODUCT has no Scope section', { 'README.md': readme, 'PRODUCT.md': 'Today: `example`.' }, false, 'no "## Scope" section'],
  [
    'PRODUCT names the skill only outside Scope',
    { 'README.md': readme, 'PRODUCT.md': '## Purpose\n\n`example` helps.\n\n## Scope\n\nNothing yet.\n\n## Non-goals\n\n- `example` clones.\n' },
    false,
    'not named in its Scope section',
  ],
  ['Scope as the last section', { 'README.md': readme, 'PRODUCT.md': '## Scope\n\n`example`\n' }, true],
]) {
  test(label, async () => {
    const result = await runCatalog('example', 'Useful prose.', docs)
    assert.equal(result.status, valid ? 0 : 1, result.stdout + result.stderr)
    if (message) assert.match(result.stderr, new RegExp(message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  })
}
