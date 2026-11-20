import Link from "next/link";

import { ArrowUpRight } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Skill } from "@/lib/content";

export type SkillEntryData = Pick<Skill, "name" | "headline" | "lede">;

/** A skill as an editorial entry under a fine rule. The heading link stretches over the entry. */
export function SkillEntry({ skill, headingLevel = "h3", className }: { skill: SkillEntryData; headingLevel?: "h2" | "h3"; className?: string }) {
  const Heading = headingLevel;
  return (
    <article className={cn("group relative rule-top pb-10 pt-7", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[0.95rem] font-medium text-fg-muted">
          <span className="text-periwinkle">/</span>
          {skill.name}
        </p>
        <ArrowUpRight className="size-3.5 text-fg-subtle transition-colors group-hover:text-lavender" />
      </div>
      <Heading className="mt-4 text-[1.55rem] font-semibold leading-tight tracking-[-0.035em] text-fg sm:text-[1.7rem]">
        <Link
          href={`/skills/${skill.name}`}
          className="transition-colors after:absolute after:inset-0 group-hover:text-lavender-soft focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-lavender"
        >
          {skill.headline}
        </Link>
      </Heading>
      <p className="mt-3 max-w-[34rem] leading-relaxed text-fg-muted">{skill.lede}</p>
    </article>
  );
}
