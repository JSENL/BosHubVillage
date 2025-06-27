
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGeocoding } from './useGeocoding';
import { UnifiedItem } from '@/types/unifiedItem';
import { parseVillages } from '@/utils/villageUtils';
import { geocodeNewsItems } from '@/utils/geocodeNewsItems';
import { fetchAllUnifiedData } from '@/utils/fetchUnifiedData';
import { filterUnifiedItems } from '@/utils/filterUnifiedItems';

interface UseUnifiedFilteringProps {
  selectedCategory: string;
  selectedNeighborhood: string;
  selectedVillage: string;
  selectedTypes: string[];
  searchTerm: string;
  dateFilter?: string;
  timeFilter?: string;
}

export const useUnifiedFiltering = ({
  selectedCategory,
  selectedNeighborhood,
  selectedVillage,
  selectedTypes,
  searchTerm,
  dateFilter = '',
  timeFilter = 'all'
}: UseUnifiedFilteringProps) => {
  const [allItems, setAllItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { geocode } = useGeocoding();

  // Fetch all data from Supabase
  const fetchAllData = async () => {
    try {
      console.log('Fetching unified data from all tables...');
      
      const items = await fetchAllUnifiedData(geocode);
      
      console.log('Fetched unified items:', items);
      setAllItems(items);
    } catch (error) {
      console.error('Error fetching unified data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on all criteria
  const filteredItems = useMemo(() => {
    return filterUnifiedItems(allItems, {
      selectedTypes,
      searchTerm,
      selectedCategory,
      selectedNeighborhood,
      selectedVillage,
      dateFilter,
      timeFilter
    });
  }, [allItems, selectedTypes, searchTerm, selectedCategory, selectedNeighborhood, selectedVillage, dateFilter, timeFilter]);

  // Get only items with coordinates for map display
  const mappableItems = useMemo(() => {
    return filteredItems.filter(item => item.latitude !== null && item.longitude !== null);
  }, [filteredItems]);

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    allItems: filteredItems,
    mappableItems,
    loading,
    refetch: fetchAllData
  };
};
