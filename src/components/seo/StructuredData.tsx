import { useEffect } from 'react';
import { buildBusinessJsonLd, buildEventJsonLd } from '@/lib/seo/jsonLd';
import { hasSsrJsonLd } from '@/lib/seo/ssrJsonLd';

interface EventStructuredDataProps {
  event: {
    id: string;
    slug?: string | null;
    title: string;
    description?: string;
    date: string;
    start_time?: string;
    end_time?: string;
    location: string;
    address?: string;
    price?: number;
    image_url?: string | null;
  };
}

interface BusinessStructuredDataProps {
  business: {
    id: string;
    title: string;
    description?: string;
    address: string;
    neighborhood?: string;
    business_type: string;
    website_link?: string;
    image_url?: string | null;
  };
}

function injectJsonLd(id: string, data: Record<string, unknown>) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  script.id = id;
  document.head.appendChild(script);
  return () => {
    const existing = document.getElementById(id);
    if (existing) {
      document.head.removeChild(existing);
    }
  };
}

export const EventStructuredData = ({ event }: EventStructuredDataProps) => {
  useEffect(() => {
    if (hasSsrJsonLd()) return;
    return injectJsonLd(`event-structured-data-${event.id}`, buildEventJsonLd(event));
  }, [event]);

  return null;
};

export const BusinessStructuredData = ({ business }: BusinessStructuredDataProps) => {
  useEffect(() => {
    if (hasSsrJsonLd()) return;
    return injectJsonLd(`business-structured-data-${business.id}`, buildBusinessJsonLd(business));
  }, [business]);

  return null;
};
