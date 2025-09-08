import { geocodeEvents } from '@/utils/geocodeEvents';
import { geocodeNewsItems } from '@/utils/geocodeNewsItems';
import { geocodeBusinesses } from '@/utils/geocodeBusinesses';

interface GeocodingData {
  events: any[];
  news: any[];
  businesses: any[];
  geocode: (address: string) => Promise<any>;
}

export const geocodeItemsIfNeeded = async ({ events, news, businesses, geocode }: GeocodingData) => {
  // Geocode events
  const eventsNeedingGeocode = events.filter(event => 
    (!event.latitude || !event.longitude) && event.location
  );
  if (eventsNeedingGeocode.length > 0) {
    await geocodeEvents(eventsNeedingGeocode, geocode);
  }

  // Geocode news
  const newsNeedingGeocode = news.filter(newsItem => 
    newsItem.location && 
    newsItem.location.trim() !== '' &&
    (!newsItem.latitude || !newsItem.longitude || 
     newsItem.latitude === null || newsItem.longitude === null)
  );
  if (newsNeedingGeocode.length > 0) {
    await geocodeNewsItems(newsNeedingGeocode, geocode);
  }

  // Geocode businesses
  const businessesNeedingGeocode = businesses.filter(business => 
    business.address && 
    business.address.trim() !== '' &&
    (!business.latitude || !business.longitude || 
     business.latitude === null || business.longitude === null)
  );
  if (businessesNeedingGeocode.length > 0) {
    await geocodeBusinesses(businessesNeedingGeocode, geocode);
  }
};