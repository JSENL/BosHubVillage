import { describe, expect, it } from 'vitest';
import {
  buildSitemapXml,
  STATIC_PAGES,
  SITE_URL,
} from '../../lib/sitemap.mjs';

describe('sitemap', () => {
  it('builds valid XML with static and content URLs', () => {
    const xml = buildSitemapXml([
      { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
      {
        loc: `${SITE_URL}/event/jazz-night-dorchester`,
        lastmod: '2026-05-01',
        changefreq: 'weekly',
        priority: '0.8',
      },
    ]);

    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain(`<loc>${SITE_URL}/event/jazz-night-dorchester</loc>`);
    expect(xml).toContain('<lastmod>2026-05-01</lastmod>');
  });

  it('escapes XML in URLs', () => {
    const xml = buildSitemapXml([
      { loc: `${SITE_URL}/event/foo&bar`, changefreq: 'weekly', priority: '0.6' },
    ]);
    expect(xml).toContain('foo&amp;bar');
    expect(xml).not.toContain('foo&bar');
  });

  it('defines static hub pages', () => {
    expect(STATIC_PAGES.map((p) => p.path)).toContain('/');
    expect(STATIC_PAGES.map((p) => p.path)).toContain('/faq');
  });
});
