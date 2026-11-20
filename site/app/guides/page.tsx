import { notFound } from "next/navigation";

import { Container, Eyebrow, Headline, Lede } from "@/components/ui";
import { WritingList } from "@/components/writing/article";
import { guides } from "@/lib/content";
import { indexMetadata } from "@/lib/writing-metadata";

const DESCRIPTION = "Practical guides for working with coding agents: how to direct them, review their work, and run sessions side by side without losing the thread.";

export const metadata = indexMetadata("/guides", "Guides", DESCRIPTION);

export default function GuidesPage() {
  if (!guides.length) notFound();
  return (
    <Container className="pb-24 pt-16 sm:pb-32 sm:pt-24">
      <Eyebrow>Guides</Eyebrow>
      <Headline lead="How to practice" accent="with agents." size="lg" className="mt-7" />
      <Lede className="mt-8">{DESCRIPTION}</Lede>
      <WritingList entries={guides} />
    </Container>
  );
}
