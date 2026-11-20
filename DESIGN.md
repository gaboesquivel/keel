# keel — Design

Accepted visual direction for the keel website (`site/`). Product intent is in [PRODUCT.md](PRODUCT.md).

## Identity

- **Name and wordmark:** lowercase **keel**, set in Geist Sans, semibold with tight tracking.
- **Tagline:** *Move fast. Stay on course.* **Descriptor:** *Independent agent skills for product and engineering judgment.*
- **Metaphor:** a keel keeps a sailboat from drifting sideways without preventing it from changing course. Agents provide speed, people set direction, and keel provides stability against product drift. The metaphor explains the product; it is not a theme.
- **Mark:** a hull in profile with a raked keel blade beneath it, one solid silhouette in the Prism gradient. The paths live once in `site/components/logo.tsx` (`KEEL_PATHS`) and are reused by the favicon (`site/app/icon.svg`), Apple icon and OG image. Update them together. It must stay legible at 16 px and in one colour.

## Visual system

Carried over from Flow's approved Prism design: dark surfaces, periwinkle, lavender and restrained pink, generous spacing, and the existing buttons and code blocks.

| Token | Hex | Role |
| --- | --- | --- |
| Canvas | `#0e0c15` | Background |
| Panel | `#1a1725` | Cards |
| Foreground | `#f5f3fb` | Primary text |
| Muted | `#b5afc6` | Secondary text |
| Periwinkle → Lavender → Pink | `#9ea6f8` → `#c6a8f6` → `#f0a6cf` | Brand gradient |

Typography: Geist Sans for text, Geist Mono for labels, commands and skill names (`/shape`). Only h1 accents carry the gradient; the install band is the one large gradient surface.

## Composition

The site should read like a well-made engineering instrument, not a SaaS landing page. It shares a design sensibility with [gaboesquivel.com](https://gaboesquivel.com) (confident type, deliberate whitespace, fine rules, restraint) while keeping its own Prism identity.

- **Typography leads.** Hierarchy comes from differences in scale, not from containers, icons or extra accent colours. Intro paragraphs sit near 18 px on desktop with a comfortable measure.
- **Few cards.** Lists of equals (skills, problems, benefits) are editorial entries separated by fine rules. Bordered containers are reserved for things you act on, such as commands.
- **Asymmetric, editorial layouts.** Headline on one side, introduction on the other; not every section uses the same structure.
- **Gradient with purpose.** h1 accents, the mark and the install band. Not a default fill for components.
- **The mark as the hero image.** The keel silhouette at scale on a single waterline, with no caption. No nautical scenes, labels or diagrams.
- **Context hierarchy is visible.** `PRODUCT.md` and `CLAUDE.md` are primary; `ARCHITECTURE.md` and `DESIGN.md` are shown as optional and quieter.
- **Reading pages are quiet.** Essays and guides use one h1, a measure near 70 characters, `.prose-reading` on top of `.prose-keel`, an on-page contents list for longer pieces (sticky beside the text on desktop, collapsed on phones), and a small arrow on external links. No illustrations, hero images or decoration.
- **The Library is explored, not scrolled.** It is a distinctive knowledge library organised by idea: concepts, categories, relationships and search are the ways in, and entries are never presented as a dated feed or article list. Its exact form is open, within this visual system.
- **Ask reads as a reference, not a chat.** A question yields one perspective with its references to Library entries visible, and makes clear where keel interprets and where the Library has no answer. No chat transcript, persona or typing theatrics. Where Ask is unavailable, the Library shows no broken or teasing entry point.
- **Motion is minimal.** Colour transitions on hover and copy feedback only; respect reduced motion.

## Rules

- Skills are independent. Never show them as stages, a sequence, a lifecycle or a workflow diagram.
- No decorative nautical UI or sailing vocabulary for features.
- No invented metrics, testimonials, usage counts or case studies. Field notes appear only with real content.
- Library entries attribute their authors and link their sources; they never reproduce the original work.
- Skill instructions are shown from `SKILL.md` as written, never paraphrased into a competing version.
- Check rendered pages at phone and desktop widths, with keyboard focus visible, before calling a visual change done.
