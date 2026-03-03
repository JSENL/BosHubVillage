import { useState, useEffect, useMemo, useCallback } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { fetchAllUnifiedData } from '@/utils/fetchUnifiedData';
import { filterUnifiedItems } from '@/utils/filterUnifiedItems';

const isDev = import.meta.env.DEV;

const mockGeocode = async (_address: string) => ({ lat: null, lng: null });

interface UseUnifiedFilteringProps {
  selectedCategory?: string;
  selectedNeighborhood?: string;
  selectedVillage?: string;
  selectedTypes: string[];
  selectedType?: string;
  searchTerm?: string;
  dateFilter?: string;
  timeFilter?: string;
  eventDateRange?: any; // DateRange from react-day-picker
  selectedEventDates?: Date[];
}

export const useUnifiedFiltering = ({
  selectedCategory = 'all',
  selectedNeighborhood = 'all',
  selectedVillage = 'all',
  selectedTypes,
  selectedType = 'all',
  searchTerm = '',
  dateFilter = 'all',
  timeFilter = 'all',
  eventDateRange,
  selectedEventDates = []
}: UseUnifiedFilteringProps) => {
  const [allItems, setAllItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const includePastEvents = selectedType === 'past-event' || selectedType === 'all';
      const data = await fetchAllUnifiedData(mockGeocode, includePastEvents);

      if (isDev) {
        console.log('🔄 Fetching unified data...', {
          selectedType,
          includePastEvents,
          total: data.length,
          byType: data.reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        });
      }

      setAllItems(data);
    } catch (err) {
      console.error('❌ Error fetching unified data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterOptions = useMemo(
    () => ({
      selectedCategory,
      selectedNeighborhood,
      selectedVillage,
      selectedTypes,
      selectedType,
      searchTerm,
      dateFilter,
      timeFilter,
      eventDateRange,
      selectedEventDates
    }),
    [
      selectedCategory,
      selectedNeighborhood,
      selectedVillage,
      selectedTypes,
      selectedType,
      searchTerm,
      dateFilter,
      timeFilter,
      eventDateRange,
      selectedEventDates
    ]
  );

  const filteredItems = useMemo(
    () => filterUnifiedItems(allItems, filterOptions),
    [allItems, filterOptions]
  );

  const mappableItems = useMemo(
    () =>
      filteredItems.filter(item => {
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);
        return (
          item.latitude !== null &&
          item.longitude !== null &&
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= -90 && lat <= 90 &&
          lng >= -180 && lng <= 180
        );
      }),
    [filteredItems]
  );

  if (isDev) {
    console.log('🎯 useUnifiedFiltering results:', {
      allItems: allItems.length,
      filteredItems: filteredItems.length,
      mappableItems: mappableItems.length,
      selectedTypes,
      selectedType,
      loading,
      error
    });
  }

  return {
    allItems: filteredItems,
    mappableItems,
    loading,
    error,
    refetch: fetchData
  };
};
