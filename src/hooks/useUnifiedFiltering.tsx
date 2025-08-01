
import { useState, useEffect } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { fetchAllUnifiedData } from '@/utils/fetchUnifiedData';
import { filterUnifiedItems } from '@/utils/filterUnifiedItems';

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

  // Simple geocoding function for the fetchAllUnifiedData call
  const mockGeocode = async (address: string) => {
    console.log('Mock geocoding for address:', address);
    return { lat: null, lng: null };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching unified data...');
      // Include past events if the selected type is 'past-event' or 'all'
      const includePastEvents = selectedType === 'past-event' || selectedType === 'all';
      const data = await fetchAllUnifiedData(mockGeocode, includePastEvents);
      
      console.log('📊 Raw data fetched:', {
        total: data.length,
        byType: data.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        withCoords: data.filter(item => 
          item.latitude !== null && 
          item.longitude !== null &&
          !isNaN(Number(item.latitude)) &&
          !isNaN(Number(item.longitude))
        ).length
      });
      
      setAllItems(data);
    } catch (err) {
      console.error('❌ Error fetching unified data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedType]); // Re-fetch when selectedType changes to include/exclude past events

  // Filter items based on criteria
  const filteredItems = filterUnifiedItems(allItems, {
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
  });

  // Get mappable items (items with valid coordinates)
  const mappableItems = filteredItems.filter(item => {
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);
    return item.latitude !== null && 
           item.longitude !== null &&
           !isNaN(lat) &&
           !isNaN(lng) &&
           lat >= -90 && lat <= 90 &&
           lng >= -180 && lng <= 180;
  });

  console.log('🎯 useUnifiedFiltering results:', {
    allItems: allItems.length,
    filteredItems: filteredItems.length,
    mappableItems: mappableItems.length,
    selectedTypes,
    selectedType,
    loading,
    error
  });

  return {
    allItems: filteredItems,
    mappableItems,
    loading,
    error,
    refetch: fetchData
  };
};
