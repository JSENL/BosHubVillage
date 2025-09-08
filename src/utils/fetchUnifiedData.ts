
import { supabase } from '@/integrations/supabase/client';
import { UnifiedItem } from '@/types/unifiedItem';
import { geocodeNewsItems } from './geocodeNewsItems';

export const fetchAllUnifiedData = async (
  geocode: (address: string) => Promise<any>,
  includePastEvents = false
): Promise<UnifiedItem[]> => {
  console.log('🔄 Starting unified data fetch...');
  
  const currentDate = new Date().toISOString().split('T')[0];
  const [eventsRes, pastEventsRes, newsRes, localResourcesRes, businessRes] = await Promise.all([
    // Remove date ordering to ensure sponsored prioritization works
    supabase.from('events').select('*').gte('date', currentDate),
    includePastEvents ? supabase.from('past_events').select('*') : Promise.resolve({ data: [], error: null }),
    supabase.from('news').select('*'),
    supabase.from('local_resources').select('*'),
    supabase.from('business').select('*')
  ]);

  console.log('📊 Database fetch results:', {
    events: { count: eventsRes.data?.length || 0, error: eventsRes.error },
    pastEvents: { count: pastEventsRes.data?.length || 0, error: pastEventsRes.error },
    news: { count: newsRes.data?.length || 0, error: newsRes.error },
    business: { count: businessRes.data?.length || 0, error: businessRes.error },
    localResources: { count: localResourcesRes.data?.length || 0, error: localResourcesRes.error }
  });

  // Log specific business data for debugging
  if (businessRes.data && businessRes.data.length > 0) {
    console.log('🏢 Business data details (from Supabase):', businessRes.data.map(b => ({
      id: b.id,
      title: b.title,
      lat: b.latitude,
      lng: b.longitude,
      address: b.address
    })));
  } else {
    console.log('🚨 No business data found in Supabase');
  }

  if (eventsRes.error) {
    console.error('❌ Error fetching events:', eventsRes.error);
  }
  if (pastEventsRes.error) {
    console.error('❌ Error fetching past events:', pastEventsRes.error);
  }
  if (newsRes.error) {
    console.error('❌ Error fetching news:', newsRes.error);
  }
  if (businessRes.error) {
    console.error('❌ Error fetching businesses:', businessRes.error);
  }
  if (localResourcesRes.error) {
    console.error('❌ Error fetching local resources:', localResourcesRes.error);
  }

  const items: UnifiedItem[] = [];

  // Process current events with enhanced coordinate validation and address support
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
        villages: event.villages,
        is_sponsored: event.is_sponsored || false
      });
    });
  }

  // Past events are kept in database but not displayed on map or UI

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
        date: news.date_posted,
        is_sponsored: news.is_sponsored || false
      });
    });
  }

  // Process businesses with coordinate validation (from Supabase)
  if (businessRes.data) {
    console.log('🏢 Processing businesses from Supabase:', businessRes.data.length);
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
        originalData: business,
        is_sponsored: business.is_sponsored || false
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
        villages: resource.village,
        is_sponsored: resource.is_sponsored || false
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
      pastEvents: items.filter(item => item.type === 'past-event').length,
      news: items.filter(item => item.type === 'news').length,
      business: items.filter(item => item.type === 'business').length,
      localServices: items.filter(item => item.type === 'local-service').length
    },
    validCoordsByType: {
      events: validItems.filter(item => item.type === 'event').length,
      pastEvents: validItems.filter(item => item.type === 'past-event').length,
      news: validItems.filter(item => item.type === 'news').length,
      business: validItems.filter(item => item.type === 'business').length,
      localServices: validItems.filter(item => item.type === 'local-service').length
    }
  });
  
  // Sort items to prioritize sponsored content (sponsored items ALWAYS first)
  const sortedItems = validItems.sort((a, b) => {
    const aSponsored = (a as any).is_sponsored || false;
    const bSponsored = (b as any).is_sponsored || false;
    
    // Sponsored items ALWAYS come first, regardless of any other factors
    if (aSponsored && !bSponsored) return -1;
    if (!aSponsored && bSponsored) return 1;
    
    // Among sponsored items, sort by creation date (newest first)
    if (aSponsored && bSponsored) {
      const aDate = new Date(a.originalData?.created_at || a.originalData?.date_posted || 0);
      const bDate = new Date(b.originalData?.created_at || b.originalData?.date_posted || 0);
      return bDate.getTime() - aDate.getTime();
    }
    
    // Among non-sponsored items, maintain original order or sort by date
    const aDate = new Date(a.originalData?.created_at || a.originalData?.date_posted || 0);
    const bDate = new Date(b.originalData?.created_at || b.originalData?.date_posted || 0);
    return bDate.getTime() - aDate.getTime();
  });
  
  console.log('🎯 Sponsored items prioritized:', {
    totalItems: sortedItems.length,
    sponsoredItems: sortedItems.filter(item => (item as any).is_sponsored).length,
    regularItems: sortedItems.filter(item => !(item as any).is_sponsored).length,
    firstFiveItems: sortedItems.slice(0, 5).map(item => ({
      title: item.title,
      sponsored: (item as any).is_sponsored || false,
      type: item.type
    }))
  });
  
  return sortedItems;
};
