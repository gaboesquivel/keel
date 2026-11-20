import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article } from "@/components/writing/article";
import { principles } from "@/lib/content";
import { writingMetadata } from "@/lib/writing-metadata";

// Rendered from content/writing/principles.md. Without that file the route is a 404 and nothing links to it.
export const metadata: Metadata = principles ? writingMetadata(principles) : {};

export default function PrinciplesPage() {
  if (!principles) notFound();
  return <Article entry={principles} />;
}
