import { describe, it, expect, afterEach } from 'vitest';
import { resolveSiteUrl, DEFAULT_SITE_URL } from '../../lib/siteUrl.mjs';

describe('resolveSiteUrl', () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
  });

  it('uses PUBLIC_SITE_URL when set', () => {
    process.env.PUBLIC_SITE_URL = 'https://bos-hub-village.vercel.app';
    delete process.env.VERCEL_URL;
    expect(resolveSiteUrl()).toBe('https://bos-hub-village.vercel.app');
  });

  it('uses request host instead of deployment preview VERCEL_URL', () => {
    delete process.env.PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    process.env.VERCEL_URL = 'bos-hub-village-k11aw1onj-jsenls-projects.vercel.app';
    expect(resolveSiteUrl('bos-hub-village.vercel.app')).toBe(
      'https://bos-hub-village.vercel.app'
    );
  });

  it('falls back to default when only deployment preview host is available', () => {
    delete process.env.PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    process.env.VERCEL_URL = 'bos-hub-village-k11aw1onj-jsenls-projects.vercel.app';
    expect(resolveSiteUrl()).toBe(DEFAULT_SITE_URL);
  });
});
