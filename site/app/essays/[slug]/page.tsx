import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article } from "@/components/writing/article";
import { essays, getWriting } from "@/lib/content";
import { writingMetadata } from "@/lib/writing-metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getWriting("essay", (await params).slug);
  return entry ? writingMetadata(entry) : {};
}

export default async function EssayPage({ params }: Props) {
  const entry = getWriting("essay", (await params).slug);
  if (!entry) notFound();
  return <Article entry={entry} />;
}
