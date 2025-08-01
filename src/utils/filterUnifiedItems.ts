
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
    timeFilter
  } = criteria;

  return items.filter(item => {
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

    // Date filter (only for events and past events)
    const matchesDate = (item.type !== 'event' && item.type !== 'past-event') || dateFilter === '' || item.date === dateFilter;

    // Time filter (only for events and past events)
    const matchesTime = (item.type !== 'event' && item.type !== 'past-event') || timeFilter === 'all' || (() => {
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
};
