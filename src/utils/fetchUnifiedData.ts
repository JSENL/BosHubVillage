
import { supabase } from '@/integrations/supabase/client';
import { UnifiedItem, TranslationsObject } from '@/types/unifiedItem';
import { geocodeNewsItems } from './geocodeNewsItems';
import { Json } from '@/integrations/supabase/types';

const isDev = import.meta.env.DEV;

// Helper to safely cast JSON to TranslationsObject
const toTranslationsObject = (json: Json | undefined | null): TranslationsObject | undefined => {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return undefined;
  }
  return json as TranslationsObject;
};

export const fetchAllUnifiedData = async (
  geocode: (address: string) => Promise<any>,
  includePastEvents = false
): Promise<UnifiedItem[]> => {
  if (isDev) console.log('🔄 Starting unified data fetch...');

  const currentDate = new Date().toISOString().split('T')[0];
  const [eventsRes, pastEventsRes, newsRes, localResourcesRes, businessRes] = await Promise.all([
    supabase.from('events').select('*').gte('date', currentDate).order('created_at', { ascending: false }),
    includePastEvents ? supabase.from('past_events').select('*').order('date', { ascending: false }) : Promise.resolve({ data: [], error: null }),
    supabase.from('news').select('*').order('date_posted', { ascending: false }),
    supabase.from('local_resources').select('*').order('created_at', { ascending: false }),
    supabase.from('business').select('*').order('created_at', { ascending: false })
  ]);

  if (isDev) {
    console.log('📊 Database fetch results:', {
      events: { count: eventsRes.data?.length || 0, error: eventsRes.error },
      pastEvents: { count: pastEventsRes.data?.length || 0, error: pastEventsRes.error },
      news: { count: newsRes.data?.length || 0, error: newsRes.error },
      business: { count: businessRes.data?.length || 0, error: businessRes.error },
      localResources: { count: localResourcesRes.data?.length || 0, error: localResourcesRes.error }
    });
    if (businessRes.data && businessRes.data.length > 0) {
      console.log('🏢 Business data details (from Supabase):', businessRes.data.map(b => ({
        id: b.id,
        title: b.title,
        lat: b.latitude,
        lng: b.longitude,
        address: b.address
      })));
    } else if (!businessRes.data?.length) {
      console.log('🚨 No business data found in Supabase');
    }
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
    if (isDev) console.log('📅 Processing events:', eventsRes.data.length);
    eventsRes.data.forEach((event) => {
      const lat = event.latitude ? Number(event.latitude) : null;
      const lng = event.longitude ? Number(event.longitude) : null;

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
        // Translation fields
        title_translations: toTranslationsObject(event.title_translations),
        description_translations: toTranslationsObject(event.description_translations),
        location_translations: toTranslationsObject(event.location_translations),
        category_translations: toTranslationsObject(event.category_translations),
      });
    });
  }

  // Past events are kept in database but not displayed on map or UI

  // Process news with enhanced geocoding and coordinate validation
  if (newsRes.data) {
    if (isDev) console.log('📰 Processing news:', newsRes.data.length);
    newsRes.data.forEach((news) => {
      const lat = news.latitude ? Number(news.latitude) : null;
      const lng = news.longitude ? Number(news.longitude) : null;

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
        // Translation fields
        title_translations: toTranslationsObject(news.title_translations),
        content_translations: toTranslationsObject(news.content_translations),
        description_translations: toTranslationsObject(news.content_translations),
        location_translations: toTranslationsObject(news.location_translations),
      });
    });
  }

  // Process businesses with coordinate validation (from Supabase)
  if (businessRes.data) {
    if (isDev) console.log('🏢 Processing businesses from Supabase:', businessRes.data.length);
    businessRes.data.forEach((business) => {
      const lat = business.latitude ? Number(business.latitude) : null;
      const lng = business.longitude ? Number(business.longitude) : null;

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
        // Translation fields
        title_translations: toTranslationsObject(business.title_translations),
        description_translations: toTranslationsObject(business.description_translations),
        address_translations: toTranslationsObject(business.address_translations),
        short_description_translations: toTranslationsObject(business.short_description_translations),
      };

      items.push(item);
    });
  }

  // Process local resources with coordinate validation
  if (localResourcesRes.data) {
    if (isDev) console.log('🏪 Processing local resources:', localResourcesRes.data.length);
    localResourcesRes.data.forEach((resource) => {
      const lat = resource.latitude ? Number(resource.latitude) : null;
      const lng = resource.longitude ? Number(resource.longitude) : null;

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
        // Translation fields
        name_translations: toTranslationsObject(resource.name_translations),
        title_translations: toTranslationsObject(resource.name_translations),
        description_translations: toTranslationsObject(resource.description_translations),
        address_translations: toTranslationsObject(resource.address_translations),
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

    if (!hasValidCoords && isDev) {
      console.log(`⚠️ Excluding item "${item.title}" - invalid coordinates:`, {
        lat: item.latitude,
        lng: item.longitude
      });
    }

    return hasValidCoords;
  });

  if (isDev) {
    const byType = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const validByType = validItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('✅ Unified data processing complete:', {
      totalItemsFetched: items.length,
      validItemsWithCoords: validItems.length,
      byType,
      validCoordsByType: validByType
    });
  }

  return validItems;
};
