import Link from "next/link";

import { Wordmark } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { ArrowUpRight, Container } from "@/components/ui";
import { repo } from "@/lib/content";
import { NAV } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-[4.25rem] items-center justify-between gap-4">
        <Link href="/" aria-label="keel home" className="shrink-0">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-fg-muted">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={repo.url} rel="noopener" className="inline-flex items-center gap-1 transition-colors hover:text-fg">
                GitHub <ArrowUpRight className="size-3" />
              </a>
            </li>
          </ul>
        </nav>
        <MobileMenu />
      </Container>
    </header>
  );
}
