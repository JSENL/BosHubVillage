import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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

const DATA_QUERY_KEYS = [
  ['events'],
  ['news'],
  ['business'],
  ['business-submissions'],
  ['local-resources'],
  ['local-resource-submissions'],
] as const;

export const useDataLoader = () => {
  const queryClient = useQueryClient();

  // Raw data hooks (with error/refetch where available)
  const { events, loading: eventsLoading, isError: eventsError, error: eventsErrorObj } = useEvents();
  const { data: news, isLoading: newsLoading, isError: newsError, error: newsErrorObj } = useNews();
  const { data: businesses, isLoading: businessLoading, isError: businessError, error: businessErrorObj } = useBusiness();
  const { submissions: businessSubmissions, loading: businessSubmissionsLoading, isError: businessSubmissionsError, error: businessSubmissionsErrorObj } = useBusinessSubmissions();
  const { data: localServices, isLoading: localServicesLoading, isError: localServicesError, error: localServicesErrorObj } = useLocalServices();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading, isError: localServiceSubmissionsError, error: localServiceSubmissionsErrorObj } = useLocalServiceSubmissions();

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

  const hasError = eventsError || newsError || businessError || businessSubmissionsError ||
                   localServicesError || localServiceSubmissionsError;
  const errorMessage = useMemo(() => {
    if (!hasError) return null;
    const err = eventsErrorObj ?? newsErrorObj ?? businessErrorObj ?? businessSubmissionsErrorObj ??
      localServicesErrorObj ?? localServiceSubmissionsErrorObj;
    return err?.message ?? 'Failed to load content. Please try again.';
  }, [hasError, eventsErrorObj, newsErrorObj, businessErrorObj, businessSubmissionsErrorObj, localServicesErrorObj, localServiceSubmissionsErrorObj]);

  const refetch = useCallback(() => {
    DATA_QUERY_KEYS.forEach((key) => queryClient.refetchQueries({ queryKey: key }));
  }, [queryClient]);

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
    error: errorMessage,
    refetch,
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