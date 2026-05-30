/** Canonical public site URL (production). */
export const SITE_URL = 'https://hubvillage.app';

export const SITE_NAME = 'HubVillage';

export const DEFAULT_OG_IMAGE_PATH = '/lovable-uploads/cormorant.png';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
