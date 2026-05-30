import { useEffect } from 'react';
import { eventDetailPath } from '@/lib/eventUrl';
import { absoluteUrl, SITE_URL } from '@/constants/site';
import { richTextPlainText } from '@/lib/richText';

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
    const plainDescription = event.description
      ? richTextPlainText(event.description)
      : '';
    const startDate = `${event.date}${event.start_time ? `T${event.start_time}` : ''}`;
    const endDate = event.end_time ? `${event.date}T${event.end_time}` : undefined;
    const pageUrl = absoluteUrl(eventDetailPath({ slug: event.slug, id: event.id }));

    const structuredData: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      description: plainDescription,
      startDate,
      endDate,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: event.location,
        address: {
          '@type': 'PostalAddress',
          streetAddress: event.address || event.location,
          addressLocality: 'Boston',
          addressRegion: 'MA',
          addressCountry: 'US',
        },
      },
      image: event.image_url ? absoluteUrl(event.image_url) : undefined,
      url: pageUrl,
      organizer: {
        '@type': 'Organization',
        name: 'HubVillage',
        url: SITE_URL,
      },
    };

    if (event.price != null && event.price > 0) {
      structuredData.offers = {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      };
    }

    return injectJsonLd(`event-structured-data-${event.id}`, structuredData);
  }, [event]);

  return null;
};

export const BusinessStructuredData = ({ business }: BusinessStructuredDataProps) => {
  useEffect(() => {
    const plainDescription = business.description
      ? richTextPlainText(business.description)
      : '';
    const pageUrl = absoluteUrl(`/business/${business.id}`);

    const structuredData: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: business.title,
      description: plainDescription,
      '@id': pageUrl,
      url: business.website_link || pageUrl,
      image: business.image_url ? absoluteUrl(business.image_url) : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        addressLocality: business.neighborhood || 'Boston',
        addressRegion: 'MA',
        addressCountry: 'US',
      },
      areaServed: {
        '@type': 'City',
        name: 'Boston',
      },
      category: business.business_type,
    };

    return injectJsonLd(`business-structured-data-${business.id}`, structuredData);
  }, [business]);

  return null;
};
