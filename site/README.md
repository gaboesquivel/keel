# keel website

The public site for keel: the homepage, the skill catalog, one page per skill, and About. Next.js (App Router), React, TypeScript, Tailwind and pnpm, statically generated. It started as a simplified copy of the Flow Skills website.

## Develop

```bash
pnpm install
pnpm dev
```

## Where content comes from

Each skill's instructions live only in [`../skills/<name>/SKILL.md`](../skills). `pnpm content` (run before `dev`, `check-types` and `build`) discovers every skill directory, parses its frontmatter, renders the complete Markdown body, and writes `content/generated/content.json` (gitignored). `pnpm dev` also watches `../skills` and regenerates on change. Never edit the generated file.

[`content/skills.mjs`](content/skills.mjs) holds presentation copy only: a tagline, a short lede, three benefits and an example invocation per skill, plus display order. It must not restate instructions.

The build fails, naming the file to fix, when a `SKILL.md` is missing, has no frontmatter, has a `name` that differs from its folder, a missing or multi-line `description`, or no body, or when `content/skills.mjs` doesn't cover exactly the skills under `skills/`. Adding, renaming or removing a skill therefore needs its copy updated in the same change.

Rendering escapes raw HTML, drops unsafe link schemes, links `skills/<name>/SKILL.md` to its page, and links every other relative path (such as `references/web.md`) to the file on GitHub.

| Script | Purpose |
| --- | --- |
| `pnpm content` | Regenerate the content from `../skills` |
| `pnpm qa` | Lint, types, tests |
| `pnpm build` | Production build |

## Layout

| Path | Owns |
| --- | --- |
| `scripts/content-lib.mjs` | Markdown rendering and the skill source contract; pure, tested by `lib/skill-source.test.ts` |
| `scripts/build-content.mjs` | Reads `../skills` and writes the generated content |
| `content/skills.mjs` | Presentation copy and display order |
| `components/home/sections.tsx` | Homepage sections |
| `components/logo.tsx`, `app/icon.svg`, `lib/og.tsx` | The keel mark; one set of paths shared by the header, favicon, Apple icon and OG image |
| `styles/globals.css` | Prism tokens and rendered-Markdown styles |

Visual direction is in [`../DESIGN.md`](../DESIGN.md).

## Deploy (Vercel)

Vercel project `keel` (scope `gaboesquivel`), connected to `gaboesquivel/keel`, **Root Directory** `site`, with "Include files outside the root directory in the Build Step" enabled because the content build reads `../skills`. Framework, install and build commands come from [`vercel.json`](vercel.json). No environment variables are required; `NEXT_PUBLIC_SITE_URL` optionally sets the canonical origin once a domain is chosen. Every push and pull request gets a preview deployment.
