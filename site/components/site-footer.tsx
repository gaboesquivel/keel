import Link from "next/link";

import { Wordmark } from "@/components/logo";
import { ArrowUpRight, Container } from "@/components/ui";
import { learnNav, repo } from "@/lib/content";
import { CREATOR, SITE_TAGLINE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <Link href="/" aria-label="keel home" className="w-fit">
            <Wordmark size="sm" />
          </Link>
          <p className="text-sm text-fg-muted">{SITE_TAGLINE}</p>
        </div>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-muted">
          {learnNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-fg">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/skills" className="hover:text-fg">
              Skills
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-fg">
              About
            </Link>
          </li>
          <li>
            <a href={repo.url} rel="noopener" className="inline-flex items-center gap-1 hover:text-fg">
              GitHub <ArrowUpRight className="size-3" />
            </a>
          </li>
          <li className="text-fg-subtle">
            Created by{" "}
            <a href={CREATOR.url} rel="noopener" className="text-fg-muted hover:text-fg">
              {CREATOR.name}
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
