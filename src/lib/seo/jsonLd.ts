import { eventDetailPath } from '@/lib/eventUrl';
import { absoluteUrl, SITE_URL } from '@/constants/site';
import { richTextPlainText } from '@/lib/richText';

export function buildEventJsonLd(event: {
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
}): Record<string, unknown> {
  const plainDescription = event.description ? richTextPlainText(event.description) : '';
  const startDate = `${event.date}${event.start_time ? `T${event.start_time}` : ''}`;
  const endDate = event.end_time ? `${event.date}T${event.end_time}` : undefined;
  const pageUrl = absoluteUrl(eventDetailPath({ slug: event.slug, id: event.id }));

  const data: Record<string, unknown> = {
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
    data.offers = {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    };
  }

  return data;
}

export function buildBusinessJsonLd(business: {
  id: string;
  title: string;
  description?: string;
  address: string;
  neighborhood?: string;
  business_type: string;
  website_link?: string;
  image_url?: string | null;
}): Record<string, unknown> {
  const plainDescription = business.description ? richTextPlainText(business.description) : '';
  const pageUrl = absoluteUrl(`/business/${business.id}`);

  return {
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
}

export function buildNewsJsonLd(article: {
  id: string;
  title: string;
  content?: string;
  date_posted: string;
  source?: string;
  location?: string;
  image_url?: string | null;
}): Record<string, unknown> {
  const plainBody = article.content ? richTextPlainText(article.content) : '';
  const pageUrl = absoluteUrl(`/news/${article.id}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: plainBody.slice(0, 300),
    datePublished: article.date_posted,
    url: pageUrl,
    image: article.image_url ? absoluteUrl(article.image_url) : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'HubVillage',
      url: SITE_URL,
    },
    author: article.source
      ? { '@type': 'Organization', name: article.source }
      : { '@type': 'Organization', name: 'HubVillage' },
    contentLocation: article.location
      ? { '@type': 'Place', name: article.location }
      : undefined,
  };
}

export function buildLocalResourceJsonLd(resource: {
  id: string;
  name: string;
  description?: string;
  category?: string;
  address?: string;
  neighborhood?: string;
  image_url?: string | null;
}): Record<string, unknown> {
  const plainDescription = resource.description ? richTextPlainText(resource.description) : '';
  const pageUrl = absoluteUrl(`/local-resource/${resource.id}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: resource.name,
    description: plainDescription,
    url: pageUrl,
    image: resource.image_url ? absoluteUrl(resource.image_url) : undefined,
    address: resource.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: resource.address,
          addressLocality: resource.neighborhood || 'Boston',
          addressRegion: 'MA',
          addressCountry: 'US',
        }
      : undefined,
    category: resource.category,
  };
}
