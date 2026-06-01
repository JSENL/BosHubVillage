import { createClient } from '@supabase/supabase-js';
import { resolveSiteUrl } from './siteUrl.mjs';

export const SITE_URL = resolveSiteUrl();

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? 'https://mecotkulcgdbilaksddu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY290a3VsY2dkYmlsYWtzZGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDE3MzAsImV4cCI6MjA2NDExNzczMH0.GO1Q8_3qngQHqiNE__pdXu57qBMDzOmYNjrpsIgNBY8';

/** Static routes always included in the sitemap. */
export const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/news', changefreq: 'daily', priority: '0.8' },
  { path: '/search', changefreq: 'weekly', priority: '0.6' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
];

export function createSitemapSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function eventPath(row) {
  const slug = row.slug?.trim();
  if (slug) return `/event/${slug}`;
  return `/event/${row.id}`;
}

function pastEventPath(row) {
  return `/event/${row.id}`;
}

function toLastmod(value) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

function entry(loc, { lastmod, changefreq = 'weekly', priority = '0.6' } = {}, baseUrl = SITE_URL) {
  return {
    loc: loc.startsWith('http') ? loc : `${baseUrl}${loc.startsWith('/') ? loc : `/${loc}`}`,
    lastmod,
    changefreq,
    priority,
  };
}

async function fetchAllRows(supabase, table, select, filter) {
  const pageSize = 1000;
  let from = 0;
  const rows = [];

  while (true) {
    let query = supabase.from(table).select(select).range(from, from + pageSize - 1);
    if (filter) query = filter(query);
    const { data, error } = await query;
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

/**
 * Load every public URL for the sitemap (static pages + published content).
 */
export async function fetchSitemapEntries(
  supabase = createSitemapSupabase(),
  baseUrl = resolveSiteUrl()
) {
  const urls = STATIC_PAGES.map((page) =>
    entry(page.path, { changefreq: page.changefreq, priority: page.priority }, baseUrl)
  );

  const [events, pastEvents, businesses, news, localResources] = await Promise.all([
    fetchAllRows(supabase, 'events', 'id, slug, updated_at', (q) =>
      q.eq('is_private', false)
    ),
    fetchAllRows(supabase, 'past_events', 'id, updated_at'),
    fetchAllRows(supabase, 'business', 'id, updated_at'),
    fetchAllRows(supabase, 'news', 'id, updated_at'),
    fetchAllRows(supabase, 'local_resources', 'id, updated_at'),
  ]);

  for (const row of events) {
    urls.push(
      entry(
        eventPath(row),
        { lastmod: toLastmod(row.updated_at), changefreq: 'weekly', priority: '0.8' },
        baseUrl
      )
    );
  }

  for (const row of pastEvents) {
    urls.push(
      entry(
        pastEventPath(row),
        { lastmod: toLastmod(row.updated_at), changefreq: 'monthly', priority: '0.5' },
        baseUrl
      )
    );
  }

  for (const row of businesses) {
    urls.push(
      entry(
        `/business/${row.id}`,
        { lastmod: toLastmod(row.updated_at), changefreq: 'monthly', priority: '0.7' },
        baseUrl
      )
    );
  }

  for (const row of news) {
    urls.push(
      entry(
        `/news/${row.id}`,
        { lastmod: toLastmod(row.updated_at), changefreq: 'weekly', priority: '0.7' },
        baseUrl
      )
    );
  }

  for (const row of localResources) {
    urls.push(
      entry(
        `/local-resource/${row.id}`,
        { lastmod: toLastmod(row.updated_at), changefreq: 'monthly', priority: '0.7' },
        baseUrl
      )
    );
  }

  return urls;
}

export function buildSitemapXml(urls) {
  const urlNodes = urls
    .map((u) => {
      const parts = [`    <url>`, `      <loc>${escapeXml(u.loc)}</loc>`];
      if (u.lastmod) parts.push(`      <lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) parts.push(`      <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority) parts.push(`      <priority>${u.priority}</priority>`);
      parts.push(`    </url>`);
      return parts.join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>
`;
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
