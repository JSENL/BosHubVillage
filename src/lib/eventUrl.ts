/** Prefer slug for shareable URLs; fall back to id (e.g. legacy links) if slug is missing. */
export function eventDetailPath(args: { slug?: string | null; id: string }): string {
  const s = args.slug?.trim();
  if (s) return `/event/${s}`;
  return `/event/${args.id}`;
}
