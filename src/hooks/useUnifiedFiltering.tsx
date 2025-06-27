
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

  // Fetch all data from Supabase with real-time updates
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

  // Set up real-time subscriptions for all tables
  useEffect(() => {
    const setupRealtimeSubscriptions = () => {
      console.log('Setting up real-time subscriptions...');

      // Events subscription
      const eventsChannel = supabase
        .channel('events-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'events' },
          (payload) => {
            console.log('Events table changed:', payload);
            fetchAllData(); // Refetch all data when events change
          }
        )
        .subscribe();

      // News subscription
      const newsChannel = supabase
        .channel('news-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'news' },
          (payload) => {
            console.log('News table changed:', payload);
            fetchAllData(); // Refetch all data when news change
          }
        )
        .subscribe();

      // Business subscription
      const businessChannel = supabase
        .channel('business-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'business' },
          (payload) => {
            console.log('Business table changed:', payload);
            fetchAllData(); // Refetch all data when business change
          }
        )
        .subscribe();

      // Local services subscription
      const servicesChannel = supabase
        .channel('services-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'local_services_nonprofits' },
          (payload) => {
            console.log('Local services table changed:', payload);
            fetchAllData(); // Refetch all data when services change
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(eventsChannel);
        supabase.removeChannel(newsChannel);
        supabase.removeChannel(businessChannel);
        supabase.removeChannel(servicesChannel);
      };
    };

    const cleanup = setupRealtimeSubscriptions();
    fetchAllData();

    return cleanup;
  }, []);

  // Filter items based on all criteria with enhanced location matching
  const filteredItems = useMemo(() => {
    console.log('Filtering items with criteria:', {
      selectedTypes: selectedTypes.length,
      searchTerm,
      selectedCategory,
      selectedNeighborhood,
      selectedVillage,
      dateFilter,
      timeFilter
    });

    const filtered = filterUnifiedItems(allItems, {
      selectedTypes,
      searchTerm,
      selectedCategory,
      selectedNeighborhood,
      selectedVillage,
      dateFilter,
      timeFilter
    });

    console.log('Filtered items count:', filtered.length);
    return filtered;
  }, [allItems, selectedTypes, searchTerm, selectedCategory, selectedNeighborhood, selectedVillage, dateFilter, timeFilter]);

  // Get only items with coordinates for map display
  const mappableItems = useMemo(() => {
    const mappable = filteredItems.filter(item => 
      item.latitude !== null && 
      item.longitude !== null &&
      !isNaN(Number(item.latitude)) &&
      !isNaN(Number(item.longitude))
    );
    
    console.log('Mappable items count:', mappable.length);
    return mappable;
  }, [filteredItems]);

  return {
    allItems: filteredItems,
    mappableItems,
    loading,
    refetch: fetchAllData
  };
};
