import { useState, ReactNode, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { AppStateContext } from './AppStateContext';
import { UnifiedItem } from '@/types/unifiedItem';
import { useDataLoader } from '@/hooks/data/useDataLoader';
import { useItemFiltering } from '@/hooks/filtering/useItemFiltering';

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
};

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  // Data loading
  const { allItems, isLoading } = useDataLoader();
  
  // Filter state
  const [filters, setFilters] = useState(initialFilters);
  
  // Filter actions
  const updateFilter = <K extends keyof typeof filters>(
    key: K, 
    value: typeof filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearAllFilters = () => {
    setFilters(initialFilters);
  };
  
  // Filtered items using custom hook
  const filteredItems = useItemFiltering(allItems, filters);
  
  const value = useMemo(() => ({
    allItems,
    isLoading,
    filters,
    updateFilter,
    clearAllFilters,
    filteredItems,
  }), [allItems, isLoading, filters, filteredItems]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};