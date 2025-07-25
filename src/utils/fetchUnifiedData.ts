
import { supabase } from '@/integrations/supabase/client';
import { UnifiedItem } from '@/types/unifiedItem';
import { geocodeNewsItems } from './geocodeNewsItems';
import { mockBusinesses } from '@/data/mockBusiness';

export const fetchAllUnifiedData = async (geocode: (address: string) => Promise<any>): Promise<UnifiedItem[]> => {
  console.log('🔄 Starting unified data fetch...');
  
  const [eventsRes, newsRes, localResourcesRes] = await Promise.all([
    supabase.from('events').select('*').order('created_at', { ascending: false }),
    supabase.from('news').select('*').order('date_posted', { ascending: false }),
    supabase.from('local_resources').select('*').order('created_at', { ascending: false })
  ]);

  // Use mock data for businesses
  const businessRes = { data: mockBusinesses, error: null };

  console.log('📊 Database fetch results:', {
    events: { count: eventsRes.data?.length || 0, error: eventsRes.error },
    news: { count: newsRes.data?.length || 0, error: newsRes.error },
    business: { count: businessRes.data?.length || 0, error: businessRes.error, source: 'mock' },
    localResources: { count: localResourcesRes.data?.length || 0, error: localResourcesRes.error }
  });

  // Log specific business data for debugging
  if (businessRes.data && businessRes.data.length > 0) {
    console.log('🏢 Business data details (from mock):', businessRes.data.map(b => ({
      id: b.id,
      title: b.title,
      lat: b.latitude,
      lng: b.longitude,
      address: b.address
    })));
  } else {
    console.log('🚨 No business data found in mock data');
  }

  if (eventsRes.error) {
    console.error('❌ Error fetching events:', eventsRes.error);
  }
  if (newsRes.error) {
    console.error('❌ Error fetching news:', newsRes.error);
  }
  // No error handling needed for mock business data
  if (localResourcesRes.error) {
    console.error('❌ Error fetching local resources:', localResourcesRes.error);
  }

  const items: UnifiedItem[] = [];

  // Process events with enhanced coordinate validation and address support
  if (eventsRes.data) {
    console.log('📅 Processing events:', eventsRes.data.length);
    eventsRes.data.forEach((event, index) => {
      const lat = event.latitude ? Number(event.latitude) : null;
      const lng = event.longitude ? Number(event.longitude) : null;
      
      console.log(`Event ${index + 1} "${event.title}": lat=${lat}, lng=${lng}, location=${event.location}, address=${event.address}`);
      
      items.push({
        id: event.id,
        title: event.title,
        description: event.description || '',
        latitude: (lat !== null && !isNaN(lat) && lat !== 0) ? lat : null,
        longitude: (lng !== null && !isNaN(lng) && lng !== 0) ? lng : null,
        type: 'event',
        location: event.location,
        address: event.address || event.location,
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
    
    newsRes.data.forEach((news, index) => {
      const lat = news.latitude ? Number(news.latitude) : null;
      const lng = news.longitude ? Number(news.longitude) : null;
      
      console.log(`News ${index + 1} "${news.title}": lat=${lat}, lng=${lng}, location=${news.location}, address=${news.Address}`);
      
      items.push({
        id: news.id,
        title: news.title,
        description: news.content || '',
        latitude: (lat !== null && !isNaN(lat) && lat !== 0) ? lat : null,
        longitude: (lng !== null && !isNaN(lng) && lng !== 0) ? lng : null,
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

  // Process businesses with coordinate validation (from mock data)
  if (businessRes.data) {
    console.log('🏢 Processing businesses from mock data:', businessRes.data.length);
    businessRes.data.forEach((business, index) => {
      const lat = business.latitude ? Number(business.latitude) : null;
      const lng = business.longitude ? Number(business.longitude) : null;
      
      console.log(`Business ${index + 1} "${business.title}": lat=${lat}, lng=${lng}, address=${business.address}`);
      
      const item = {
        id: business.id,
        title: business.title,
        description: business.description || '',
        latitude: (lat !== null && !isNaN(lat) && lat !== 0) ? lat : null,
        longitude: (lng !== null && !isNaN(lng) && lng !== 0) ? lng : null,
        type: 'business' as const,
        address: business.address,
        category: business.business_type,
        business_type: business.business_type,
        villages: business.villages,
        neighborhoods: business.neighborhood,
        originalData: business
      };
      
      console.log(`🏢 Transformed business item:`, item);
      items.push(item);
    });
  }

  // Process local resources with coordinate validation
  if (localResourcesRes.data) {
    console.log('🏪 Processing local resources:', localResourcesRes.data.length);
    localResourcesRes.data.forEach((resource, index) => {
      const lat = resource.latitude ? Number(resource.latitude) : null;
      const lng = resource.longitude ? Number(resource.longitude) : null;
      
      console.log(`Local Resource ${index + 1} "${resource.name}": lat=${lat}, lng=${lng}, address=${resource.address}`);
      
      items.push({
        id: resource.id,
        title: resource.name,
        description: resource.description || '',
        latitude: (lat !== null && !isNaN(lat) && lat !== 0) ? lat : null,
        longitude: (lng !== null && !isNaN(lng) && lng !== 0) ? lng : null,
        type: 'local-service',
        address: resource.address,
        category: resource.category,
        name: resource.name,
        neighborhoods: resource.neighborhood,
        villages: resource.village
      });
    });
  }

  // Filter out items with invalid coordinates
  const validItems = items.filter(item => {
    const hasValidCoords = item.latitude !== null && 
                          item.longitude !== null && 
                          !isNaN(Number(item.latitude)) && 
                          !isNaN(Number(item.longitude)) &&
                          Number(item.latitude) !== 0 &&
                          Number(item.longitude) !== 0;
    
    if (!hasValidCoords) {
      console.log(`⚠️ Excluding item "${item.title}" - invalid coordinates:`, {
        lat: item.latitude,
        lng: item.longitude
      });
    }
    
    return hasValidCoords;
  });

  console.log('✅ Unified data processing complete:', {
    totalItemsFetched: items.length,
    validItemsWithCoords: validItems.length,
    byType: {
      events: items.filter(item => item.type === 'event').length,
      news: items.filter(item => item.type === 'news').length,
      business: items.filter(item => item.type === 'business').length,
      localServices: items.filter(item => item.type === 'local-service').length
    },
    validCoordsByType: {
      events: validItems.filter(item => item.type === 'event').length,
      news: validItems.filter(item => item.type === 'news').length,
      business: validItems.filter(item => item.type === 'business').length,
      localServices: validItems.filter(item => item.type === 'local-service').length
    }
  });
  
  return validItems;
};
