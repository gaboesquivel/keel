// Presentation copy for the website only: a benefit headline, a tagline, a short lede, three outcome-focused benefits, and an example.
// The skills' instructions live only in skills/<name>/SKILL.md, which the site renders in full at build time.
// Keep this copy faithful to those files. The content build fails when this list and skills/ disagree.

/** Display order on the site. Order is presentation only: the skills are independent and run in any order. */
export const ORDER = ['shape', 'slice', 'peer', 'design', 'ux', 'perf', 'retro']

export const PRESENTATION = {
  shape: {
    headline: 'Decide what deserves building.',
    tagline: 'Product direction and scope.',
    lede: 'Decide what deserves building, for whom and why. Choose one primary outcome, define what to leave out, and preserve accepted direction in PRODUCT.md.',
    benefits: [
      'Assumptions questioned before code is written, including real alternatives to building at all.',
      'One primary metric and a clear scope, with non-goals recorded so later sessions don’t reopen them.',
      'Adopted direction saved in PRODUCT.md and connected to Claude Code through CLAUDE.md.',
    ],
    example: {
      situation: 'You have a new idea, or a feature request that may not fit what the product is for.',
      invocation: '/shape should we add shared team workspaces?',
    },
  },
  slice: {
    headline: 'Deliver the next useful increment.',
    tagline: 'Product-aligned vertical slicing.',
    lede: 'Find the next smallest useful increment from where your product stands today. Prioritize user value, define what can wait, and reassess as you learn.',
    benefits: [
      'A meaningful next increment grounded in user or consumer value.',
      'Clear delivery boundaries and deliberate exclusions.',
      'Iterative recommendations informed by what’s already built and learned.',
    ],
    example: {
      situation: 'You’ve delivered the first version of a feature and want to decide what to build next.',
      invocation: '/slice the rental search experience',
    },
  },
  peer: {
    headline: 'Think beyond one agent.',
    tagline: 'Independent judgment and agent guidance.',
    lede: 'An independent product engineering peer that advises while a separate agent implements: discuss a decision, brief the implementing agent, or review its plan and results.',
    benefits: [
      'One recommendation with its tradeoff, and disagreement when it is warranted.',
      'Ready-to-paste prompts for Claude Code that carry what it cannot discover on its own.',
      'Reviews that check an agent’s claims against the diff and tests, ending in a clear verdict.',
    ],
    example: {
      situation: 'An agent reports a change as done and you want an independent check before accepting it.',
      invocation: '/peer review the agent’s results for the billing migration',
    },
  },
  design: {
    headline: 'Make the interface fit its purpose.',
    tagline: 'Visual and interface design.',
    lede: 'An interface design partner for new work, refinements, redesigns, critique and prototypes, grounded in what the surface is for and checked in the rendered result.',
    benefits: [
      'Interfaces that fit the product’s purpose and existing visual language, not generic layouts.',
      'Critique, prototype or implementation inferred from the request, with redesigns only when asked.',
      'Rendered results checked at real sizes and states before the work is called done.',
    ],
    example: {
      situation: 'A settings page works but feels cluttered, and you want it refined without a redesign.',
      invocation: '/design refine the settings page',
    },
  },
  ux: {
    headline: 'Walk the journey your users walk.',
    tagline: 'Real user journeys and friction.',
    lede: 'Walks a real user journey through the running product, as the intended user would, and reports the friction they meet, judged against what the product is for.',
    benefits: [
      'Findings from using the product, not reading its code, each labelled by how it was established.',
      'Coverage past the happy path: errors, recovery, keyboard and focus, accessibility and small screens.',
      'The smallest worthwhile improvement for each finding, highest user impact first.',
    ],
    example: {
      situation: 'Few people finish sign-up, and you want to see what a new user actually runs into.',
      invocation: '/ux a new user signing up on a phone',
    },
  },
  perf: {
    headline: 'Measure before you optimize.',
    tagline: 'Evidence-based performance investigation.',
    lede: 'Find what’s slowing down your app, API, or MCP tool. Measure the bottleneck and verify improvements with evidence.',
    benefits: [
      'Every finding labelled by its evidence: field, lab, diagnostic, static or hypothesis.',
      'Bottlenecks traced across web and mobile clients, APIs, MCP tools, databases and platforms.',
      'Code changed only when you ask, kept small, and measured again under comparable conditions.',
    ],
    example: {
      situation: 'The dashboard feels slow since the last release, and you want to know why before changing anything.',
      invocation: '/perf the dashboard’s first load',
    },
  },
  retro: {
    headline: 'Learn from what you shipped.',
    tagline: 'Product and engineering retrospective.',
    lede: 'Review what you built against its original intent, actual usage, and outcomes. Decide what to keep, change, or stop.',
    benefits: [
      'Original intent recovered and compared with what was built and how it is used.',
      'Delivered, used and outcome kept apart, so a missing metric reads as unknown, not failure.',
      'At most three ranked recommendations, with leaving it alone always a candidate.',
    ],
    example: {
      situation: 'A feature shipped a few months ago and you are deciding whether to invest in it further.',
      invocation: '/retro the saved searches feature',
    },
  },
}
