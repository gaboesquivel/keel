import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ORDER, PRESENTATION } from "@/content/skills.mjs";
import { commandsFor, createRenderer, createSiteRoutes, parseSkill, validatePresentation } from "@/scripts/content-lib.mjs";

const siteRoot = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(siteRoot, "..");

const skill = (front: string, body = "# Title\n\nDo the thing.\n") => `---\n${front}\n---\n\n${body}`;

describe("parseSkill", () => {
  it("publishes name, description, argument hint, raw frontmatter and the full body", () => {
    const text = skill('name: shape\ndescription: Shape a product.\nargument-hint: "[idea]"\ndisable-model-invocation: true');
    const { skill: s, problems } = parseSkill({ folder: "shape", text });
    expect(problems).toEqual([]);
    expect(s).toMatchObject({ name: "shape", description: "Shape a product.", argumentHint: "[idea]" });
    expect(s?.frontmatter).toContain("disable-model-invocation: true");
    expect(s?.body).toContain("Do the thing.");
  });

  it.each([
    ["a missing file", null, "missing"],
    ["no frontmatter", "# Shape\n", "missing YAML front matter"],
    ["a name that differs from its folder", skill("name: experience\ndescription: x"), 'name "experience" does not match its folder "shape"'],
    ["no description", skill("name: shape"), 'no "description"'],
    ["a folded description", skill("name: shape\ndescription: >\n  folded"), "single line"],
    ["duplicate keys", skill("name: shape\nname: shape\ndescription: x"), "duplicate front matter keys: name"],
    ["no instructions", "---\nname: shape\ndescription: x\n---\n\n", "no instructions"],
  ])("fails clearly on %s", (_, text, reason) => {
    const { skill: s, problems } = parseSkill({ folder: "shape", text });
    expect(s).toBeNull();
    expect(problems.join("\n")).toContain("skills/shape/SKILL.md");
    expect(problems.join("\n")).toContain(reason);
  });
});

describe("validatePresentation", () => {
  const entry = {
    tagline: "x.",
    lede: "A lede.",
    benefits: ["a", "b", "c"],
    example: { situation: "When.", invocation: "/shape an idea" },
  };

  it("accepts copy that covers exactly the skills that exist", () => {
    expect(validatePresentation(["shape"], { shape: entry })).toEqual([]);
  });

  it("rejects missing, stale and malformed entries", () => {
    const problems = validatePresentation(["shape", "ux"], {
      shape: { ...entry, benefits: ["only one"] },
      experience: entry,
    }).join("\n");
    expect(problems).toContain('no entry for skill "ux"');
    expect(problems).toContain('entry "experience" has no skills/experience/SKILL.md');
    expect(problems).toContain('"shape" needs exactly three benefits');
  });

  it("requires the example to invoke the skill it describes", () => {
    const problems = validatePresentation(["peer"], { peer: { ...entry, example: { situation: "s", invocation: "/shape x" } } });
    expect(problems.join()).toContain('must start with "/peer"');
  });

  it("matches the real catalog", () => {
    const folders = ORDER.slice().sort();
    expect(validatePresentation(folders, PRESENTATION)).toEqual([]);
    expect(Object.keys(PRESENTATION)).not.toContain("experience");
  });
});

describe("rendering", () => {
  const { render } = createRenderer({
    repoUrl: "https://github.com/gaboesquivel/keel",
    branch: "main",
    siteRouteFor: createSiteRoutes(["perf", "shape"]),
  });

  it("links skill files to site routes and everything else to GitHub", () => {
    const { html } = render("[web](references/web.md) [shape](../shape/SKILL.md) [readme](../../README.md) [x](https://example.com)", "skills/perf/SKILL.md");
    expect(html).toContain('href="https://github.com/gaboesquivel/keel/blob/main/skills/perf/references/web.md"');
    expect(html).toContain('href="/skills/shape"');
    expect(html).toContain('href="https://github.com/gaboesquivel/keel/blob/main/README.md"');
    expect(html).toContain('href="https://example.com" rel="noopener"');
  });

  it("escapes raw HTML and drops unsafe link schemes", () => {
    const { html } = render('<script>alert(1)</script>\n\n[bad](javascript:alert(1))', "skills/perf/SKILL.md");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("javascript:");
  });

  it("drops the H1 and gives headings GitHub-style ids", () => {
    const { html, headings } = render("# Perf\n\n## Frame the question\n\ntext", "skills/perf/SKILL.md", { dropH1: true });
    expect(html).not.toContain("<h1");
    expect(headings).toEqual([{ id: "frame-the-question", text: "Frame the question", depth: 2 }]);
  });
});

describe("commandsFor", () => {
  it("builds the install command for gaboesquivel/keel and the slash invocation", () => {
    expect(commandsFor("gaboesquivel", "keel", { name: "ux", argumentHint: "[journey]" })).toEqual({
      install: "npx skills@latest add gaboesquivel/keel --skill ux -y",
      invocation: "/ux [journey]",
    });
    expect(commandsFor("gaboesquivel", "keel", { name: "peer", argumentHint: null }).invocation).toBe("/peer");
  });
});

describe("build-content", () => {
  // Runs the real generator against a copy of the repository's skills, so a source change is reflected without editing site content.
  const withCopy = (mutate: (skillsDir: string) => void) => {
    const dir = mkdtempSync(path.join(tmpdir(), "keel-site-"));
    cpSync(path.join(repoRoot, "skills"), path.join(dir, "skills"), { recursive: true });
    cpSync(path.join(siteRoot, "scripts"), path.join(dir, "site/scripts"), { recursive: true });
    cpSync(path.join(siteRoot, "content/skills.mjs"), path.join(dir, "site/content/skills.mjs"));
    symlinkSync(path.join(siteRoot, "node_modules"), path.join(dir, "site/node_modules"));
    mutate(path.join(dir, "skills"));
    const run = () => {
      try {
        execFileSync("node", ["site/scripts/build-content.mjs"], { cwd: dir, stdio: "pipe" });
        return { ok: true, out: JSON.parse(readFileSync(path.join(dir, "site/content/generated/content.json"), "utf8")), error: "" };
      } catch (error) {
        return { ok: false, out: null, error: String((error as { stderr?: Buffer }).stderr ?? error) };
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    };
    return run();
  };

  it("publishes every skill's complete SKILL.md body, and picks up edits on rebuild", () => {
    const marker = "Edited instruction for the rebuild test.";
    const { ok, out } = withCopy((skills) => {
      const file = path.join(skills, "retro/SKILL.md");
      writeFileSync(file, `${readFileSync(file, "utf8")}\n${marker}\n`);
    });
    expect(ok).toBe(true);
    expect(out.skills.map((s: { name: string }) => s.name)).toEqual(ORDER);
    const retro = out.skills.find((s: { name: string }) => s.name === "retro");
    expect(retro.html).toContain(marker);
    for (const s of out.skills) {
      const source = readFileSync(path.join(repoRoot, s.source), "utf8");
      const lastHeading = [...source.matchAll(/^## (.+)$/gmu)].at(-1)?.[1];
      expect(s.html, s.name).toContain(`>${lastHeading}</h2>`);
    }
  });

  it("fails the build, naming the file, when a skill is invalid or has no presentation copy", () => {
    const renamed = withCopy((skills) => {
      cpSync(path.join(skills, "ux"), path.join(skills, "experience"), { recursive: true });
      rmSync(path.join(skills, "ux"), { recursive: true });
    });
    expect(renamed.ok).toBe(false);
    expect(renamed.error).toContain('skills/experience/SKILL.md: name "ux" does not match its folder "experience"');
    expect(renamed.error).toContain('no entry for skill "experience"');
  });
});
