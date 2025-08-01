
import { UnifiedItem } from '@/types/unifiedItem';
import { parseVillages } from './villageUtils';
import { matchesCategory } from '@/hooks/useUnifiedCategories';

interface FilterCriteria {
  selectedTypes: string[];
  selectedType: string;
  searchTerm: string;
  selectedCategory: string;
  selectedNeighborhood: string;
  selectedVillage: string;
  dateFilter: string;
  timeFilter: string;
  eventDateRange?: any; // DateRange from react-day-picker
  selectedEventDates?: Date[];
}

export const filterUnifiedItems = (items: UnifiedItem[], criteria: FilterCriteria): UnifiedItem[] => {
  const {
    selectedTypes,
    selectedType,
    searchTerm,
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    dateFilter,
    timeFilter,
    eventDateRange,
    selectedEventDates = []
  } = criteria;

  console.log('🔍 Filtering items:', {
    totalItems: items.length,
    selectedType,
    pastEventItems: items.filter(item => item.type === 'past-event').length
  });

  const filteredItems = items.filter(item => {
    // Exclude past events from display
    if (item.type === 'past-event') return false;
    
    // Type filter (new unified type filter)
    const matchesUnifiedType = selectedType === 'all' || item.type === selectedType;
    
    // Legacy type filter for backward compatibility
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);

    // Search term filter
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter - using unified category matching
    const matchesCategoryFilter = matchesCategory(item, selectedCategory);

    // Neighborhood filter
    const matchesNeighborhood = selectedNeighborhood === 'all' || 
      (item.neighborhoods && item.neighborhoods.includes(selectedNeighborhood.replace('-', ' '))) ||
      (item.location && item.location.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase()));

    // Village filter
    const matchesVillage = selectedVillage === 'all' || (() => {
      const itemVillages = parseVillages(item.villages);
      return itemVillages.some(village => 
        village.toLowerCase().replace(/\s+/g, '-') === selectedVillage ||
        village.toLowerCase() === selectedVillage.replace('-', ' ').toLowerCase()
      );
    })();

    // Date filter (handles individual dates, date ranges, and legacy exact match)
    const matchesDate = item.type !== 'event' || (() => {
      // If no date filters are set, show all events
      if (!dateFilter || dateFilter === '' || dateFilter === 'all') {
        if (selectedEventDates.length === 0 && !eventDateRange?.from) {
          return true;
        }
      }

      // Legacy exact date match
      if (dateFilter && dateFilter !== '' && dateFilter !== 'all') {
        return item.date === dateFilter;
      }

      const itemDate = item.date ? new Date(item.date) : null;
      if (!itemDate) return false;

      // Check individual selected dates
      if (selectedEventDates.length > 0) {
        return selectedEventDates.some(selectedDate => {
          const selectedDateStr = selectedDate.toISOString().split('T')[0];
          const itemDateStr = itemDate.toISOString().split('T')[0];
          return selectedDateStr === itemDateStr;
        });
      }

      // Check date range
      if (eventDateRange?.from) {
        const rangeStart = new Date(eventDateRange.from);
        const rangeEnd = eventDateRange.to ? new Date(eventDateRange.to) : rangeStart;
        
        // Set times to compare just dates
        rangeStart.setHours(0, 0, 0, 0);
        rangeEnd.setHours(23, 59, 59, 999);
        itemDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
        
        return itemDate >= rangeStart && itemDate <= rangeEnd;
      }

      return true;
    })();

    // Time filter (only for events)
    const matchesTime = item.type !== 'event' || timeFilter === 'all' || (() => {
      if (!item.start_time) return timeFilter === 'all';
      
      const eventHour = parseInt(item.start_time.split(':')[0]);
      
      switch (timeFilter) {
        case 'morning':
          return eventHour >= 6 && eventHour < 12;
        case 'afternoon':
          return eventHour >= 12 && eventHour < 18;
        case 'evening':
          return eventHour >= 18 || eventHour < 6;
        default:
          return true;
      }
    })();

    return matchesUnifiedType && matchesType && matchesSearch && matchesCategoryFilter && matchesNeighborhood && matchesVillage && matchesDate && matchesTime;
  });
  
  console.log('✅ Filtering complete:', {
    filteredItems: filteredItems.length,
    pastEventItems: filteredItems.filter(item => item.type === 'past-event').length
  });
  
  return filteredItems;
};
