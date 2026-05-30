/**
 * Build-time sitemap: writes dist/sitemap.xml from Supabase public content.
 * Run after vite build (dist/ must exist). Also served dynamically via api/sitemap.js on Vercel.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  buildSitemapXml,
  fetchSitemapEntries,
} from '../lib/sitemap.mjs';

const outPath = path.join(process.cwd(), 'dist', 'sitemap.xml');

try {
  const urls = await fetchSitemapEntries();
  const xml = buildSitemapXml(urls);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf-8');
  console.log(`Sitemap: wrote ${urls.length} URLs to dist/sitemap.xml`);
} catch (err) {
  console.error('Sitemap generation failed:', err.message);
  process.exit(1);
}
