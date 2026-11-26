import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AskKeel } from "@/components/library/ask";
import { Container } from "@/components/ui";
import { concepts } from "@/lib/library";

export const metadata: Metadata = { title: "Ask Keel", robots: { index: false, follow: false } };

/** Ask is private while it is an experiment; the page explains itself and links back to the public Library. */
export default function AskPage() {
  if (!concepts.length) notFound();
  return (
    <Container className="pb-24 pt-10 sm:pb-32">
      <nav aria-label="Breadcrumb" className="label-mono">
        <Link href="/library" className="hover:text-fg">
          Library
        </Link>{" "}
        <span aria-hidden="true">/</span> Ask Keel
      </nav>
      <Suspense>
        <AskKeel />
      </Suspense>
    </Container>
  );
}
