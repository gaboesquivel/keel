import type { Metadata } from "next";

import { CommandLine } from "@/components/command-line";
import { SkillCard } from "@/components/skills/skill-card";
import { Container, Eyebrow, Headline, Lede } from "@/components/ui";
import { INSTALL, skills } from "@/lib/content";

const description = "Six independent skills, each with one responsibility. Invoke any of them in Claude Code, in any order, whenever you need it.";

export const metadata: Metadata = {
  title: "Skills",
  description: `keel's agent skills for product and engineering judgment. ${description}`,
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <Container className="pb-24 pt-16 sm:pt-24">
      <Eyebrow>Skills</Eyebrow>
      <Headline lead="Independent skills." accent="One job each." className="mt-6" />
      <Lede className="mt-8">{description}</Lede>
      <div className="mt-10 max-w-3xl">
        <p className="label-mono mb-2">Install all, globally</p>
        <CommandLine command={INSTALL.all} />
      </div>
      <section aria-label="Skill catalog" className="mt-16 sm:mt-20">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <li key={s.name}>
              <SkillCard skill={s} headingLevel="h2" />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-fg-subtle">The order above is for reading only. No skill depends on another, and none runs automatically.</p>
      </section>
    </Container>
  );
}
