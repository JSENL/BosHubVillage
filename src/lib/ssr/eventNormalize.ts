import type { Event } from '@/hooks/useEvents';

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const slugifyTitle = (raw: string): string =>
  raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);

export function normalizeEventRow(row: Record<string, unknown>, slugFallback?: string): Event {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    category: String(row.category ?? ''),
    event_type: String(row.event_type ?? 'event'),
    date: String(row.date ?? ''),
    start_time: String(row.start_time ?? '00:00:00'),
    end_time: String(row.end_time ?? '00:00:00'),
    location: String(row.location ?? ''),
    address: row.address ? String(row.address) : '',
    website_link: row.website_link ? String(row.website_link) : undefined,
    price: Number(row.price ?? 0),
    max_attendees: (row.max_attendees as number | null) ?? null,
    is_recurring: Boolean(row.is_recurring ?? false),
    recurring_pattern: (row.recurring_pattern as string | null) ?? null,
    registration_required: Boolean(row.registration_required ?? false),
    created_by: String(row.created_by ?? ''),
    latitude: row.latitude != null ? Number(row.latitude) : null,
    longitude: row.longitude != null ? Number(row.longitude) : null,
    neighborhoods: (row.neighborhoods as string | null) ?? null,
    villages: (row.villages as string | null) ?? null,
    attendees_count: typeof row.attendees_count === 'number' ? row.attendees_count : 0,
    is_sponsored: Boolean(row.is_sponsored ?? false),
    contact_type: (row.contact_type as Event['contact_type']) ?? null,
    contact_value: (row.contact_value as string | null) ?? null,
    image_url: (row.image_url as string | null) ?? null,
    cover_zoom: Number(row.cover_zoom ?? 1),
    cover_focus_x: Number(row.cover_focus_x ?? 50),
    cover_focus_y: Number(row.cover_focus_y ?? 50),
    slug: String(row.slug ?? slugFallback ?? row.id),
  };
}
