import type { Metadata } from "next";

import { LogoMark } from "@/components/logo";
import { ButtonLink, Container, Eyebrow, Headline, Lede } from "@/components/ui";
import { repo } from "@/lib/content";
import { CREATOR } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Why keel exists: the keel metaphor, why product direction matters as coding agents accelerate, and how Flow Skills became six independent skills.",
  alternates: { canonical: "/about" },
};

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-5 rule-top pt-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:pt-12">
      <h2 id={id} className="text-xl font-semibold leading-tight tracking-[-0.03em] text-fg sm:text-[1.4rem]">
        {title}
      </h2>
      <div className="max-w-[40rem] space-y-5 text-[1.0625rem] leading-[1.75] text-fg-muted sm:text-lg [&_a]:text-lavender [&_a]:underline [&_a]:decoration-lavender/35 [&_a]:underline-offset-[3px] hover:[&_a]:decoration-lavender [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-fg [&_strong]:font-semibold [&_strong]:text-fg">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <Container className="pb-24 pt-16 sm:pb-32 sm:pt-24">
      <Eyebrow>About</Eyebrow>
      <Headline lead="Speed from agents." accent="Direction from you." className="mt-7" />
      <div className="mt-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <Lede className="lg:col-start-2">
          keel is a small collection of independent agent skills that help you keep product direction and exercise judgment while capable coding agents handle the implementation.
        </Lede>
      </div>

      <div className="mt-20 space-y-14 sm:mt-28 sm:space-y-16">
        <Block id="metaphor" title="The keel">
          <LogoMark className="size-12" />
          <p>
            A keel keeps a sailboat from drifting sideways. It doesn’t slow the boat down, and it doesn’t stop it from changing course. It makes a deliberate course possible.
          </p>
          <p>
            Coding agents provide the speed. You decide the direction. keel helps hold that direction against scope creep and accidental drift, while leaving room to change course on purpose.
          </p>
        </Block>

        <Block id="direction" title="Why direction matters more now">
          <p>
            Agents increasingly work out how to implement things, and they do it quickly. As building gets easier, it gets easier to accumulate features that serve neither users nor the product’s goals.
          </p>
          <p>
            The questions that remain matter more, not less: what deserves building, why, for whom, whether it worked, and what should change.
          </p>
        </Block>

        <Block id="from-flow" title="From Flow Skills to keel">
          <p>
            keel began as <strong>Flow Skills</strong>, a more ambitious approach to AI product engineering: a methodology, staged workflows, starters, agent hooks, and ideas for an autonomous software factory.
          </p>
          <p>
            As frontier models and Claude Code’s built-in capabilities improved, much of that orchestration stopped adding value at the skills layer. Capable agents already plan, implement and verify well, and every extra instruction carries a maintenance cost.
          </p>
          <p>
            So the answer was to simplify. The prescribed workflow went away, and what remained were independent capabilities for the part agents don’t reliably supply on their own: decisions, product direction, experience, design, performance and outcomes.
          </p>
          <p className="border-l-2 border-violet pl-5 text-2xl font-semibold leading-snug tracking-[-0.03em] text-fg sm:text-[1.75rem]">Complexity should justify itself.</p>
        </Block>

        <Block id="claude-code" title="Built to complement Claude Code">
          <p>
            keel is designed primarily for <a href="https://code.claude.com/docs/en/skills" rel="noopener">Claude Code</a> and capable frontier models. It complements native capabilities instead of wrapping or replacing them, and leaves implementation to the coding agent.
          </p>
          <p>
            Each skill runs only when you invoke it, for example <code>/shape [idea]</code> or <code>/peer</code>. There is no required order and no automatic chaining.
          </p>
          <p>
            The skills use the portable <a href="https://agentskills.io" rel="noopener">Agent Skills</a> format, but equivalent behavior in other coding agents hasn’t been fully validated yet.
          </p>
        </Block>

        <Block id="philosophy" title="Engineering philosophy">
          <p>
            Remove what isn’t needed. Prefer the simplest thing that serves the goal. Keep decisions where the next session can find them. Measure before claiming, and say what is unknown.
          </p>
          <p>
            The skills follow <a href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices" rel="noopener">Anthropic’s skill authoring best practices</a> and are refined through real product use. Every instruction should change behavior beyond what a capable model already does.
          </p>
          <p>
            Google Labs’ <a href="https://github.com/google-labs-code/design.md" rel="noopener">DESIGN.md</a> work influenced how keel keeps durable, agent-readable design context. keel doesn’t claim conformance to its specification.
          </p>
        </Block>

        <Block id="creator" title="Who makes it">
          <p>
            keel is created by <a href={CREATOR.url} rel="noopener">{CREATOR.name}</a> and open source under the MIT license. The skills, their history and this site live in one <a href={repo.url} rel="noopener">GitHub repository</a>.
          </p>
          <p>
            Longer writing on product engineering with agents is at <a href={`${CREATOR.url}/blog`} rel="noopener">gaboesquivel.com/blog</a>.
          </p>
        </Block>
      </div>

      <div className="mt-20 flex flex-wrap gap-3 rule-top pt-10">
        <ButtonLink href="/skills" arrow={false}>
          Explore skills
        </ButtonLink>
        <ButtonLink href={repo.url} variant="secondary">
          View on GitHub
        </ButtonLink>
      </div>
    </Container>
  );
}
