import { useState, createContext, useContext, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';
import { UnifiedItem } from "@/types/unifiedItem";

interface FilterContextType {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (neighborhood: string) => void;
  selectedVillage: string;
  setSelectedVillage: (village: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  eventDateRange?: DateRange;
  setEventDateRange: (range?: DateRange) => void;
  selectedEventDates: Date[];
  setSelectedEventDates: (dates: Date[]) => void;
  viewMode: 'map' | 'list';
  setViewMode: (mode: 'map' | 'list') => void;
  filteredItems: UnifiedItem[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
  allItems: UnifiedItem[];
}

export const FilterProvider = ({ children, allItems }: FilterProviderProps) => {
  // Filter states
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventDateRange, setEventDateRange] = useState<DateRange | undefined>();
  const [selectedEventDates, setSelectedEventDates] = useState<Date[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Filter items based on criteria
  console.log('🔍 FilterProvider filtering - Filter State Analysis:', { 
    selectedType, 
    searchTerm, 
    selectedCategory, 
    selectedNeighborhood, 
    selectedVillage, 
    eventDateRange: eventDateRange ? {
      from: eventDateRange.from?.toDateString(),
      to: eventDateRange.to?.toDateString()
    } : null, 
    selectedEventDatesCount: selectedEventDates.length,
    totalItemsToFilter: allItems.length,
    eventItemsCount: allItems.filter(item => item.type === 'event').length
  });
  
  const filteredItems = allItems.filter(item => {
    // Exclude past events
    if (item.type === 'event' && item.date) {
      const eventDate = new Date(item.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      
      if (eventDate < today) {
        return false; // Exclude past events
      }
    }

    // Type filter
    const matchesType = selectedType === 'all' || item.type === selectedType;

    // Search term filter
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'all' || 
      item.category === selectedCategory ||
      item.business_type === selectedCategory;

    // Neighborhood filter
    const matchesNeighborhood = selectedNeighborhood === 'all' || 
      (item.neighborhoods && item.neighborhoods.includes(selectedNeighborhood.replace('-', ' '))) ||
      (item.location && item.location.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase()));

    // Village filter (enhanced for all item types)
    const matchesVillage = selectedVillage === 'all' || (() => {
      // Debug logging for village filtering
      if (selectedVillage !== 'all') {
        console.log(`🏘️ Village filter check for ${item.title}:`, {
          selectedVillage,
          itemType: item.type,
          itemVillages: item.villages,
          hasVillages: !!item.villages
        });
      }
      
      if (!item.villages) return false;
      
      // Handle both single village string and array of villages
      const itemVillages = Array.isArray(item.villages) ? item.villages : [item.villages];
      
      return itemVillages.some(village => {
        const normalized = village.toLowerCase().replace(/\s+/g, '-');
        const selectedNormalized = selectedVillage.toLowerCase();
        const selectedWithSpaces = selectedVillage.replace('-', ' ').toLowerCase();
        
        return normalized === selectedNormalized ||
               village.toLowerCase() === selectedWithSpaces ||
               village.toLowerCase().includes(selectedWithSpaces) ||
               selectedWithSpaces.includes(village.toLowerCase());
      });
    })();

    // Event date filter (only for events)
    const matchesEventDate = item.type !== 'event' || (() => {
      if (!item.date) return false;
      
      const itemDate = new Date(item.date);
      
      // Check if any individual dates are selected
      if (selectedEventDates.length > 0) {
        const matches = selectedEventDates.some(selectedDate => 
          selectedDate.toDateString() === itemDate.toDateString()
        );
        
        console.log('📅 FilterProvider: Individual date filtering for event:', {
          eventTitle: item.title,
          itemDate: itemDate.toDateString(),
          selectedEventDates: selectedEventDates.map(d => d.toDateString()),
          matches
        });
        
        return matches;
      }
      
      // Check if date range is selected
      if (eventDateRange?.from) {
        const fromDate = new Date(eventDateRange.from);
        const toDate = eventDateRange.to ? new Date(eventDateRange.to) : fromDate;
        
        // Set to start/end of day for accurate comparison
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        
        const matches = itemDate >= fromDate && itemDate <= toDate;
        
        console.log('📅 FilterProvider: Date range filtering for event:', {
          eventTitle: item.title,
          itemDate: itemDate.toDateString(),
          fromDate: fromDate.toDateString(),
          toDate: toDate.toDateString(),
          matches
        });
        
        return matches;
      }
      
      // If no date filters selected, show all events
      return true;
    })();

    return matchesType && matchesSearch && matchesCategory && matchesNeighborhood && matchesVillage && matchesEventDate;
  });

  // Debug logging for filtering results
  if (selectedVillage !== 'all') {
    const villageDebug = {
      selectedVillage,
      totalItems: allItems.length,
      filteredItems: filteredItems.length,
      itemsWithVillages: allItems.filter(item => !!item.villages).length,
      villageBreakdown: allItems.reduce((acc, item) => {
        if (item.villages) {
          acc[item.type] = (acc[item.type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    };
    console.log('🏘️ Village filtering summary:', villageDebug);
  }

  console.log('✅ FilterProvider filtering results:', {
    totalItems: allItems.length,
    filteredItems: filteredItems.length,
    eventItems: filteredItems.filter(item => item.type === 'event').length,
    businessItems: filteredItems.filter(item => item.type === 'business').length,
    localServiceItems: filteredItems.filter(item => item.type === 'local-service').length,
    hasDateFilters: selectedEventDates.length > 0 || !!eventDateRange?.from,
    dateFilterType: selectedEventDates.length > 0 ? 'individual' : eventDateRange?.from ? 'range' : 'none'
  });

  const value = {
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    selectedVillage,
    setSelectedVillage,
    searchTerm,
    setSearchTerm,
    eventDateRange,
    setEventDateRange,
    selectedEventDates,
    setSelectedEventDates,
    viewMode,
    setViewMode,
    filteredItems
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};