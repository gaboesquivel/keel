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
    <section aria-labelledby={id} className="grid gap-4 border-t border-line pt-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      <h2 id={id} className="text-xl font-bold leading-tight tracking-[-0.035em] text-fg sm:text-2xl">
        {title}
      </h2>
      <div className="max-w-[44rem] space-y-4 text-[1.0625rem] leading-[1.75] text-fg-muted [&_a]:text-lavender [&_a]:underline [&_a]:decoration-lavender/35 [&_a]:underline-offset-[3px] hover:[&_a]:decoration-lavender [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-fg [&_strong]:font-semibold [&_strong]:text-fg">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <Container className="pb-24 pt-16 sm:pt-24">
      <Eyebrow>About</Eyebrow>
      <Headline lead="Speed from agents." accent="Direction from you." className="mt-6" />
      <Lede className="mt-8">
        keel is a lean collection of independent skills that help developers keep product direction and exercise judgment while capable AI coding agents handle the implementation.
      </Lede>

      <div className="mt-16 space-y-12">
        <Block id="metaphor" title="The keel">
          <div className="flex items-start gap-5">
            <LogoMark className="mt-1 size-10 shrink-0" />
            <p>
              A keel keeps a sailboat from drifting sideways. It doesn’t stop the boat from moving, and it doesn’t stop it from changing course: it makes a deliberate course possible.
            </p>
          </div>
          <p>
            That is the whole metaphor. Coding agents provide the speed. You decide the direction. keel helps preserve the intent behind that direction, resisting scope creep and accidental drift while leaving room to change course deliberately.
          </p>
        </Block>

        <Block id="direction" title="Why direction matters more now">
          <p>
            Agents increasingly work out how to implement things, and they do it quickly. As building gets easier, it gets easier to accumulate features that don’t serve users or product goals. That makes the remaining questions more important, not less: what deserves building, why, for whom, whether it worked, and what should change.
          </p>
          <p>
            Without a place for those answers, the familiar problems compound at agent speed. Work drifts from the product’s goals, intent is lost between sessions, ideas go straight to code, and settled decisions get reopened.
          </p>
        </Block>

        <Block id="from-flow" title="From Flow Skills to keel">
          <p>
            keel began as <strong>Flow Skills</strong>: a broader practice with a methodology, a staged workflow, starters, hooks, agents and plans for an autonomous build factory.
          </p>
          <p>
            Capable agents such as Claude Code already plan, implement and verify well. A prescribed lifecycle on top of them added steps and documents without improving decisions, and every instruction carried a maintenance cost. So the methodology, the orchestration and the workflow were removed. What remained was the part agents don’t reliably supply on their own: focused judgment about product direction, experience, design, performance and outcomes.
          </p>
          <p>
            The result is six skills, each with a distinct responsibility, that can be changed, merged or removed on their own. This isn’t a claim that software factories are obsolete. Orchestration may still be valuable as a separate layer later; it just doesn’t belong in a set of judgment skills.
          </p>
        </Block>

        <Block id="claude-code" title="Built to complement Claude Code">
          <p>
            keel is designed primarily for <a href="https://code.claude.com/docs/en/skills" rel="noopener">Claude Code</a> and capable frontier models. It complements native capabilities instead of wrapping or replacing them, and leaves implementation to the coding agent.
          </p>
          <p>
            Skills are explicitly invoked with slash commands, such as <code>/shape [idea]</code> or <code>/peer</code>. They don’t run automatically, and there is no required order or automatic chaining between them.
          </p>
          <p>
            keel uses the portable <a href="https://agentskills.io" rel="noopener">Agent Skills</a> format, but equivalent behavior in other coding agents hasn’t been fully validated yet.
          </p>
        </Block>

        <Block id="philosophy" title="Engineering philosophy">
          <p>
            Deliberately remove what isn’t needed. Prefer the simplest thing that serves the goal. Keep decisions where the next session can find them. Measure before claiming, and say what is unknown.
          </p>
          <p>
            The skills follow <a href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices" rel="noopener">Anthropic’s skill authoring best practices</a> and are refined through real product use. They are deliberately lean: every instruction should change behavior beyond what a capable model already does.
          </p>
          <p>
            Google Labs’ <a href="https://github.com/google-labs-code/design.md" rel="noopener">DESIGN.md</a> work influenced how keel keeps durable, agent-readable design context. keel doesn’t claim conformance to its specification.
          </p>
        </Block>

        <Block id="creator" title="Who makes it">
          <p>
            Created by <a href={CREATOR.url} rel="noopener">{CREATOR.name}</a>. keel is open source under the MIT license; the skills, their history and this site live in one{" "}
            <a href={repo.url} rel="noopener">GitHub repository</a>. Longer technical essays are on <a href={`${CREATOR.url}/blog`} rel="noopener">gaboesquivel.com/blog</a>.
          </p>
        </Block>
      </div>

      <div className="mt-16 flex flex-wrap gap-3">
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
