/** Production site URL for sitemaps, canonical links, and robots. */
export const DEFAULT_SITE_URL = 'https://bos-hub-village.vercel.app';

/**
 * Resolve the public site origin (no trailing slash).
 * Priority: PUBLIC_SITE_URL → SITE_URL → VITE_* → VERCEL_URL → default.
 */
export function resolveSiteUrl() {
  const fromEnv =
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VITE_PUBLIC_SITE_URL ||
    process.env.VITE_SITE_URL;
  if (fromEnv) {
    const trimmed = String(fromEnv).trim().replace(/\/$/, '');
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '');
  }
  return DEFAULT_SITE_URL;
}
