import { notFound } from "next/navigation";

import { Container, Eyebrow, Headline, Lede } from "@/components/ui";
import { WritingList } from "@/components/writing/article";
import { essays } from "@/lib/content";
import { indexMetadata } from "@/lib/writing-metadata";

const DESCRIPTION = "Longer writing on product and engineering judgment when agents do much of the building: what is worth pursuing, and how to stay on course.";

export const metadata = indexMetadata("/essays", "Essays", DESCRIPTION);

export default function EssaysPage() {
  if (!essays.length) notFound();
  return (
    <Container className="pb-24 pt-16 sm:pb-32 sm:pt-24">
      <Eyebrow>Essays</Eyebrow>
      <Headline lead="How to think" accent="about building." size="lg" className="mt-7" />
      <Lede className="mt-8">{DESCRIPTION}</Lede>
      <WritingList entries={essays} showDate />
    </Container>
  );
}
