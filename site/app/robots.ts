import type { MetadataRoute } from "next";

import { siteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return { host: origin, rules: [{ allow: "/", userAgent: "*" }], sitemap: [`${origin}/sitemap.xml`] };
}
