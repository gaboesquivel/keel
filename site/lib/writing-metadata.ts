import type { Metadata } from "next";

import type { Writing } from "@/lib/content";
import { CREATOR, SITE_DESCRIPTOR, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// A page that sets `openGraph` replaces the inherited one, image included, so the site image from app/opengraph-image is named explicitly.
const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE} ${SITE_DESCRIPTOR}` }];

/** Page metadata for one piece of writing. Essays and guides are articles with a publish date; the OG image comes from app/opengraph-image. */
export const writingMetadata = (entry: Writing): Metadata => {
  const isArticle = entry.kind !== "library";
  return {
    title: entry.title,
    description: entry.description,
    authors: [{ name: CREATOR.name, url: CREATOR.url }],
    alternates: { canonical: entry.route },
    openGraph: isArticle
      ? { type: "article", siteName: SITE_NAME, title: entry.title, description: entry.description, url: entry.route, publishedTime: entry.date, authors: [CREATOR.url], images }
      : { type: "website", siteName: SITE_NAME, title: entry.title, description: entry.description, url: entry.route, images },
    twitter: { card: "summary_large_image", title: entry.title, description: entry.description, images },
  };
};

/** Metadata for a section index such as /essays or /guides. */
export const indexMetadata = (route: string, title: string, description: string): Metadata => ({
  title,
  description,
  alternates: { canonical: route },
  openGraph: { type: "website", siteName: SITE_NAME, title, description, url: route, images },
  twitter: { card: "summary_large_image", title, description, images },
});
