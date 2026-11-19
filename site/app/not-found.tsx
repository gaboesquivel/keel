import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink, Container, Eyebrow, Headline, Lede } from "@/components/ui";
import { skills } from "@/lib/content";

export const metadata: Metadata = { robots: { follow: true, index: false }, title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <Eyebrow>404 / Not found</Eyebrow>
      <Headline className="mt-5" lead="This page" accent="isn't here." />
      <Lede className="mt-6">The link may be old or mistyped. Every skill is listed below.</Lede>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <li key={s.name}>
            <Link href={`/skills/${s.name}`} className="card card-link block h-full p-5">
              <span className="font-mono font-semibold text-fg">/{s.name}</span>
              <span className="mt-1.5 block text-sm text-fg-muted">{s.tagline}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <ButtonLink href="/" variant="secondary" arrow={false}>
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
