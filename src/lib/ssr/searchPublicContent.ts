import type { SupabaseClient } from '@supabase/supabase-js';
import { eventDetailPath } from '@/lib/eventUrl';
import { richTextPlainText } from '@/lib/richText';

export interface SsrSearchHit {
  type: 'event' | 'business' | 'news' | 'local_resource';
  id: string;
  slug?: string | null;
  title: string;
  path: string;
  snippet: string;
}

const SNIPPET_LEN = 140;

function snippet(text: string): string {
  const plain = richTextPlainText(text || '').trim();
  if (plain.length <= SNIPPET_LEN) return plain;
  return `${plain.slice(0, SNIPPET_LEN)}…`;
}

function sanitizeQuery(raw: string): string {
  return raw.replace(/[%,()]/g, ' ').trim().slice(0, 80);
}

/**
 * Public content search for SSR /search page (Postgres ilike — no extra search service).
 */
export async function searchPublicContent(
  supabase: SupabaseClient,
  rawQuery: string,
  limitPerType = 8
): Promise<SsrSearchHit[]> {
  const query = sanitizeQuery(rawQuery);
  if (!query) return [];

  const pattern = `%${query}%`;
  const results: SsrSearchHit[] = [];

  const [events, businesses, news, localResources] = await Promise.all([
    supabase
      .from('events')
      .select('id, slug, title, description, location, date')
      .eq('is_private', false)
      .ilike('title', pattern)
      .order('date', { ascending: true })
      .limit(limitPerType),
    supabase
      .from('business')
      .select('id, title, description, short_description, address')
      .ilike('title', pattern)
      .limit(limitPerType),
    supabase
      .from('news')
      .select('id, title, content, location')
      .ilike('title', pattern)
      .order('date_posted', { ascending: false })
      .limit(limitPerType),
    supabase
      .from('local_resources')
      .select('id, name, description, address, category')
      .ilike('name', pattern)
      .limit(limitPerType),
  ]);

  for (const row of events.data ?? []) {
    results.push({
      type: 'event',
      id: String(row.id),
      slug: row.slug,
      title: String(row.title ?? ''),
      path: eventDetailPath({ slug: row.slug, id: String(row.id) }),
      snippet: snippet(
        `${row.date ?? ''} · ${row.location ?? ''} — ${row.description ?? ''}`
      ),
    });
  }

  for (const row of businesses.data ?? []) {
    results.push({
      type: 'business',
      id: String(row.id),
      title: String(row.title ?? ''),
      path: `/business/${row.id}`,
      snippet: snippet(String(row.short_description || row.description || row.address || '')),
    });
  }

  for (const row of news.data ?? []) {
    results.push({
      type: 'news',
      id: String(row.id),
      title: String(row.title ?? ''),
      path: `/news/${row.id}`,
      snippet: snippet(String(row.content ?? row.title ?? '')),
    });
  }

  for (const row of localResources.data ?? []) {
    results.push({
      type: 'local_resource',
      id: String(row.id),
      title: String(row.name ?? ''),
      path: `/local-resource/${row.id}`,
      snippet: snippet(String(row.description ?? row.category ?? '')),
    });
  }

  return results;
}
