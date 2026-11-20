import type { Metadata } from "next";
import Link from "next/link";

import { CommandLine } from "@/components/command-line";
import { ArrowUpRight, Container, Eyebrow, Headline, Lede } from "@/components/ui";
import { INSTALL, skills } from "@/lib/content";

const description = "Six independent skills, each with one responsibility. Invoke any of them in Claude Code, in any order, whenever you need it.";

export const metadata: Metadata = {
  title: "Skills",
  description: `keel's agent skills for product and engineering judgment. ${description}`,
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <Container className="pb-24 pt-16 sm:pb-32 sm:pt-24">
      <Eyebrow>Skills</Eyebrow>
      <Headline lead="Independent skills." accent="One job each." className="mt-7" />
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <Lede>{description}</Lede>
        <div>
          <p className="label-mono mb-2.5">Install all, globally</p>
          <CommandLine command={INSTALL.all} />
        </div>
      </div>

      <section aria-label="Skill catalog" className="mt-20 sm:mt-24">
        <ul className="border-b border-line">
          {skills.map((s) => (
            <li key={s.name} className="group relative rule-top">
              <div className="grid gap-2 py-7 sm:grid-cols-[11rem_minmax(0,1fr)_1.5rem] sm:gap-8 sm:py-8 lg:grid-cols-[14rem_minmax(0,1fr)_minmax(0,1fr)_1.5rem]">
                <h2 className="font-mono text-[1.6rem] font-semibold tracking-[-0.04em] text-fg sm:text-[1.75rem]">
                  <Link
                    href={`/skills/${s.name}`}
                    className="transition-colors after:absolute after:inset-0 group-hover:text-lavender-soft focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-lavender"
                  >
                    <span className="text-periwinkle">/</span>
                    {s.name}
                  </Link>
                </h2>
                <p className="text-lg font-medium leading-snug tracking-[-0.015em] text-fg sm:pt-1.5">{s.headline}</p>
                <p className="leading-relaxed text-fg-muted sm:col-start-2 lg:col-start-3 lg:pt-1">{s.lede}</p>
                <ArrowUpRight className="hidden size-4 text-fg-subtle transition-colors group-hover:text-lavender sm:col-start-3 sm:row-start-1 sm:mt-2.5 sm:block lg:col-start-4" />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-fg-subtle">The order above is for reading only. No skill depends on another, and none runs automatically.</p>
      </section>
    </Container>
  );
}
