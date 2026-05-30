import { createServerSupabase } from '@/integrations/supabase/serverClient';
import { eventDetailPath } from '@/lib/eventUrl';
import { absoluteUrl, SITE_NAME } from '@/constants/site';
import { richTextPlainText } from '@/lib/richText';
import {
  buildBusinessJsonLd,
  buildEventJsonLd,
  buildLocalResourceJsonLd,
  buildNewsJsonLd,
} from '@/lib/seo/jsonLd';
import type { Event } from '@/hooks/useEvents';
import type { Business } from '@/types/business';
import { normalizeEventRow, slugifyTitle, UUID_RE } from '@/lib/ssr/eventNormalize';
import { searchPublicContent } from '@/lib/ssr/searchPublicContent';
import type {
  SsrHeadPayload,
  SsrPrefetchPayload,
  SsrPrefetchResult,
  SsrUpcomingEventPreview,
} from '@/lib/ssr/prefetchTypes';
import { SSR_JSON_LD_SCRIPT_ID } from '@/lib/seo/ssrJsonLd';

export type {
  SsrHeadPayload,
  SsrPrefetchPayload,
  SsrPrefetchResult,
  SsrUpcomingEventPreview,
} from '@/lib/ssr/prefetchTypes';

function parseRequestUrl(url: string) {
  try {
    return new URL(url, 'http://ssr.local');
  } catch {
    const [path, search = ''] = url.split('?');
    return new URL(`${path || '/'}?${search}`, 'http://ssr.local');
  }
}

async function fetchEventByParam(param: string): Promise<Event | null> {
  const supabase = createServerSupabase();

  const liveBySlug = await supabase.from('events').select('*').eq('slug', param).maybeSingle();
  if (liveBySlug.data) {
    return normalizeEventRow(liveBySlug.data as Record<string, unknown>);
  }

  if (UUID_RE.test(param)) {
    const liveById = await supabase.from('events').select('*').eq('id', param).maybeSingle();
    if (liveById.data) {
      return normalizeEventRow(liveById.data as Record<string, unknown>);
    }

    const pastById = await supabase.from('past_events').select('*').eq('id', param).maybeSingle();
    if (pastById.data) {
      return normalizeEventRow(
        pastById.data as Record<string, unknown>,
        slugifyTitle(String(pastById.data.title ?? 'event'))
      );
    }
  }

  const titleSearch = `%${param.replace(/-/g, '%')}%`;
  const pastCandidates = await supabase
    .from('past_events')
    .select('*')
    .ilike('title', titleSearch)
    .order('date', { ascending: false })
    .limit(40);

  const match = (pastCandidates.data ?? []).find(
    (row) => slugifyTitle(String(row.title ?? '')) === param
  );
  if (match) {
    return normalizeEventRow(
      match as Record<string, unknown>,
      slugifyTitle(String(match.title ?? 'event'))
    );
  }

  return null;
}

function buildHead(
  title: string,
  description: string,
  canonicalPath: string,
  imageUrl?: string | null,
  jsonLd?: Record<string, unknown>
): SsrHeadPayload {
  return {
    title: title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`,
    description: description.slice(0, 300),
    canonicalPath,
    imageUrl,
    jsonLd,
  };
}

async function fetchUpcomingEvents(limit = 12): Promise<SsrUpcomingEventPreview[]> {
  const supabase = createServerSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('events')
    .select('id, slug, title, date, location, description')
    .eq('is_private', false)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(limit);

  return (data ?? []).map((row) => ({
    id: String(row.id),
    slug: String(row.slug ?? row.id),
    title: String(row.title ?? ''),
    date: String(row.date ?? ''),
    location: String(row.location ?? ''),
    snippet: richTextPlainText(String(row.description ?? '')).slice(0, 120),
  }));
}

export async function fetchPrefetchForUrl(url: string): Promise<SsrPrefetchResult> {
  const parsed = parseRequestUrl(url);
  const pathname = parsed.pathname;

  if (pathname === '/' || pathname === '') {
    const upcomingEvents = await fetchUpcomingEvents();
    return {
      payload: { type: 'home', data: { upcomingEvents } },
      head: buildHead(
        'HubVillage - Boston community events, businesses & culture',
        'Discover upcoming Boston-area events, local businesses, culture, and community resources across Greater Boston and Lower Boston.',
        '/'
      ),
    };
  }

  if (pathname === '/faq') {
    return {
      payload: null,
      head: buildHead(
        'FAQ — HubVillage Boston community platform',
        'Frequently asked questions about finding Boston-area events, businesses, culture, and local resources on HubVillage.',
        '/faq'
      ),
    };
  }

  if (pathname === '/about') {
    return {
      payload: null,
      head: buildHead(
        'About HubVillage — Greater Boston community',
        'HubVillage connects neighbors across Greater Boston and Lower Boston through local events, businesses, and community resources.',
        '/about'
      ),
    };
  }

  if (pathname === '/search') {
    const q = parsed.searchParams.get('q')?.trim() ?? '';
    const canonicalPath = q ? `/search?q=${encodeURIComponent(q)}` : '/search';
    if (!q) {
      return {
        payload: { type: 'search', data: { query: '', results: [] } },
        head: buildHead(
          'Search Boston events & community | HubVillage',
          'Search HubVillage for Boston-area events, businesses, culture articles, and community resources.',
          '/search'
        ),
      };
    }
    const supabase = createServerSupabase();
    const results = await searchPublicContent(supabase, q);
    return {
      payload: { type: 'search', data: { query: q, results } },
      head: buildHead(
        `Search: ${q}`,
        `Search results for "${q}" on HubVillage — Boston events, businesses, culture, and local resources.`,
        canonicalPath
      ),
    };
  }

  const eventMatch = pathname.match(/^\/event\/([^/]+)\/?$/);
  if (eventMatch) {
    const event = await fetchEventByParam(decodeURIComponent(eventMatch[1]));
    if (!event) return { payload: null, head: null };
    const description = richTextPlainText(event.description || '').slice(0, 160);
    const path = eventDetailPath({ slug: event.slug, id: event.id });
    return {
      payload: { type: 'event', data: event },
      head: buildHead(event.title, description, path, event.image_url, buildEventJsonLd(event)),
    };
  }

  const businessMatch = pathname.match(/^\/business\/([^/]+)\/?$/);
  if (businessMatch) {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from('business')
      .select('*')
      .eq('id', businessMatch[1])
      .maybeSingle();
    if (!data) return { payload: null, head: null };
    const business = data as Business;
    const description = richTextPlainText(
      business.short_description || business.description || ''
    ).slice(0, 160);
    const path = `/business/${business.id}`;
    return {
      payload: { type: 'business', data: business },
      head: buildHead(
        business.title,
        description,
        path,
        business.image_url,
        buildBusinessJsonLd(business)
      ),
    };
  }

  const newsMatch = pathname.match(/^\/news\/([^/]+)\/?$/);
  if (newsMatch) {
    const supabase = createServerSupabase();
    const { data } = await supabase.from('news').select('*').eq('id', newsMatch[1]).maybeSingle();
    if (!data) return { payload: null, head: null };
    const row = data as Record<string, unknown>;
    const description = richTextPlainText(String(row.content ?? row.title ?? '')).slice(0, 160);
    const path = `/news/${String(row.id)}`;
    return {
      payload: { type: 'news', data: row },
      head: buildHead(
        String(row.title ?? ''),
        description,
        path,
        (row.image_url as string | null) ?? null,
        buildNewsJsonLd({
          id: String(row.id),
          title: String(row.title ?? ''),
          content: String(row.content ?? ''),
          date_posted: String(row.date_posted ?? ''),
          source: row.source ? String(row.source) : undefined,
          location: row.location ? String(row.location) : undefined,
          image_url: (row.image_url as string | null) ?? null,
        })
      ),
    };
  }

  const resourceMatch = pathname.match(/^\/local-resource\/([^/]+)\/?$/);
  if (resourceMatch) {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from('local_resources')
      .select('*')
      .eq('id', resourceMatch[1])
      .maybeSingle();
    if (!data) return { payload: null, head: null };
    const row = data as Record<string, unknown>;
    const description = richTextPlainText(String(row.description ?? row.name ?? '')).slice(0, 160);
    const path = `/local-resource/${String(row.id)}`;
    return {
      payload: { type: 'local_resource', data: row },
      head: buildHead(
        String(row.name ?? ''),
        description,
        path,
        (row.image_url as string | null) ?? null,
        buildLocalResourceJsonLd({
          id: String(row.id),
          name: String(row.name ?? ''),
          description: String(row.description ?? ''),
          category: row.category ? String(row.category) : undefined,
          address: row.address ? String(row.address) : undefined,
          neighborhood: row.neighborhood ? String(row.neighborhood) : undefined,
          image_url: (row.image_url as string | null) ?? null,
        })
      ),
    };
  }

  return { payload: null, head: null };
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildSsrHeadHtml(head: SsrHeadPayload | null): string {
  if (!head) return '';

  const title = escapeHtml(head.title);
  const description = escapeHtml(head.description);
  const canonical = absoluteUrl(head.canonicalPath);
  const image = head.imageUrl ? absoluteUrl(head.imageUrl) : absoluteUrl('/lovable-uploads/cormorant.png');

  const jsonLdScript = head.jsonLd
    ? `<script id="${SSR_JSON_LD_SCRIPT_ID}" type="application/ld+json">${JSON.stringify(head.jsonLd).replace(/</g, '\\u003c')}</script>`
    : '';

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:url" content="${canonical}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    jsonLdScript,
  ].join('\n    ');
}

export function buildSsrPrefetchScript(payload: SsrPrefetchPayload | null): string {
  if (!payload) return '';
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  return `<script>window.__SSR_PREFETCH__=${json}</script>`;
}
