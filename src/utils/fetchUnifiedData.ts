
import { supabase } from '@/integrations/supabase/client';
import { UnifiedItem } from '@/types/unifiedItem';
import { geocodeNewsItems } from './geocodeNewsItems';

export const fetchAllUnifiedData = async (geocode: (address: string) => Promise<any>): Promise<UnifiedItem[]> => {
  console.log('Starting unified data fetch...');
  
  const [eventsRes, newsRes, businessRes, localServicesRes] = await Promise.all([
    supabase.from('events').select('*').order('created_at', { ascending: false }),
    supabase.from('news').select('*').order('date_posted', { ascending: false }),
    supabase.from('business').select('*').order('created_at', { ascending: false }),
    supabase.from('local_services_nonprofits').select('*').order('created_at', { ascending: false })
  ]);

  if (eventsRes.error) {
    console.error('Error fetching events:', eventsRes.error);
  }
  if (newsRes.error) {
    console.error('Error fetching news:', newsRes.error);
  }
  if (businessRes.error) {
    console.error('Error fetching business:', businessRes.error);
  }
  if (localServicesRes.error) {
    console.error('Error fetching local services:', localServicesRes.error);
  }

  const items: UnifiedItem[] = [];

  // Process events with enhanced coordinate validation
  if (eventsRes.data) {
    console.log('Processing events:', eventsRes.data.length);
    eventsRes.data.forEach(event => {
      const lat = event.latitude ? Number(event.latitude) : null;
      const lng = event.longitude ? Number(event.longitude) : null;
      
      items.push({
        id: event.id,
        title: event.title,
        description: event.description || '',
        latitude: (lat && !isNaN(lat)) ? lat : null,
        longitude: (lng && !isNaN(lng)) ? lng : null,
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

  // Process news with enhanced geocoding and coordinate validation
  if (newsRes.data) {
    console.log('Processing news:', newsRes.data.length);
    
    // Always try to geocode news items that don't have coordinates
    const newsItemsToGeocode = newsRes.data.filter(news => 
      (!news.latitude || !news.longitude || news.latitude === null || news.longitude === null) && 
      (news.Address || news.location)
    );
    
    if (newsItemsToGeocode.length > 0) {
      console.log('Geocoding news items:', newsItemsToGeocode.length);
      await geocodeNewsItems(newsItemsToGeocode, geocode);
    }
    
    newsRes.data.forEach(news => {
      const lat = news.latitude ? Number(news.latitude) : null;
      const lng = news.longitude ? Number(news.longitude) : null;
      
      console.log(`News item ${news.id}: lat=${lat}, lng=${lng}, location=${news.location}, address=${news.Address}`);
      
      items.push({
        id: news.id,
        title: news.title,
        description: news.content || '',
        latitude: (lat && !isNaN(lat)) ? lat : null,
        longitude: (lng && !isNaN(lng)) ? lng : null,
        type: 'news',
        location: news.location,
        address: news.Address,
        content: news.content,
        source: news.source,
        villages: news.villages,
        date: news.date_posted
      });
    });
  }

  // Process businesses with potential geocoding
  if (businessRes.data) {
    console.log('Processing businesses:', businessRes.data.length);
    businessRes.data.forEach(business => {
      items.push({
        id: business.id,
        title: business.title,
        description: business.description || '',
        latitude: null, // Business table doesn't have coordinates yet
        longitude: null,
        type: 'business',
        address: business.address,
        category: business.business_type,
        business_type: business.business_type,
        villages: business.villages,
        neighborhoods: business.neighborhood
      });
    });
  }

  // Process local services with coordinate validation
  if (localServicesRes.data) {
    console.log('Processing local services:', localServicesRes.data.length);
    localServicesRes.data.forEach(service => {
      const lat = service.latitude ? Number(service.latitude) : null;
      const lng = service.longitude ? Number(service.longitude) : null;
      
      items.push({
        id: service.id,
        title: service.name,
        description: service.description || '',
        latitude: (lat && !isNaN(lat)) ? lat : null,
        longitude: (lng && !isNaN(lng)) ? lng : null,
        type: 'local-service',
        address: service.address,
        category: service.category,
        name: service.name,
        neighborhoods: service.neighborhood,
        villages: service.village
      });
    });
  }

  console.log('Total unified items processed:', items.length);
  console.log('Items with coordinates:', items.filter(item => item.latitude && item.longitude).length);
  console.log('News items processed:', items.filter(item => item.type === 'news').length);
  console.log('News items with coordinates:', items.filter(item => item.type === 'news' && item.latitude && item.longitude).length);
  
  return items;
};
