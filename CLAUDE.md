# CLAUDE.md

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
4. Add a row for it to the skills table in [README.md](README.md), and name it with its responsibility in the Scope section of [PRODUCT.md](PRODUCT.md).
5. Run `npm run validate`. Done when it prints `Catalog OK`.
6. Run `npx skills@latest add . --list`. Done when the skill appears.

## Changing a skill

- Behavior: edit `SKILL.md` and any `references/` it points to.
- Triggering: edit the frontmatter `description`, and check that the skill still loads for the requests it should and stays quiet for the rest.
- Responsibility, name or invocation: also update its row in `README.md` and its entry in `PRODUCT.md`.
- Removing a skill: delete its folder and remove it from `skills.sh.json`, `README.md` and `PRODUCT.md`.

## Keeping documents in sync

A pull request that changes what the catalog contains or what a skill is for updates every document that describes it (`README.md`, `skills.sh.json`, `PRODUCT.md`, and this file when the process changes) in the same pull request, not in a follow-up. When several pull requests touch the same lines, update the documents in each of them and expect a rebase.

## Checks

`npm run validate` checks each `SKILL.md`: `name` matches its folder, `description` is one line of at most 1024 characters, `skills.sh.json` lists exactly the skills under `skills/`, the skills table in `README.md` links every skill, and the Scope section of `PRODUCT.md` names every skill. Both files are required. It does not check the rest of the prose or links. `npm test` covers the validator itself.

## Evaluations

`evals/<skill>/<case>/` holds comparison cases for each skill, built on the shared fixture in `evals/fixtures/`. They stay out of `skills/` so installs don't include them. `evals/compare.sh <skill> <case> <out-dir>` runs one case as plain Claude Code and with the skill invoked, and reports whether both runs are usable. The runs are billed. Repeat them after a model change or a change to a skill's behavior; they are not a required check. [evals/README.md](evals/README.md) covers grading, isolation limits and the first results.

## Git

Use [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(shape): ask for the metric's current level`.

## Product context

- `PRODUCT.md`: Users, goals, metrics, and scope.
- `ARCHITECTURE.md` and `DESIGN.md`, if they exist: technical direction and constraints; experience and visual direction.

Before planning or building a change, read the documents above that it touches.
A request to build something is not a decision to change direction. When it conflicts with documented goals, scope or non-goals, say so and discuss the change before building. If I have already acknowledged and approved that change, proceed without asking again.
When an accepted change makes one of them inaccurate (users, scope, metrics, non-goals, technical or design direction), update it in the same commit or pull request. Routine implementation details do not belong in them.
Change the direction itself only after I have acknowledged and approved it. Asking for a feature that conflicts with it is not approval, and neither are your own suggestions.
