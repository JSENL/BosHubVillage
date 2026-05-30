import { useEffect } from 'react';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE_PATH,
  absoluteUrl,
} from '@/constants/site';

const DEFAULT_TITLE = `${SITE_NAME} - Boston community events, businesses & culture`;
const DEFAULT_DESCRIPTION =
  'HubVillage maps local events, businesses, culture, and community resources across Greater Boston and Lower Boston neighborhoods.';

export interface DocumentHeadOptions {
  /** Path only, e.g. `/event/my-slug` — builds canonical and og:url */
  path?: string;
  imageUrl?: string | null;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector =
    attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const previous = el.getAttribute('content');
  el.setAttribute('content', content);
  return previous;
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  const previous = el.getAttribute('href');
  el.setAttribute('href', href);
  return previous;
}

function resolveOgImage(imageUrl?: string | null): string {
  if (!imageUrl) {
    return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  }
  return absoluteUrl(imageUrl);
}

/**
 * Sets document title, meta description, Open Graph, Twitter, and canonical for the current page.
 */
export function useDocumentHead(
  title: string | undefined,
  description?: string | undefined,
  options?: DocumentHeadOptions
) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content') ?? null;

    const prevOg: Array<{ attr: 'name' | 'property'; key: string; value: string | null }> = [];
    const ogKeys: Array<{ attr: 'name' | 'property'; key: string }> = [
      { attr: 'property', key: 'og:title' },
      { attr: 'property', key: 'og:description' },
      { attr: 'property', key: 'og:url' },
      { attr: 'property', key: 'og:image' },
      { attr: 'name', key: 'twitter:title' },
      { attr: 'name', key: 'twitter:description' },
      { attr: 'name', key: 'twitter:url' },
      { attr: 'name', key: 'twitter:image' },
    ];

    const prevCanonical = document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.getAttribute('href') ?? null;

    if (title) {
      const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
      document.title = pageTitle;
      prevOg.push(
        { attr: 'property', key: 'og:title', value: setMeta('property', 'og:title', pageTitle) },
        { attr: 'name', key: 'twitter:title', value: setMeta('name', 'twitter:title', pageTitle) }
      );
    }

    if (description && metaDesc) {
      metaDesc.setAttribute('content', description);
      prevOg.push(
        {
          attr: 'property',
          key: 'og:description',
          value: setMeta('property', 'og:description', description),
        },
        {
          attr: 'name',
          key: 'twitter:description',
          value: setMeta('name', 'twitter:description', description),
        }
      );
    }

    const pageUrl = options?.path ? absoluteUrl(options.path) : SITE_URL;
    prevOg.push(
      { attr: 'property', key: 'og:url', value: setMeta('property', 'og:url', pageUrl) },
      { attr: 'name', key: 'twitter:url', value: setMeta('name', 'twitter:url', pageUrl) }
    );
    setCanonical(pageUrl);

    const ogImage = resolveOgImage(options?.imageUrl);
    prevOg.push(
      { attr: 'property', key: 'og:image', value: setMeta('property', 'og:image', ogImage) },
      { attr: 'name', key: 'twitter:image', value: setMeta('name', 'twitter:image', ogImage) }
    );

    return () => {
      document.title = DEFAULT_TITLE;
      if (metaDesc) {
        metaDesc.setAttribute('content', prevDesc ?? DEFAULT_DESCRIPTION);
      }
      for (const { attr, key, value } of prevOg) {
        if (value != null) {
          setMeta(attr, key, value);
        }
      }
      if (prevCanonical) {
        setCanonical(prevCanonical);
      } else {
        setCanonical(SITE_URL + '/');
      }
    };
  }, [title, description, options?.path, options?.imageUrl]);
}
