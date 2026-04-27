import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

describe("Vercel build: serverless-ssr + prerender", () => {
  it("includes prerender after client and SSR bundle builds", () => {
    const pkgPath = path.join(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = pkg.scripts["build:serverless-ssr"];
    expect(script).toBeDefined();
    expect(script).toContain("DISABLE_PWA=1 vite build");
    expect(script).toContain("vite build --ssr src/entry-server.tsx");
    expect(script).toContain("node scripts/prerender.mjs");
    expect(script.indexOf("prerender.mjs")).toBeGreaterThan(
      script.indexOf("entry-server.tsx"),
    );
  });

  it.skipIf(!existsSync(path.join(process.cwd(), "dist", "index.html")))(
    "when dist exists, homepage HTML has no ssr-outlet (prerender ran)",
    () => {
      const indexPath = path.join(process.cwd(), "dist", "index.html");
      const html = readFileSync(indexPath, "utf8");
      expect(html).not.toContain("<!--ssr-outlet-->");
      expect(html).toMatch(/<div id="root">/);
      // Prerendered shell should be more than empty root + skip link
      expect(html.length).toBeGreaterThan(4000);
    },
  );
});
