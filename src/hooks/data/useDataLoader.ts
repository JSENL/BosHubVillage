import { useState, useEffect, useMemo } from 'react';
import { useEvents } from "@/hooks/useEvents";
import { useNews } from "@/hooks/useNews";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { UnifiedItem } from "@/types/unifiedItem";
import { transformDataToUnifiedItems } from '@/utils/data/dataTransformers';
import { geocodeItemsIfNeeded } from '@/utils/data/geocodingService';

export const useDataLoader = () => {
  // Raw data hooks
  const { events, loading: eventsLoading } = useEvents();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { submissions: businessSubmissions, loading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { data: localServices, isLoading: localServicesLoading } = useLocalServices();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading } = useLocalServiceSubmissions();

  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedItems, setHasGeocodedItems] = useState(false);

  // Transform raw data to unified items (memoized to avoid recalc on every render)
  const allItems = useMemo(
    () =>
      transformDataToUnifiedItems({
        events: events || [],
        news: news || [],
        businesses: businesses || [],
        businessSubmissions: businessSubmissions || [],
        localServices: localServices || [],
        localServiceSubmissions: localServiceSubmissions || [],
      }),
    [
      events,
      news,
      businesses,
      businessSubmissions,
      localServices,
      localServiceSubmissions
    ]
  );

  const isLoading = eventsLoading || newsLoading || 
                   businessLoading || businessSubmissionsLoading ||
                   localServicesLoading || localServiceSubmissionsLoading;

  // Geocode items that need geocoding
  useEffect(() => {
    const performGeocoding = async () => {
      if (!isReady || hasGeocodedItems || isLoading) {
        return;
      }

      try {
        await geocodeItemsIfNeeded({
          events: events || [],
          news: news || [],
          businesses: businesses || [],
          geocode,
        });
        setHasGeocodedItems(true);
      } catch (error) {
        console.error('Error geocoding items:', error);
      }
    };

    performGeocoding();
  }, [events, news, businesses, isReady, geocode, hasGeocodedItems, isLoading]);

  return {
    allItems,
    isLoading,
    rawData: {
      events: events || [],
      news: news || [],
      businesses: businesses || [],
      businessSubmissions: businessSubmissions || [],
      localServices: localServices || [],
      localServiceSubmissions: localServiceSubmissions || [],
    }
  };
};