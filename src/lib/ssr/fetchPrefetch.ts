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

export type SsrPrefetchPayload =
  | { type: 'event'; data: Event }
  | { type: 'business'; data: Business }
  | { type: 'news'; data: Record<string, unknown> }
  | { type: 'local_resource'; data: Record<string, unknown> };

export interface SsrHeadPayload {
  title: string;
  description: string;
  canonicalPath: string;
  imageUrl?: string | null;
  jsonLd?: Record<string, unknown>;
}

export interface SsrPrefetchResult {
  payload: SsrPrefetchPayload | null;
  head: SsrHeadPayload | null;
}

function parsePathname(url: string): string {
  try {
    return new URL(url, 'http://ssr.local').pathname;
  } catch {
    return url.split('?')[0] || '/';
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

export async function fetchPrefetchForUrl(url: string): Promise<SsrPrefetchResult> {
  const pathname = parsePathname(url);

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
    ? `<script type="application/ld+json">${JSON.stringify(head.jsonLd).replace(/</g, '\\u003c')}</script>`
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
