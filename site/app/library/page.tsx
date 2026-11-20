import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article } from "@/components/writing/article";
import { library } from "@/lib/content";
import { writingMetadata } from "@/lib/writing-metadata";

// Rendered from content/writing/library.md. Without that file the route is a 404 and nothing links to it.
export const metadata: Metadata = library ? writingMetadata(library) : {};

export default function LibraryPage() {
  if (!library) notFound();
  return <Article entry={library} />;
}
