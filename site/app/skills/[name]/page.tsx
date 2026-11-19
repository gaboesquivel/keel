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
    <h2 id={id} className="scroll-mt-24 text-[clamp(1.5rem,2.6vw,1.9rem)] font-semibold leading-tight tracking-[-0.04em] text-fg">
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
    <Container className="pb-24 pt-10 sm:pb-32">
      <Breadcrumbs items={[{ href: "/skills", label: "Skills" }, { label: `/${skill.name}` }]} />

      <header className="mt-14 max-w-4xl sm:mt-20">
        <Eyebrow>{skill.tagline.replace(/\.$/u, "")}</Eyebrow>
        <h1 className="headline mt-6 font-mono text-[clamp(2.75rem,8vw,5rem)] tracking-[-0.06em]">
          <span className="text-fg">/</span>
          <span className="text-prism">{skill.name}</span>
        </h1>
        <p className="mt-8 text-2xl font-semibold leading-snug tracking-[-0.03em] text-fg sm:text-[1.75rem]">{skill.headline}</p>
        <Lede className="mt-4">{skill.lede}</Lede>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="#install" arrow={false}>
            Install
          </ButtonLink>
          <ButtonLink href={sourceUrl(skill.source)} variant="secondary">
            View source on GitHub
          </ButtonLink>
        </div>
      </header>

      <div className="mt-20 grid gap-14 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-20">
        <div className="min-w-0 space-y-20">
          <section aria-labelledby="benefits">
            <SectionHeading id="benefits">What it gives you</SectionHeading>
            <ul className="mt-8 grid gap-x-10 md:grid-cols-3">
              {skill.benefits.map((b) => (
                <li key={b} className="border-t border-line-strong pb-6 pt-5 leading-relaxed text-fg md:pb-0">
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="when-to-use-it">
            <SectionHeading id="when-to-use-it">When to use it</SectionHeading>
            <p className="mt-4 max-w-[40rem] text-[1.0625rem] leading-[1.7] text-fg-muted">{skill.example.situation}</p>
            <CommandLine command={skill.example.invocation} prompt=">" label="example invocation" className="mt-6 max-w-3xl" />
          </section>

          <section aria-labelledby="install">
            <SectionHeading id="install">Install and invoke</SectionHeading>
            <div className="mt-6 max-w-3xl space-y-5">
              <div>
                <p className="label-mono mb-2.5">Install in your project</p>
                <CommandLine command={skill.install} label="install command" />
              </div>
              <div>
                <p className="label-mono mb-2.5">Invoke in Claude Code</p>
                <CommandLine command={skill.invocation} prompt=">" label="slash command" />
              </div>
            </div>
            <p className="mt-5 max-w-[40rem] text-[0.95rem] leading-relaxed text-fg-muted">
              Add <code className="font-mono text-fg">-g</code> to install globally. The skill runs only when you invoke it with <code className="font-mono text-fg">/{skill.name}</code>; Claude Code doesn’t trigger it on its own.
            </p>
          </section>

          <section aria-labelledby="the-skill" className="border-t border-line-strong pt-14">
            <Eyebrow>Source</Eyebrow>
            <h2 id="the-skill" className="headline mt-5 scroll-mt-24 text-[clamp(2rem,3.6vw,2.75rem)] text-fg">
              Read the skill
            </h2>
            <p className="mt-4 max-w-[40rem] text-[1.0625rem] leading-[1.7] text-fg-muted">The complete instructions Claude Code receives, rendered in full from the file in the repository.</p>
            <article aria-label={skill.source} className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
                <span className="font-mono text-[0.8rem] text-fg-muted">{skill.source}</span>
                <a href={sourceUrl(skill.source)} rel="noopener" className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-lavender hover:text-lavender-soft">
                  View on GitHub <ArrowUpRight className="size-3" />
                </a>
              </div>
              <details className="group/fm border-b border-line">
                <summary className="flex cursor-pointer list-none items-center gap-2 py-3 font-mono text-[0.8rem] text-fg-subtle hover:text-fg-muted [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="inline-block transition-transform group-open/fm:rotate-90">
                    ›
                  </span>
                  Frontmatter (YAML)
                </summary>
                <div className="prose-keel pb-5">
                  <div className="code-block">
                    <span className="code-lang">yaml</span>
                    <pre className="whitespace-pre-wrap">
                      <code className="language-yaml">{skill.frontmatter}</code>
                    </pre>
                  </div>
                </div>
              </details>
              <Prose html={skill.html} className="mt-10" />
            </article>
          </section>

          <section aria-labelledby="other-skills" className="border-t border-line pt-10">
            <h2 id="other-skills" className="label-mono">
              Other skills, independent of this one
            </h2>
            <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
              {others.map((s) => (
                <li key={s.name}>
                  <Link href={`/skills/${s.name}`} className="group flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-line py-3.5">
                    <span className="font-mono font-semibold text-fg transition-colors group-hover:text-lavender-soft">/{s.name}</span>
                    <span className="text-sm text-fg-muted">{s.headline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside aria-labelledby="at-a-glance" className="lg:col-start-2 lg:row-start-1">
          <div className="border-t border-line-strong pt-5 lg:sticky lg:top-24 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1">
            <h2 id="at-a-glance" className="label-mono text-fg-muted">
              At a glance
            </h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="label-mono">Invocation</dt>
                <dd className="mt-1.5 break-words font-mono text-fg">{skill.invocation}</dd>
              </div>
              <div>
                <dt className="label-mono">Runs</dt>
                <dd className="mt-1.5 text-fg">Only when you invoke it</dd>
              </div>
              <div>
                <dt className="label-mono">Files</dt>
                <dd className="mt-2">
                  <ul className="space-y-1.5 font-mono text-xs">
                    {skill.files.map((file) => (
                      <li key={file} className="break-all">
                        <a href={sourceUrl(`${sourceDir}/${file}`)} rel="noopener" className="text-fg-muted hover:text-lavender">
                          {file}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <ul className="mt-7 space-y-3 border-t border-line pt-5 text-sm">
              <li>
                <a href="#the-skill" className="text-fg-muted hover:text-fg">
                  Read the skill
                </a>
              </li>
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
