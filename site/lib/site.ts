export const SITE_NAME = "keel";
export const SITE_TAGLINE = "Move fast. Stay on course.";
export const SITE_DESCRIPTOR = "Independent agent skills for product and engineering judgment.";
export const SITE_DESCRIPTION =
  "keel is a small collection of independent agent skills for Claude Code that help you challenge assumptions, stay aligned with product goals, improve the experience, and learn from what you build.";
export const CREATOR = { name: "Gabo Esquivel", url: "https://gaboesquivel.com" } as const;

export const NAV = [
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About" },
] as const;

/** Canonical origin for metadata: explicit env, then Vercel's production or deployment URL, then localhost. */
export const siteOrigin = () => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/u, "");
  const vercel = process.env.VERCEL_ENV === "production" ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//u, "").replace(/\/$/u, "")}`;
  return "http://localhost:3000";
};
