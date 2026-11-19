import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CommandLine } from "@/components/command-line";
import { Prose } from "@/components/prose";
import { ArrowUpRight, Breadcrumbs, ButtonLink, Container, Eyebrow, Lede } from "@/components/ui";
import { getSkill, skills, sourceUrl } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return skills.map((s) => ({ name: s.name }));
}

type Props = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const skill = getSkill(name);
  if (!skill) return {};
  return {
    title: `/${skill.name}: ${skill.tagline.replace(/\.$/u, "")}`,
    description: skill.lede,
    alternates: { canonical: `/skills/${skill.name}` },
  };
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-[clamp(1.6rem,3vw,2.1rem)] font-bold leading-tight tracking-[-0.045em] text-fg">
      {children}
    </h2>
  );
}

export default async function SkillPage({ params }: Props) {
  const { name } = await params;
  const skill = getSkill(name);
  if (!skill) notFound();

  const sourceDir = skill.source.replace(/\/SKILL\.md$/u, "");
  const others = skills.filter((s) => s.name !== skill.name);

  return (
    <Container className="pb-24 pt-10">
      <Breadcrumbs items={[{ href: "/skills", label: "Skills" }, { label: `/${skill.name}` }]} />

      <header className="mt-12 max-w-4xl">
        <Eyebrow>{skill.tagline.replace(/\.$/u, "")}</Eyebrow>
        <h1 className="headline mt-6 font-mono text-[clamp(2.75rem,8vw,5rem)] tracking-[-0.06em]">
          <span className="text-fg">/</span>
          <span className="text-prism">{skill.name}</span>
        </h1>
        <Lede className="mt-8">{skill.lede}</Lede>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={sourceUrl(skill.source)}>View source on GitHub</ButtonLink>
          <ButtonLink href="#install" variant="secondary" arrow={false}>
            Install
          </ButtonLink>
        </div>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div className="min-w-0 space-y-16">
          <section aria-labelledby="benefits">
            <SectionHeading id="benefits">What it gives you</SectionHeading>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {skill.benefits.map((b, i) => (
                <li key={b} className="card p-5">
                  <span className="label-mono text-lavender/80">0{i + 1}</span>
                  <p className="mt-3 leading-relaxed text-fg">{b}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="when-to-use-it">
            <SectionHeading id="when-to-use-it">When to use it</SectionHeading>
            <p className="mt-4 max-w-[46rem] text-[1.0625rem] leading-relaxed text-fg-muted">{skill.example.situation}</p>
            <CommandLine command={skill.example.invocation} prompt=">" label="example invocation" className="mt-5 max-w-3xl" />
          </section>

          <section aria-labelledby="install">
            <SectionHeading id="install">Install and invoke</SectionHeading>
            <div className="mt-6 max-w-3xl space-y-5">
              <div>
                <p className="label-mono mb-2">Install in your project</p>
                <CommandLine command={skill.install} label="install command" />
              </div>
              <div>
                <p className="label-mono mb-2">Invoke in Claude Code</p>
                <CommandLine command={skill.invocation} prompt=">" label="slash command" />
              </div>
            </div>
            <p className="mt-5 max-w-[46rem] text-sm leading-relaxed text-fg-muted">
              Add <code className="font-mono text-fg">-g</code> to install globally. The skill runs only when you invoke it with <code className="font-mono text-fg">/{skill.name}</code>; Claude Code doesn’t trigger it on its own.
            </p>
          </section>

          <section aria-labelledby="the-skill">
            <SectionHeading id="the-skill">The skill</SectionHeading>
            <p className="mt-3 max-w-[46rem] text-fg-muted">
              The complete instructions Claude Code follows, rendered from{" "}
              <a href={sourceUrl(skill.source)} rel="noopener" className="font-mono text-[0.9em] text-lavender underline decoration-lavender/35 underline-offset-[3px] hover:decoration-lavender">
                {skill.source}
              </a>
              .
            </p>
            <article aria-label={`${skill.source}`} className="card mt-6 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-raised/60 px-5 py-3 sm:px-8">
                <span className="font-mono text-xs text-fg-muted">{skill.source}</span>
                <a href={sourceUrl(skill.source)} rel="noopener" className="inline-flex items-center gap-1 text-xs font-semibold text-lavender hover:text-lavender-soft">
                  View on GitHub <ArrowUpRight className="size-3" />
                </a>
              </div>
              <div className="p-5 sm:p-8">
                <div className="prose-keel">
                  <div className="code-block">
                    <span className="code-lang">frontmatter</span>
                    <pre className="whitespace-pre-wrap">
                      <code className="language-yaml">{skill.frontmatter}</code>
                    </pre>
                  </div>
                </div>
                <Prose html={skill.html} className="mt-6" />
              </div>
            </article>
          </section>

          <section aria-labelledby="other-skills" className="border-t border-line pt-10">
            <SectionHeading id="other-skills">Other skills</SectionHeading>
            <p className="mt-3 text-fg-muted">Independent of this one. Use any of them, in any order.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {others.map((s) => (
                <li key={s.name}>
                  <Link href={`/skills/${s.name}`} className="card card-link flex h-full flex-col gap-1 p-4">
                    <span className="font-mono font-semibold text-fg">/{s.name}</span>
                    <span className="text-sm text-fg-muted">{s.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside aria-labelledby="at-a-glance" className="lg:col-start-2 lg:row-start-1">
          <div className="card p-6 lg:sticky lg:top-24">
            <h2 id="at-a-glance" className="text-sm font-bold uppercase tracking-wide text-fg">
              At a glance
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="label-mono">Invocation</dt>
                <dd className="mt-1 break-words font-mono text-fg">{skill.invocation}</dd>
              </div>
              <div>
                <dt className="label-mono">Runs</dt>
                <dd className="mt-1 text-fg">Only when you invoke it</dd>
              </div>
              <div>
                <dt className="label-mono">Files</dt>
                <dd className="mt-1.5">
                  <ul className="space-y-1 font-mono text-xs">
                    {skill.files.map((file) => (
                      <li key={file} className="break-all">
                        <a href={sourceUrl(`${sourceDir}/${file}`)} rel="noopener" className="text-fg-muted hover:text-lavender">
                          {sourceDir}/{file}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <ul className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <li>
                <a href={sourceUrl(sourceDir, "tree")} rel="noopener" className="inline-flex items-center gap-1.5 font-semibold text-lavender hover:text-lavender-soft">
                  View source on GitHub <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li>
                <Link href="/skills" className="inline-flex items-center gap-1.5 text-fg-muted hover:text-fg">
                  <ArrowLeft aria-hidden="true" className="size-3.5" /> All skills
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Container>
  );
}
