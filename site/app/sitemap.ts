import type { MetadataRoute } from "next";

import { content, skills } from "@/lib/content";
import { siteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const lastModified = new Date(content.generatedAt);
  const paths = ["/", "/skills", "/about", ...skills.map((s) => `/skills/${s.name}`)];
  return paths.map((path) => ({
    changeFrequency: "weekly",
    lastModified,
    priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
    url: `${origin}${path}`,
  }));
}
