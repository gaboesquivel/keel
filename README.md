# keel

A keel gives a boat or a surfboard stability and direction while still letting it turn. These skills aim to do the same for building with AI agents: steadier judgment, without a rigid process.

Independent agent skills for product and engineering judgment. Use whichever one helps, whenever it helps. None depends on another, and there is no required order. They usually run in separate sessions on the same project, working from the context it already has.

| Skill | What it does | How it runs |
| --- | --- | --- |
| [`shape`](skills/shape/SKILL.md) | Your product partner. It helps you decide what to build, for whom, why, and what to leave out, whether for a new idea or a feature weighed against the product's direction. Technical questions come in only as far as those decisions need. Once you adopt a direction, it keeps a short `PRODUCT.md` current. | Only when you call it: `/shape [idea or question]` |
| [`peer`](skills/peer/SKILL.md) | Your partner for directing coding agents. It helps you clarify intent, write effective prompts, assess agent responses, and decide the next instruction or action. Technical judgment and critical review support that work. | Only when you call it: `/peer` |
| [`retro`](skills/retro/SKILL.md) | Looks back at a delivered feature, release or product and asks whether you would build the same thing the same way. It recovers the original intent, keeps what was delivered, used and achieved apart, and recommends at most three things to keep, change, remove or explore. It advises; it does not implement. | Only when you call it: `/retro [feature or release]` |
| [`perf`](skills/perf/SKILL.md) | Finds where time and resources go, what causes a slowdown, and whether a change helped. It measures before recommending, keeps field, lab, profile and code-reading evidence apart, and only changes code when you ask it to improve something. | Only when you call it: `/perf [page, operation or goal]` |
| [`experience`](skills/experience/SKILL.md) | Walks a real journey through your running product as its intended user would, and reports the friction they meet: unclear steps, missing feedback, failed recovery, keyboard and accessibility problems. Findings come with steps to reproduce and are labelled as reproduced, inspected, tool-reported or hypothesis. It changes nothing unless you ask for fixes. | Only when you call it: `/experience [journey or task]` |
| [`design`](skills/design/SKILL.md) | Your interface design partner for new screens, refinements, redesigns, critique and prototypes. It starts from what the surface is for, keeps an existing design language unless you ask to change it, and checks the rendered result at real sizes and states. It keeps `DESIGN.md` for direction you adopt. | Only when you call it: `/design [surface or change]` |

## Working across models

keel grew out of an experiment in separating execution from independent judgment.

I use coding agents like Claude Code for implementation and verification, and keep a separate advisory conversation, often with ChatGPT, to challenge assumptions, preserve intent, and examine decisions without inheriting the entire execution history.

I'm also exploring model asymmetry: whether different model families, contexts, and harness capabilities give complementary perspectives and help uncover correlated blind spots. This is an open question, not a proven advantage.

This is an optional practice, not a prescribed workflow. keel's skills remain independent, and using multiple models is never a requirement. The goal is better judgment, not more agents.

## Install

These commands use the [skills CLI](https://github.com/vercel-labs/skills), which works with Claude Code and other agents that read [Agent Skills](https://agentskills.io).

**Every skill, every project on your machine:**

```bash
npx skills@latest add gaboesquivel/keel -g -y
```

**One skill, this project only:**

```bash
npx skills@latest add gaboesquivel/keel --skill shape -y
```

**List without installing:**

```bash
npx skills@latest add gaboesquivel/keel --list
```

`pnpm dlx` and `bunx` work in place of `npx`.

**Manual install for Claude Code:** copy `skills/<name>/` into `~/.claude/skills/` for every project, or into `.claude/skills/` for one.

In Claude Code, every keel skill is a slash command only (`disable-model-invocation`), and the text you type after the command reaches the skill through `$ARGUMENTS`. Other agents may handle this differently: they may load a skill on their own or not pass your argument.

## Contributing

Maintainer notes covering layout, adding a skill, and checks are in [CLAUDE.md](CLAUDE.md).

## License

[MIT](LICENSE)
