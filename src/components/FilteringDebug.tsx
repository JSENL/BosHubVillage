import { useEffect } from 'react';

interface FilteringDebugProps {
  selectedType: string;
  searchTerm: string;
  selectedCategory: string;
  selectedNeighborhood: string;
  selectedVillage: string;
  allItems: any[];
  filteredItems: any[];
}

export const FilteringDebug = ({
  selectedType,
  searchTerm,
  selectedCategory,
  selectedNeighborhood,
  selectedVillage,
  allItems,
  filteredItems
}: FilteringDebugProps) => {
  useEffect(() => {
    console.log('🔍 FILTERING DEBUG:', {
      selectedType,
      searchTerm,
      selectedCategory,
      selectedNeighborhood,
      selectedVillage,
      totalItems: allItems.length,
      filteredItems: filteredItems.length,
      eventItems: allItems.filter(item => item.type === 'event').length,
      filteredEventItems: filteredItems.filter(item => item.type === 'event').length,
      futureEventItems: allItems.filter(item => {
        if (item.type === 'event' && item.date) {
          const eventDate = new Date(item.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return eventDate >= today;
        }
        return false;
      }).length,
      sampleEvents: allItems.filter(item => item.type === 'event').slice(0, 3).map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        type: event.type,
        hasCoords: !!(event.latitude && event.longitude)
      }))
    });
  }, [selectedType, searchTerm, selectedCategory, selectedNeighborhood, selectedVillage, allItems, filteredItems]);

  return null; // This component only logs, doesn't render
};