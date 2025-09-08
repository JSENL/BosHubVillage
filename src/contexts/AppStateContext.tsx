import { createContext, useContext, ReactNode } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { DateRange } from 'react-day-picker';

// Combined context for app-wide state management
interface AppStateContextType {
  // Data state
  allItems: UnifiedItem[];
  isLoading: boolean;
  
  // Filter state
  filters: {
    selectedType: string;
    selectedCategory: string;
    selectedNeighborhood: string;
    selectedVillage: string;
    searchTerm: string;
    eventDateRange?: DateRange;
    selectedEventDates: Date[];
    viewMode: 'map' | 'list';
  };
  
  // Filter actions
  updateFilter: <K extends keyof AppStateContextType['filters']>(
    key: K, 
    value: AppStateContextType['filters'][K]
  ) => void;
  clearAllFilters: () => void;
  
  // Computed state
  filteredItems: UnifiedItem[];
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export { AppStateContext };