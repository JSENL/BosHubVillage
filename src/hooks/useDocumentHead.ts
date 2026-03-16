import { useEffect } from 'react';

const DEFAULT_TITLE = 'HubVillage - Connect with Your Community';
const DEFAULT_DESCRIPTION = "HubVillage connects neighbors through local events, businesses, news, and community resources. Discover what's happening in your neighborhood.";

/**
 * Sets document title and meta description for the current page (SEO and sharing).
 * Restores defaults on unmount or when title/description become empty.
 */
export function useDocumentHead(title: string | undefined, description?: string | undefined) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (title) {
      document.title = title.includes('HubVillage') ? title : `${title} | HubVillage`;
    }
    if (description && metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      if (metaDesc) metaDesc.setAttribute('content', DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
