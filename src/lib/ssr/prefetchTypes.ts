import type { Event } from '@/hooks/useEvents';
import type { Business } from '@/types/business';
import type { SsrSearchHit } from '@/lib/ssr/searchPublicContent';

export type SsrUpcomingEventPreview = {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  snippet: string;
};

export type SsrPrefetchPayload =
  | { type: 'event'; data: Event }
  | { type: 'business'; data: Business }
  | { type: 'news'; data: Record<string, unknown> }
  | { type: 'local_resource'; data: Record<string, unknown> }
  | { type: 'home'; data: { upcomingEvents: SsrUpcomingEventPreview[] } }
  | { type: 'search'; data: { query: string; results: SsrSearchHit[] } };

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
