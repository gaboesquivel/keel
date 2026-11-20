import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article } from "@/components/writing/article";
import { getWriting, guides } from "@/lib/content";
import { writingMetadata } from "@/lib/writing-metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getWriting("guide", (await params).slug);
  return entry ? writingMetadata(entry) : {};
}

export default async function GuidePage({ params }: Props) {
  const entry = getWriting("guide", (await params).slug);
  if (!entry) notFound();
  return <Article entry={entry} />;
}
