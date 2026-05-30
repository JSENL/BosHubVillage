import { describe, expect, it } from 'vitest';
import { buildSitemapXml } from '../../lib/sitemap.mjs';

describe('search SEO infrastructure', () => {
  it('sitemap includes search route', async () => {
    const { STATIC_PAGES } = await import('../../lib/sitemap.mjs');
    expect(STATIC_PAGES.some((p: { path: string }) => p.path === '/search')).toBe(true);
  });

  it('buildSitemapXml still valid after search route added', () => {
    const xml = buildSitemapXml([
      { loc: 'https://hubvillage.app/search', changefreq: 'weekly', priority: '0.6' },
    ]);
    expect(xml).toContain('<loc>https://hubvillage.app/search</loc>');
  });
});
