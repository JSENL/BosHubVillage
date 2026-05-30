import { describe, expect, it } from 'vitest';
import {
  buildSsrHeadHtml,
  buildSsrPrefetchScript,
  escapeHtml,
} from '@/lib/ssr/fetchPrefetch';
import { buildEventJsonLd } from '@/lib/seo/jsonLd';
import { applySsrTemplate } from '../../scripts/applySsrTemplate.mjs';

describe('SSR prefetch helpers', () => {
  it('escapes HTML in head output', () => {
    const html = buildSsrHeadHtml({
      title: 'Test <script> & "quotes"',
      description: 'Desc & more',
      canonicalPath: '/event/test',
      jsonLd: buildEventJsonLd({
        id: '1',
        slug: 'test',
        title: 'Test <script>',
        date: '2026-06-01',
        location: 'Boston',
      }),
    });
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('https://hubvillage.app/event/test');
    expect(html).toContain('application/ld+json');
  });

  it('merges SSR output into index template', () => {
    const template = `<html><head><!--ssr-head-start--><title>Default</title><!--ssr-head-end--></head><body><div id="root"><!--ssr-outlet--></div><!--ssr-prefetch-data--></body></html>`;
    const html = applySsrTemplate(template, {
      appHtml: '<main>Event Title</main>',
      headHtml: '<title>Event | HubVillage</title>',
      prefetchScript: buildSsrPrefetchScript({
        type: 'event',
        data: {
          id: '1',
          title: 'Event',
          slug: 'event',
        } as never,
      }),
    });
    expect(html).toContain('<main>Event Title</main>');
    expect(html).toContain('<title>Event | HubVillage</title>');
    expect(html).not.toContain('<title>Default</title>');
    expect(html).toContain('window.__SSR_PREFETCH__');
  });

  it('escapeHtml encodes special characters', () => {
    expect(escapeHtml(`a & b <c> "d"`)).toBe('a &amp; b &lt;c&gt; &quot;d&quot;');
  });
});
