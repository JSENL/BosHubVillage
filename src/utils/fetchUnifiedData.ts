
import { supabase } from '@/integrations/supabase/client';
import { UnifiedItem } from '@/types/unifiedItem';
import { geocodeNewsItems } from './geocodeNewsItems';

export const fetchAllUnifiedData = async (geocode: (address: string) => Promise<any>): Promise<UnifiedItem[]> => {
  const [eventsRes, newsRes, businessRes, localServicesRes] = await Promise.all([
    supabase.from('events').select('*'),
    supabase.from('news').select('*'),
    supabase.from('business').select('*'),
    supabase.from('local_services_nonprofits').select('*')
  ]);

  const items: UnifiedItem[] = [];

  // Process events
  if (eventsRes.data) {
    eventsRes.data.forEach(event => {
      items.push({
        id: event.id,
        title: event.title,
        description: event.description || '',
        latitude: event.latitude ? Number(event.latitude) : null,
        longitude: event.longitude ? Number(event.longitude) : null,
        type: 'event',
        location: event.location,
        category: event.category,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        price: Number(event.price || 0),
        neighborhoods: event.neighborhoods,
        villages: event.villages
      });
    });
  }

  // Process news - geocode addresses if needed
  if (newsRes.data) {
    // First, try to geocode news items that don't have coordinates
    await geocodeNewsItems(newsRes.data, geocode);
    
    newsRes.data.forEach(news => {
      items.push({
        id: news.id,
        title: news.title,
        description: news.content || '',
        latitude: news.latitude ? Number(news.latitude) : null,
        longitude: news.longitude ? Number(news.longitude) : null,
        type: 'news',
        location: news.location,
        address: news.Address,
        content: news.content,
        source: news.source,
        villages: news.villages
      });
    });
  }

  // Process businesses
  if (businessRes.data) {
    businessRes.data.forEach(business => {
      items.push({
        id: business.id,
        title: business.title,
        description: business.description || '',
        latitude: null, // Business doesn't have coordinates yet
        longitude: null,
        type: 'business',
        address: business.address,
        category: business.business_type,
        business_type: business.business_type,
        villages: business.villages
      });
    });
  }

  // Process local services
  if (localServicesRes.data) {
    localServicesRes.data.forEach(service => {
      items.push({
        id: service.id,
        title: service.name,
        description: service.description || '',
        latitude: service.latitude ? Number(service.latitude) : null,
        longitude: service.longitude ? Number(service.longitude) : null,
        type: 'local-service',
        address: service.address,
        category: service.category,
        name: service.name
      });
    });
  }

  return items;
};
