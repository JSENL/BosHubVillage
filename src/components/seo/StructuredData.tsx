import { useEffect } from 'react';

interface EventStructuredDataProps {
  event: {
    id: string;
    title: string;
    description?: string;
    date: string;
    start_time?: string;
    end_time?: string;
    location: string;
    price?: number;
    image?: string;
  };
}

interface BusinessStructuredDataProps {
  business: {
    id: string;
    title: string;
    description?: string;
    address: string;
    business_type: string;
    website_link?: string;
  };
}

export const EventStructuredData = ({ event }: EventStructuredDataProps) => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "description": event.description || "",
      "startDate": `${event.date}${event.start_time ? `T${event.start_time}` : ''}`,
      "endDate": event.end_time ? `${event.date}T${event.end_time}` : undefined,
      "location": {
        "@type": "Place",
        "name": event.location,
        "address": event.location
      },
      "offers": event.price ? {
        "@type": "Offer",
        "price": event.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      } : undefined,
      "image": event.image || "",
      "url": `${window.location.origin}/event/${event.id}`
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = `event-structured-data-${event.id}`;
    
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(`event-structured-data-${event.id}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [event]);

  return null;
};

export const BusinessStructuredData = ({ business }: BusinessStructuredDataProps) => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": business.title,
      "description": business.description || "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": business.address
      },
      "url": business.website_link || `${window.location.origin}/business/${business.id}`,
      "@id": `${window.location.origin}/business/${business.id}`,
      "category": business.business_type
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = `business-structured-data-${business.id}`;
    
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(`business-structured-data-${business.id}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [business]);

  return null;
};