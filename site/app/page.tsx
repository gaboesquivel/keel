import type { Metadata } from "next";

import { CourseSection, HomeHero, InstallSection, SkillsSection, WhySection } from "@/components/home/sections";
import { repo } from "@/lib/content";
import { CREATOR, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteOrigin } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const structuredData = () => {
  const origin = siteOrigin();
  const author = { "@type": "Person", name: CREATOR.name, url: CREATOR.url };
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${origin}/#website`, name: SITE_NAME, url: origin, description: SITE_DESCRIPTION, publisher: author },
      {
        "@type": "SoftwareSourceCode",
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        codeRepository: repo.url,
        license: "https://opensource.org/licenses/MIT",
        programmingLanguage: "Markdown",
        author,
      },
    ],
  };
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint: JSON-LD built from static data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replaceAll("<", "\\u003c") }}
      />
      <HomeHero />
      <SkillsSection />
      <WhySection />
      <CourseSection />
      <InstallSection />
    </>
  );
}
