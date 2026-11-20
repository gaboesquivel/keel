import { CommandLine } from "@/components/command-line";
import { KeelFigure } from "@/components/logo";
import { SkillEntry } from "@/components/skills/skill-entry";
import { ButtonLink, Container, Eyebrow, Lede, Section, TextLink } from "@/components/ui";
import { getSkill, INSTALL, repo, skills } from "@/lib/content";

export function HomeHero() {
  return (
    <Container className="grid items-center gap-14 pb-20 pt-16 sm:pt-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-8 lg:pb-32 lg:pt-32">
      <div>
        <Eyebrow>Agent skills for Claude Code</Eyebrow>
        <h1 className="headline mt-7 text-[clamp(3rem,7vw,5.5rem)] text-fg">
          Move fast.
          <br />
          <span className="text-prism lg:whitespace-nowrap">Stay on course.</span>
        </h1>
        <p className="mt-8 max-w-[34rem] text-xl font-medium leading-snug tracking-[-0.015em] text-fg sm:text-2xl">Independent agent skills for product and engineering judgment.</p>
        <div className="mt-6 max-w-[34rem] space-y-4 text-[1.0625rem] leading-[1.7] text-fg-muted sm:text-lg">
          <p>AI coding agents make building easier than ever. But building more doesn’t necessarily mean building a better product.</p>
          <p>keel helps you challenge assumptions, preserve product intent, and stay focused on real users and outcomes as your agents build.</p>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href="/skills" arrow={false}>
            Explore skills
          </ButtonLink>
          <ButtonLink href={repo.url} variant="secondary">
            View on GitHub
          </ButtonLink>
        </div>
        <p className="label-mono mt-8 normal-case tracking-[0.02em]">Seven independent skills. No orchestration. No mandatory workflow.</p>
      </div>
      <div className="mx-auto w-full max-w-[30rem] lg:max-w-none">
        <KeelFigure className="w-full" />
      </div>
    </Container>
  );
}

export function SkillsSection() {
  return (
    <Section aria-labelledby="skills-heading" className="rule-top">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-10">
          <div>
            <Eyebrow>Seven independent skills</Eyebrow>
            <h2 id="skills-heading" className="headline h-section mt-6 text-fg">
              Stay focused on what matters.
            </h2>
          </div>
          <p className="max-w-[28rem] text-[1.0625rem] leading-[1.7] text-fg-muted sm:text-lg">
            Each skill has one responsibility and runs only when you invoke it. Use whichever you need, in any order.
          </p>
        </div>
        <ul className="mt-16 grid gap-x-16 sm:grid-cols-2">
          {skills.map((s) => (
            <li key={s.name}>
              <SkillEntry skill={s} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

// The three central tensions from PRODUCT.md. The full list of problems and principles stays there.
const TENSIONS = [
  { title: "Product drift", text: "Agents can keep adding features without checking whether they serve the product’s goals." },
  { title: "Lost intent", text: "Decisions disappear between coding sessions, forcing work to be reconsidered or unintentionally changed." },
  { title: "Premature implementation", text: "An idea becomes code before its value, alternatives and scope have been examined." },
] as const;

const PRINCIPLES = ["Intent over implementation.", "Evidence over assumptions.", "Judgment over ceremony."] as const;

export function WhySection() {
  return (
    <Section aria-labelledby="why-heading" className="rule-top">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Eyebrow>Why keel exists</Eyebrow>
          <h2 id="why-heading" className="headline h-section mt-6 max-w-[15ch] text-fg">
            Building more isn’t the same as building better.
          </h2>
          <Lede className="mt-8">
            AI makes it easy to move from an idea to implementation. The harder part is knowing which problems deserve solving, which decisions matter, and whether the result actually helps anyone.
          </Lede>
          <ul aria-label="Principles" className="mt-10 space-y-1.5 text-lg font-medium tracking-[-0.015em] text-fg">
            {PRINCIPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="lg:pt-[4.25rem]">
          <dl>
            {TENSIONS.map((t) => (
              <div key={t.title} className="rule-top py-7">
                <dt className="text-xl font-semibold tracking-[-0.025em] text-fg">{t.title}</dt>
                <dd className="mt-2 max-w-[32rem] leading-relaxed text-fg-muted">{t.text}</dd>
              </div>
            ))}
          </dl>
          <TextLink href="/about" className="rule-top w-full pt-7">
            Read the story behind keel
          </TextLink>
        </div>
      </Container>
    </Section>
  );
}

const PRIMARY_DOCS = [
  {
    file: "PRODUCT.md",
    title: "What we’re building, for whom, and why.",
    text: "Created or updated through /shape when you accept a direction. Holds purpose, users, goals, success measures, scope and non-goals.",
  },
  {
    file: "CLAUDE.md",
    title: "How Claude Code stays aligned.",
    text: "Connects coding sessions to the project’s context and tells them to raise proposed changes that conflict with accepted direction.",
  },
] as const;

const SUPPORTING_DOCS = [
  { file: "ARCHITECTURE.md", text: "Durable technical direction and constraints, when needed." },
  { file: "DESIGN.md", text: "Accepted design and experience direction, when needed." },
] as const;

export function CourseSection() {
  return (
    <Section aria-labelledby="course-heading" className="rule-top">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
          <div>
            <Eyebrow>Persistent product context</Eyebrow>
            <h2 id="course-heading" className="headline h-section mt-6 max-w-[14ch] text-fg">
              Keeping the project on course
            </h2>
          </div>
          <div className="space-y-4 text-[1.0625rem] leading-[1.7] text-fg-muted sm:text-lg lg:pt-12">
            <p>Your agent can read the code. It can’t reliably infer why the product exists, what matters most, or which decisions you’ve already made.</p>
            <p>keel preserves that context in a few small documents, so each coding session builds on accepted direction instead of reinventing it.</p>
          </div>
        </div>

        <ul className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {PRIMARY_DOCS.map((d) => (
            <li key={d.file} className="border-t border-line-strong pt-8">
              <p className="font-mono text-lg font-semibold text-lavender">{d.file}</p>
              <p className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.03em] text-fg">{d.title}</p>
              <p className="mt-3 max-w-[30rem] leading-relaxed text-fg-muted">{d.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-x-16 gap-y-4 rule-top pt-6 md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]">
          <p className="label-mono pt-0.5">Optional</p>
          {SUPPORTING_DOCS.map((d) => (
            <p key={d.file} className="text-[0.95rem] leading-relaxed text-fg-muted">
              <span className="font-mono text-fg">{d.file}</span> — {d.text}
            </p>
          ))}
        </div>

        <p className="mt-14 max-w-[40rem] text-[1.0625rem] leading-[1.7] text-fg">
          These aren’t documents you must create upfront. Decisions are recorded when adopted, and implementation details remain in the code.
          <span className="text-fg-muted">
            {" "}
            <code className="font-mono text-[0.92em] text-fg">/retro</code> may recommend a change of direction; it’s recorded only when you ask.
          </span>
        </p>
      </Container>
    </Section>
  );
}

export function InstallSection() {
  const commands = [
    { label: "All skills, globally", command: INSTALL.all },
    { label: "One skill, in your project", command: INSTALL.one },
    { label: "List available skills", command: INSTALL.list },
  ];
  return (
    <Section aria-labelledby="install-heading" className="pt-4 sm:pt-8 lg:pt-8">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 rounded-[20px] bg-[linear-gradient(110deg,#9ea6f8_0%,#c6a8f6_55%,#f0a6cf_100%)] p-5 sm:p-12 lg:gap-14 xl:grid-cols-[0.8fr_1.4fr]">
          <div className="px-1 pt-3 sm:px-0 sm:pt-0">
            <p className="eyebrow text-ink/75">Install</p>
            <h2 id="install-heading" className="headline mt-6 text-[clamp(2.25rem,4.2vw,3.25rem)] text-ink">
              Install once.
              <br />
              Invoke when needed.
            </h2>
            <p className="mt-6 max-w-[24rem] leading-relaxed text-ink/80">
              Installed with the{" "}
              <a href="https://github.com/vercel-labs/skills" rel="noopener" className="font-semibold text-ink underline decoration-ink/40 underline-offset-[3px] hover:decoration-ink focus-visible:outline-ink">
                skills CLI
              </a>
              . In Claude Code, each skill runs only when you invoke it with its slash command.
            </p>
          </div>
          <div className="min-w-0 rounded-2xl bg-canvas-deep p-2 shadow-[0_30px_60px_-30px_rgb(23_18_31/0.8)] sm:p-3">
            <div className="divide-y divide-line">
              {commands.map((c) => (
                <div key={c.label} className="px-3 py-4 sm:px-4">
                  <p className="label-mono mb-2.5">{c.label}</p>
                  <CommandLine command={c.command} label={`command: ${c.label}`} variant="plain" />
                </div>
              ))}
              <div className="px-3 py-4 sm:px-4">
                <p className="label-mono mb-2.5">Then, in Claude Code</p>
                <CommandLine command={getSkill("shape")?.invocation ?? "/shape"} prompt=">" label="Claude Code invocation" variant="plain" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
