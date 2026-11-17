# AGENTS.md

keel is an Agent Skills catalog. This file covers how its skills are laid out, added, changed, and checked. The install commands are in [README.md](README.md).

## Layout

- One skill per directory: `skills/<name>/SKILL.md`
- No root `SKILL.md`, because the CLI would treat the whole repo as a single skill
- `SKILL.md` should say when to read each `references/` file
- [skills.sh.json](skills.sh.json) groups skills on [skills.sh](https://skills.sh) and does not change install behavior

## Adding a skill

1. Create `skills/<name>/SKILL.md`. Spec: [agentskills.io/specification](https://agentskills.io/specification). The folder name must match the frontmatter `name` (kebab-case).
2. Frontmatter: `name` and a single-line `description` that says what the skill does and when to use it (at most 1024 characters, no YAML `|` or `>` blocks).
3. Add `<name>` to a grouping in [skills.sh.json](skills.sh.json).
4. Run `npm run validate`. Done when it prints `Catalog OK`.
5. Run `npx skills@latest add . --list`. Done when the skill appears.

## Changing a skill

- Behavior: edit `SKILL.md` and any `references/` it points to.
- Triggering: edit the frontmatter `description`, and check that the skill still loads for the requests it should and stays quiet for the rest.

## Checks

`npm run validate` checks each `SKILL.md`: `name` matches its folder, `description` is one line of at most 1024 characters, and `skills.sh.json` lists exactly the skills under `skills/`. It does not check prose or links. `npm test` covers the validator itself.

## Git

Use [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(shape): ask for the metric's current level`.
