import Link from "next/link";

import { ArrowUpRight } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Skill } from "@/lib/content";

export type SkillCardData = Pick<Skill, "name" | "tagline" | "lede">;

/** Whole-card link to a skill: the heading link stretches over the card. */
export function SkillCard({ skill, headingLevel = "h3", className }: { skill: SkillCardData; headingLevel?: "h2" | "h3"; className?: string }) {
  const Heading = headingLevel;
  return (
    <article className={cn("card card-link group relative flex h-full flex-col p-6 sm:p-7", className)}>
      <div className="flex items-start justify-between gap-4">
        <Heading className="font-mono text-[1.45rem] font-semibold tracking-[-0.03em] text-fg">
          <Link href={`/skills/${skill.name}`} className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-lavender">
            <span className="text-periwinkle">/</span>
            {skill.name}
          </Link>
        </Heading>
        <ArrowUpRight className="mt-2 size-3.5 text-fg-subtle transition-colors group-hover:text-lavender" />
      </div>
      <p className="mt-3 font-medium text-fg">{skill.tagline}</p>
      <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-fg-muted">{skill.lede}</p>
    </article>
  );
}
