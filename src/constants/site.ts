/** Canonical public site URL (production). Override with VITE_PUBLIC_SITE_URL at build time. */
export const SITE_URL = (
  import.meta.env.VITE_PUBLIC_SITE_URL ||
  import.meta.env.VITE_SITE_URL ||
  'https://bos-hub-village.vercel.app'
)
  .trim()
  .replace(/\/$/, '');

export const SITE_NAME = 'HubVillage';

export const DEFAULT_OG_IMAGE_PATH = '/lovable-uploads/cormorant.png';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
