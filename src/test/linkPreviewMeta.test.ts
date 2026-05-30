import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("link preview metadata", () => {
  it("uses absolute HubVillage logo URLs for Open Graph and Twitter", () => {
    const source = readFileSync(path.join(process.cwd(), "index.html"), "utf8");
    const logoUrl = "https://hubvillage.app/lovable-uploads/cormorant.png";

    expect(source).toContain(`<meta property="og:image" content="${logoUrl}" />`);
    expect(source).toContain(`<meta name="twitter:image" content="${logoUrl}" />`);
    expect(source).toContain(`<meta property="og:image:alt" content="HubVillage logo" />`);
    expect(source).toContain('"name": "HubVillage"');
    expect(source).toContain('content="HubVillage"');
    expect(source).toContain("Greater Boston");
    expect(source).not.toContain("your-domain.com");
    expect(source).toContain('hubvillage.app/search?q={search_term_string}');
    expect(source).not.toContain("og-image.jpg");
  });
});
