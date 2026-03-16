import { useState, ReactNode, useMemo, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { AppStateContext } from './AppStateContext';
import { UnifiedItem } from '@/types/unifiedItem';
import { useDataLoader } from '@/hooks/data/useDataLoader';
import { useItemFiltering } from '@/hooks/filtering/useItemFiltering';
import { useGeolocation } from '@/hooks/useGeolocation';

interface AppStateProviderProps {
  children: ReactNode;
}

const initialFilters = {
  selectedType: 'all',
  selectedCategory: 'all',
  selectedNeighborhood: 'all',
  selectedVillage: 'all',
  searchTerm: '',
  eventDateRange: undefined as DateRange | undefined,
  selectedEventDates: [] as Date[],
  viewMode: 'map' as const,
  maxDistance: null as number | null,
};

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  // Data loading
  const { allItems, isLoading, error, refetch } = useDataLoader();
  
  // Geolocation
  const { 
    location: userLocation, 
    isLoading: isLoadingLocation, 
    requestLocation,
    clearLocation 
  } = useGeolocation();
  
  // Filter state
  const [filters, setFilters] = useState(initialFilters);

  // Filter actions (stable callback to avoid context consumer re-renders)
  const updateFilter = useCallback(
    <K extends keyof typeof initialFilters>(key: K, value: typeof initialFilters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
    []
  );
  
  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
    clearLocation();
  }, [clearLocation]);
  
  // Filtered items using custom hook - now includes distance filtering
  const filteredItems = useItemFiltering(allItems, filters, userLocation);
  
  const value = useMemo(() => ({
    allItems,
    isLoading,
    error,
    refetch,
    filters,
    userLocation,
    isLoadingLocation,
    requestLocation,
    clearLocation,
    updateFilter,
    clearAllFilters,
    filteredItems,
  }), [allItems, isLoading, error, refetch, filters, filteredItems, userLocation, isLoadingLocation, requestLocation, clearLocation, clearAllFilters]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};