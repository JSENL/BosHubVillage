import { describe, expect, it } from 'vitest';
import { absoluteUrl, SITE_URL } from '@/constants/site';

describe('site constants', () => {
  it('builds absolute URLs from paths', () => {
    expect(absoluteUrl('/event/test-slug')).toBe(`${SITE_URL}/event/test-slug`);
    expect(absoluteUrl('https://cdn.example.com/img.jpg')).toBe('https://cdn.example.com/img.jpg');
  });
});
