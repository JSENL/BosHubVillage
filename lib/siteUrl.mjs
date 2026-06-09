/** Production site URL for sitemaps, canonical links, and robots. */
export const DEFAULT_SITE_URL = 'https://bos-hub-village.vercel.app';

const normalizeOrigin = (value) => {
  const trimmed = String(value).trim().replace(/\/$/, '');
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
};

/**
 * Vercel deployment URLs (e.g. project-git-abc-user.vercel.app) are often SSO-protected
 * and must not appear in sitemaps submitted to Search Console.
 */
const isDeploymentPreviewHost = (host) =>
  /^[a-z0-9-]+-[a-z0-9]{8,}-[a-z0-9-]+\.vercel\.app$/i.test(host);

/**
 * Resolve the public site origin (no trailing slash).
 * Priority: PUBLIC_SITE_URL → VERCEL_PROJECT_PRODUCTION_URL → request Host → default.
 * Avoids VERCEL_URL (per-deploy hostname) which breaks Google Search Console.
 */
export function resolveSiteUrl(requestHost) {
  const fromEnv =
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VITE_PUBLIC_SITE_URL ||
    process.env.VITE_SITE_URL;
  if (fromEnv) {
    return normalizeOrigin(fromEnv);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  }

  const host = requestHost?.split(',')[0]?.trim().toLowerCase();
  if (host && !host.includes('localhost') && !isDeploymentPreviewHost(host)) {
    return `https://${host}`;
  }

  return DEFAULT_SITE_URL;
}
