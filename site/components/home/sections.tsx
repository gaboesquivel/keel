import { CommandLine } from "@/components/command-line";
import { LogoMark } from "@/components/logo";
import { SkillCard } from "@/components/skills/skill-card";
import { ButtonLink, Container, Eyebrow, Lede, Section, TextLink } from "@/components/ui";
import { getSkill, INSTALL, repo, skills } from "@/lib/content";

const METAPHOR = [
  { kicker: "Speed", text: "AI coding agents make implementation increasingly fast." },
  { kicker: "Direction", text: "You decide what to build, for whom, and what success looks like." },
  { kicker: "Stability", text: "keel helps prevent scope creep and product drift without preventing deliberate changes of course." },
] as const;

export function HomeHero() {
  return (
    <Container className="grid items-center gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-24 lg:pt-28">
      <div>
        <Eyebrow>Agent skills for Claude Code</Eyebrow>
        <h1 className="headline mt-6 text-[clamp(2.8rem,7vw,5rem)] text-fg">
          Move fast.
          <br />
          <span className="text-prism">Stay on course.</span>
        </h1>
        <p className="mt-7 text-xl font-medium leading-snug text-fg sm:text-2xl">Independent agent skills for product and engineering judgment.</p>
        <div className="mt-6 max-w-[36rem] space-y-4 text-lg leading-relaxed text-fg-muted">
          <p>AI coding agents make building easier than ever. But more features don’t necessarily mean a better product.</p>
          <p>keel helps you stay focused on real user problems, preserve product intent across sessions, and resist scope creep as your agents build.</p>
          <p className="text-fg">No orchestration. No mandatory workflow. Just focused skills to help you stay on course.</p>
        </div>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/skills" arrow={false}>
            Explore skills
          </ButtonLink>
          <ButtonLink href={repo.url} variant="secondary">
            View on GitHub
          </ButtonLink>
        </div>
      </div>
      <figure className="card-prism relative overflow-hidden p-7 sm:p-9">
        <LogoMark className="size-14" />
        <figcaption className="mt-6 max-w-[24rem] text-[0.95rem] leading-relaxed text-fg-muted">
          A keel keeps a sailboat from drifting sideways without preventing it from changing course.
        </figcaption>
        <dl className="mt-8 border-t border-line">
          {METAPHOR.map((m) => (
            <div key={m.kicker} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-line py-4 last:border-b-0 last:pb-0">
              <dt className="label-mono pt-1 text-lavender/90">
                {m.kicker}
              </dt>
              <dd className="leading-relaxed text-fg">{m.text}</dd>
            </div>
          ))}
        </dl>
      </figure>
    </Container>
  );
}

export function SkillsSection() {
  return (
    <Section aria-labelledby="skills-heading" className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Six independent skills</Eyebrow>
            <h2 id="skills-heading" className="headline mt-5 text-[clamp(2.2rem,4.6vw,3.4rem)] text-fg">
              Stay focused on what matters.
            </h2>
          </div>
          <p className="max-w-[26rem] leading-relaxed text-fg-muted">
            Each skill has one responsibility. Invoke whichever you need, whenever you need it. There is no required order and no automatic chaining.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <li key={s.name}>
              <SkillCard skill={s} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

// Problems and principles from the repository's PRODUCT.md.
const PROBLEMS = [
  { title: "Product drift", text: "Agents can keep adding features without checking whether they serve the product’s goals, allowing scope to creep." },
  { title: "Lost intent", text: "Decisions about users, scope and direction vanish between sessions." },
  { title: "Premature implementation", text: "An idea goes straight to code, unexamined." },
  { title: "Repeated decisions", text: "New sessions reopen what was already settled." },
  { title: "Ceremony", text: "Frameworks add documents and stages that capable agents don’t need." },
] as const;

const PRINCIPLES = [
  "Intent over implementation",
  "Judgment over ceremony",
  "Evidence over assumptions",
  "Focus over accumulation",
  "Humans direct; agents execute",
  "Complement native agent capabilities",
  "Every instruction must earn its maintenance cost",
] as const;

export function WhySection() {
  return (
    <Section aria-labelledby="why-heading" className="border-t border-line">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <Eyebrow>Why keel exists</Eyebrow>
          <h2 id="why-heading" className="headline mt-5 text-[clamp(2.2rem,4.6vw,3.4rem)] text-fg">
            Building more isn’t the same as building better.
          </h2>
          <Lede className="mt-8 sm:text-lg">
            AI makes it easy to move from an idea to implementation. The harder part is staying focused on the problems worth solving, the people you’re solving them for, and the outcomes that matter.
          </Lede>
          <ul aria-label="Principles" className="mt-10 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed text-fg">
                <span aria-hidden="true" className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-violet" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label-mono">What goes wrong without it</p>
          <dl className="mt-4 border-t border-line">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-semibold text-fg">{p.title}</dt>
                <dd className="leading-relaxed text-fg-muted">{p.text}</dd>
              </div>
            ))}
          </dl>
          <TextLink href="/about" className="mt-6">
            Read the story behind keel
          </TextLink>
        </div>
      </Container>
    </Section>
  );
}

const DOCUMENTS = [
  { file: "PRODUCT.md", text: "Purpose, users, goals, success measures, scope and non-goals.", when: "Written by /shape once you adopt a direction." },
  { file: "ARCHITECTURE.md", text: "Durable technical direction and constraints the code can’t show.", when: "Created only when necessary." },
  { file: "DESIGN.md", text: "Accepted design and experience direction.", when: "Created when needed, kept accurate by /design or ordinary work." },
  { file: "CLAUDE.md", text: "Connects Claude Code to the project context and helps prevent unintended drift.", when: "/shape adds a short section when it records product intent." },
] as const;

export function CourseSection() {
  return (
    <Section aria-labelledby="course-heading" className="border-t border-line">
      <Container>
        <div className="max-w-[46rem]">
          <Eyebrow>Persistent product context</Eyebrow>
          <h2 id="course-heading" className="headline mt-5 text-[clamp(2.2rem,4.6vw,3.4rem)] text-fg">
            Keeping the project on course
          </h2>
          <Lede className="mt-8 sm:text-lg">
            <code className="font-mono text-[0.92em] text-fg">/shape</code> establishes and revisits product direction. Accepted decisions survive coding sessions through a few lightweight documents in your project, so the next session doesn’t have to reconstruct the intent or unknowingly drift from it.
          </Lede>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOCUMENTS.map((d) => (
            <li key={d.file} className="card flex flex-col p-6">
              <p className="font-mono text-[0.95rem] font-semibold text-lavender">{d.file}</p>
              <p className="mt-3 flex-1 leading-relaxed text-fg">{d.text}</p>
              <p className="mt-4 text-sm leading-relaxed text-fg-subtle">{d.when}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-6 text-fg-muted md:grid-cols-2 md:gap-12">
          <p className="leading-relaxed">
            None of these is a mandatory scaffold, and nothing needs constant synchronization. Decisions are recorded when adopted, not when merely proposed, and the code stays the source of truth for implementation details.
          </p>
          <p className="leading-relaxed">
            <code className="font-mono text-[0.92em] text-fg">/retro</code> looks back at what shipped and may recommend a deliberate change of direction. It doesn’t rewrite adopted decisions unless you ask.
          </p>
        </div>
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
    <Section aria-labelledby="install-heading">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 rounded-[20px] bg-[linear-gradient(110deg,#9ea6f8_0%,#c6a8f6_55%,#f0a6cf_100%)] p-5 sm:p-10 xl:grid-cols-[0.8fr_1.4fr]">
          <div className="px-1 sm:px-0">
            <p className="eyebrow text-ink/80">Install</p>
            <h2 id="install-heading" className="headline mt-5 text-[clamp(2.2rem,4.2vw,3.2rem)] text-ink">
              Install once.
              <br />
              Invoke when needed.
            </h2>
            <p className="mt-6 max-w-[26rem] leading-relaxed text-ink/80">
              Installed with the{" "}
              <a href="https://github.com/vercel-labs/skills" rel="noopener" className="font-semibold text-ink underline decoration-ink/40 underline-offset-[3px] hover:decoration-ink">
                skills CLI
              </a>
              . In Claude Code, each skill runs only when you invoke it with its slash command.
            </p>
          </div>
          <div className="min-w-0 rounded-xl border border-line-strong bg-canvas-deep shadow-[0_30px_60px_-30px_rgb(23_18_31/0.8)]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="size-2 rounded-full bg-fg-subtle" />
                <span className="size-2 rounded-full bg-fg-subtle" />
                <span className="size-2 rounded-full bg-fg-subtle" />
              </span>
              <span className="label-mono">terminal</span>
            </div>
            <div className="space-y-5 p-3 sm:p-5">
              {commands.map((c) => (
                <div key={c.label}>
                  <p className="label-mono mb-2 px-1">{c.label}</p>
                  <CommandLine command={c.command} label={`command: ${c.label}`} />
                </div>
              ))}
              <div>
                <p className="label-mono mb-2 px-1">Then, in Claude Code</p>
                <CommandLine command={getSkill("shape")?.invocation ?? "/shape"} prompt=">" label="Claude Code invocation" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
