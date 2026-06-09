import {
  buildSitemapXml,
  fetchSitemapEntries,
  STATIC_PAGES,
} from '../lib/sitemap.mjs';
import { resolveSiteUrl } from '../lib/siteUrl.mjs';

export default async function handler(req, res) {
  const requestHost = req.headers['x-forwarded-host'] || req.headers.host;
  const siteUrl = resolveSiteUrl(requestHost);
  try {
    const urls = await fetchSitemapEntries(undefined, siteUrl);
    const xml = buildSitemapXml(urls);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Sitemap generation failed:', error);

    const fallback = buildSitemapXml(
      STATIC_PAGES.map((page) => ({
        loc: `${siteUrl}${page.path}`,
        changefreq: page.changefreq,
        priority: page.priority,
      }))
    );

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    res.status(200).send(fallback);
  }
}
