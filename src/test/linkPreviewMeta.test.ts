import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("link preview metadata", () => {
  it("uses HubVillage logo for Open Graph and Twitter images", () => {
    const source = readFileSync(path.join(process.cwd(), "index.html"), "utf8");
    const logoPath = "/lovable-uploads/76a583e0-eef3-4167-a87b-ed0504940bdc.png";

    expect(source).toContain(`<meta property="og:image" content="${logoPath}" />`);
    expect(source).toContain(`<meta name="twitter:image" content="${logoPath}" />`);
    expect(source).toContain(`<meta property="og:image:alt" content="HubVillage logo" />`);
    expect(source).not.toContain("og-image.jpg");
  });
});

