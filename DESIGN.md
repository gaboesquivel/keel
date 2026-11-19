# keel — Design

Accepted visual direction for the keel website (`site/`). Product intent is in [PRODUCT.md](PRODUCT.md).

## Identity

- **Name and wordmark:** lowercase **keel**, set in Geist Sans, semibold with tight tracking.
- **Tagline:** *Move fast. Stay on course.* **Descriptor:** *Independent agent skills for product and engineering judgment.*
- **Metaphor:** a keel keeps a sailboat from drifting sideways without preventing it from changing course. Agents provide speed, people set direction, and keel provides stability against product drift. The metaphor explains the product; it is not a theme.
- **Mark:** a hull in profile with a raked keel blade beneath it, one solid silhouette in the Prism gradient. The paths live once in `site/components/logo.tsx` (`KEEL_PATHS`) and are reused by the favicon (`site/app/icon.svg`), Apple icon and OG image. Update them together. It must stay legible at 16 px and in one colour.

## Visual system

Carried over from Flow's approved Prism design: dark surfaces, periwinkle, lavender and restrained pink, editorial hierarchy, generous spacing, and the existing cards, buttons and code blocks.

| Token | Hex | Role |
| --- | --- | --- |
| Canvas | `#0e0c15` | Background |
| Panel | `#1a1725` | Cards |
| Foreground | `#f5f3fb` | Primary text |
| Muted | `#b5afc6` | Secondary text |
| Periwinkle → Lavender → Pink | `#9ea6f8` → `#c6a8f6` → `#f0a6cf` | Brand gradient |

Typography: Geist Sans for text, Geist Mono for labels, commands and skill names (`/shape`). Only h1 accents carry the gradient; the install band is the one large gradient surface.

## Rules

- Skills are independent. Never show them as stages, a sequence, a lifecycle or a workflow diagram.
- No decorative nautical UI or sailing vocabulary for features.
- No invented metrics, testimonials, usage counts or case studies. Field notes appear only with real content.
- Skill instructions are shown from `SKILL.md` as written, never paraphrased into a competing version.
- Check rendered pages at phone and desktop widths, with keyboard focus visible, before calling a visual change done.
