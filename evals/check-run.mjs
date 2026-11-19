// Checks one arm of a comparison and writes <arm-dir>/status.json.
// Usage: node evals/check-run.mjs <arm-dir> <skill-md> <baseline|treatment>
// An arm is usable only if Claude exited cleanly with a final `result` event of subtype `success`,
// and the run's own request log shows the skill's instructions sent to the model (treatment) or
// not sent (baseline). Exits 1 when the arm is not usable.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const [dir, skillMd, arm] = process.argv.slice(2)
const reasons = []
const readLines = (file) =>
  existsSync(file)
    ? readFileSync(file, 'utf8').split('\n').filter(Boolean).flatMap((line) => {
        try { return [JSON.parse(line)] } catch { return [] }
      })
    : []

const exitCode = existsSync(join(dir, 'exit-code')) ? readFileSync(join(dir, 'exit-code'), 'utf8').trim() : 'missing'
if (exitCode !== '0') reasons.push(`claude exit code ${exitCode}`)

const events = readLines(join(dir, 'run.jsonl'))
const result = events.findLast((e) => e.type === 'result')
if (!result) reasons.push('no result event: the run was interrupted or crashed')
else if (result.subtype !== 'success' || result.is_error) reasons.push(`run ended with ${result.subtype}${result.is_error ? ' (is_error)' : ''}`)

// The skill body as the model should receive it: every non-empty line after the frontmatter,
// except lines with $ARGUMENTS, which Claude Code substitutes.
const body = readFileSync(skillMd, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '')
const skillLines = body.split('\n').map((l) => l.trim()).filter((l) => l && !l.includes('$ARGUMENTS'))

// The persisted transcript records each API request; collect the text actually sent.
const transcript = readLines(join(dir, 'transcript.jsonl'))
if (!transcript.length) reasons.push('no transcript: cannot verify which instructions the model received')
const sent = []
const collect = (v) => {
  if (typeof v === 'string') sent.push(v)
  else if (Array.isArray(v)) v.forEach(collect)
  else if (v && typeof v === 'object') Object.values(v).forEach(collect)
}
for (const e of transcript) if (e.type === 'api-request-blob') collect(e.message)
const sentText = sent.join('\n')
const missing = skillLines.filter((l) => !sentText.includes(l))
const skillSent = transcript.length > 0 && missing.length === 0
const unknownCommand = transcript.some((e) => e.attachment?.type === 'unknown_command_fallback')

if (arm === 'treatment') {
  if (unknownCommand) reasons.push('the slash command was not recognised')
  if (!skillSent) reasons.push(`skill instructions not found in the requests (${missing.length}/${skillLines.length} lines missing)`)
} else if (missing.length < skillLines.length / 2) {
  reasons.push('baseline requests contain the skill instructions')
}

const status = {
  arm,
  ok: reasons.length === 0,
  reasons,
  result_subtype: result?.subtype ?? null,
  cost_usd: result?.total_cost_usd ?? null,
  num_turns: result?.num_turns ?? null,
  skill_instructions_sent: skillSent,
}
writeFileSync(join(dir, 'status.json'), JSON.stringify(status, null, 2) + '\n')
console.log(`${arm}: ${status.ok ? 'ok' : 'NOT USABLE: ' + reasons.join('; ')}`)
process.exit(status.ok ? 0 : 1)
