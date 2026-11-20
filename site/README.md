# keel website

The public site for keel: the homepage, the skill catalog, one page per skill, the Library, essays and guides, and About. Next.js (App Router), React, TypeScript, Tailwind and pnpm, statically generated. It started as a simplified copy of the Flow Skills website.

## Develop

```bash
pnpm install
pnpm dev
```

## Where content comes from

Each skill's instructions live only in [`../skills/<name>/SKILL.md`](../skills). `pnpm content` (run before `dev`, `check-types` and `build`) discovers every skill directory, parses its frontmatter, renders the complete Markdown body, and writes `content/generated/content.json` (gitignored). `pnpm dev` also watches `../skills` and regenerates on change. Never edit the generated file.

[`content/skills.mjs`](content/skills.mjs) holds presentation copy only: a short benefit headline, a tagline, a short lede, three benefits and an example invocation per skill, plus display order. It must not restate instructions.

The build fails, naming the file to fix, when a `SKILL.md` is missing, has no frontmatter, has a `name` that differs from its folder, a missing or multi-line `description`, or no body, or when `content/skills.mjs` doesn't cover exactly the skills under `skills/`. Adding, renaming or removing a skill therefore needs its copy updated in the same change.

Rendering escapes raw HTML, drops unsafe link schemes, links `skills/<name>/SKILL.md` to its page, and links every other relative path (such as `references/web.md`) to the file on GitHub.

### Writing

The Library, essays and guides are Markdown in [`content/writing/`](content/writing): `library.md` → `/library` (`/principles` redirects there permanently), `essays/<slug>.md` → `/essays/<slug>`, `guides/<slug>.md` → `/guides/<slug>` (the file name is the slug). The same build renders them into the `writing` collection of the generated content, with headings for the contents list, a word count and reading time.

```
---
title: The Art of Building with Agents
subtitle: Optional one line.
description: One plain sentence, at most 160 characters, used for meta tags and index listings.
date: 2026-11-19
order: 1   # optional, orders the guides index
---
```

Frontmatter is flat `key: value` lines. The body starts at `##` (the page renders the title as the only h1); no raw HTML, images or footnotes. Root-relative links (`/library`, `/skills/shape`) stay site routes; external links get `rel="noopener"`. The build fails, naming the file, on a missing title, description or date, a multi-line or over-long description, a date that isn't a real YYYY-MM-DD, a non-numeric `order`, a non-kebab-case file name or an h1. A missing file or directory is not an error: that section, its navigation link and its sitemap entries are simply absent. Essays are published only when `KEEL_ESSAYS=on` at build time; without it the essays section is left out like a missing one, and links to `/essays` in other writing keep their text but lose the link. Production (main) leaves it unset; the Vercel Preview environment for the `essays` branch sets it. To try layouts without touching `content/writing/`, point the build at another directory with `KEEL_WRITING_DIR=/path/to/writing pnpm build`. New kinds (such as field notes) are added to `WRITING_KINDS` in `scripts/content-lib.mjs` together with their routes.

| Script | Purpose |
| --- | --- |
| `pnpm content` | Regenerate the content from `../skills` |
| `pnpm qa` | Lint, types, tests |
| `pnpm build` | Production build |

## Layout

| Path | Owns |
| --- | --- |
| `scripts/content-lib.mjs` | Markdown rendering and the skill and writing source contracts; pure, tested by `lib/skill-source.test.ts` and `lib/writing-source.test.ts` |
| `scripts/build-content.mjs` | Reads `../skills` and `content/writing/` and writes the generated content |
| `content/writing/` | Library, essays and guides (Markdown) |
| `app/library`, `app/essays`, `app/guides` | Reading pages and section indexes; 404 when their source is absent |
| `components/writing/article.tsx`, `lib/writing-metadata.ts` | Article layout, contents list, index lists, and article metadata |
| `content/skills.mjs` | Presentation copy and display order |
| `components/home/sections.tsx` | Homepage sections |
| `components/logo.tsx`, `app/icon.svg`, `lib/og.tsx` | The keel mark; one set of paths shared by the header, favicon, Apple icon and OG image |
| `styles/globals.css` | Prism tokens and rendered-Markdown styles |

Visual direction is in [`../DESIGN.md`](../DESIGN.md).

## Deploy (Vercel)

Vercel project `keel` (scope `gaboesquivel`), connected to `gaboesquivel/keel`, **Root Directory** `site`, with "Include files outside the root directory in the Build Step" enabled because the content build reads `../skills`. Framework, install and build commands come from [`vercel.json`](vercel.json). No environment variables are required; `KEEL_ESSAYS=on` (Preview, branch `essays`) publishes the essays; `NEXT_PUBLIC_SITE_URL` optionally sets the canonical origin once a domain is chosen. Every push and pull request gets a preview deployment.
