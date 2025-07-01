
import { supabase } from '@/integrations/supabase/client';
import { UnifiedItem } from '@/types/unifiedItem';
import { geocodeNewsItems } from './geocodeNewsItems';

export const fetchAllUnifiedData = async (geocode: (address: string) => Promise<any>): Promise<UnifiedItem[]> => {
  console.log('🔄 Starting unified data fetch...');
  
  const [eventsRes, newsRes, businessRes, localResourcesRes] = await Promise.all([
    supabase.from('events').select('*').order('created_at', { ascending: false }),
    supabase.from('news').select('*').order('date_posted', { ascending: false }),
    supabase.from('business').select('*').order('created_at', { ascending: false }),
    supabase.from('local_resources').select('*').order('created_at', { ascending: false })
  ]);

  console.log('📊 Database fetch results:', {
    events: { count: eventsRes.data?.length || 0, error: eventsRes.error },
    news: { count: newsRes.data?.length || 0, error: newsRes.error },
    business: { count: businessRes.data?.length || 0, error: businessRes.error },
    localResources: { count: localResourcesRes.data?.length || 0, error: localResourcesRes.error }
  });

  if (eventsRes.error) {
    console.error('❌ Error fetching events:', eventsRes.error);
  }
  if (newsRes.error) {
    console.error('❌ Error fetching news:', newsRes.error);
  }
  if (businessRes.error) {
    console.error('❌ Error fetching business:', businessRes.error);
  }
  if (localResourcesRes.error) {
    console.error('❌ Error fetching local resources:', localResourcesRes.error);
  }

  const items: UnifiedItem[] = [];

  // Process events with enhanced coordinate validation
  if (eventsRes.data) {
    console.log('📅 Processing events:', eventsRes.data.length);
    eventsRes.data.forEach(event => {
      const lat = event.latitude ? Number(event.latitude) : null;
      const lng = event.longitude ? Number(event.longitude) : null;
      
      console.log(`Event "${event.title}": lat=${lat}, lng=${lng}`);
      
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
    console.log('📰 Processing news:', newsRes.data.length);
    
    newsRes.data.forEach(news => {
      const lat = news.latitude ? Number(news.latitude) : null;
      const lng = news.longitude ? Number(news.longitude) : null;
      
      console.log(`News "${news.title}": lat=${lat}, lng=${lng}, location=${news.location}, address=${news.Address}`);
      
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

  // Process businesses with coordinate validation
  if (businessRes.data) {
    console.log('🏢 Processing businesses:', businessRes.data.length);
    businessRes.data.forEach(business => {
      const lat = business.latitude ? Number(business.latitude) : null;
      const lng = business.longitude ? Number(business.longitude) : null;
      
      console.log(`Business "${business.title}": lat=${lat}, lng=${lng}, address=${business.address}`);
      
      items.push({
        id: business.id,
        title: business.title,
        description: business.description || '',
        latitude: (lat && !isNaN(lat)) ? lat : null,
        longitude: (lng && !isNaN(lng)) ? lng : null,
        type: 'business',
        address: business.address,
        category: business.business_type,
        business_type: business.business_type,
        villages: business.villages,
        neighborhoods: business.neighborhood
      });
    });
  }

  // Process local resources with coordinate validation
  if (localResourcesRes.data) {
    console.log('🏪 Processing local resources:', localResourcesRes.data.length);
    localResourcesRes.data.forEach(resource => {
      const lat = resource.latitude ? Number(resource.latitude) : null;
      const lng = resource.longitude ? Number(resource.longitude) : null;
      
      console.log(`Local Resource "${resource.name}": lat=${lat}, lng=${lng}, address=${resource.address}`);
      
      items.push({
        id: resource.id,
        title: resource.name,
        description: resource.description || '',
        latitude: (lat && !isNaN(lat)) ? lat : null,
        longitude: (lng && !isNaN(lng)) ? lng : null,
        type: 'local-service',
        address: resource.address,
        category: resource.category,
        name: resource.name,
        neighborhoods: resource.neighborhood,
        villages: resource.village
      });
    });
  }

  console.log('✅ Unified data processing complete:', {
    totalItems: items.length,
    itemsWithCoords: items.filter(item => item.latitude && item.longitude).length,
    byType: {
      events: items.filter(item => item.type === 'event').length,
      news: items.filter(item => item.type === 'news').length,
      business: items.filter(item => item.type === 'business').length,
      localServices: items.filter(item => item.type === 'local-service').length
    },
    coordsByType: {
      events: items.filter(item => item.type === 'event' && item.latitude && item.longitude).length,
      news: items.filter(item => item.type === 'news' && item.latitude && item.longitude).length,
      business: items.filter(item => item.type === 'business' && item.latitude && item.longitude).length,
      localServices: items.filter(item => item.type === 'local-service' && item.latitude && item.longitude).length
    }
  });
  
  return items;
};
