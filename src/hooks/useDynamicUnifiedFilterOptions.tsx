import { useMemo } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';

interface UseDynamicUnifiedFilterOptionsProps {
  allItems: UnifiedItem[];
  selectedType: string;
  selectedNeighborhood: string;
  selectedVillage: string;
  searchTerm: string;
  eventDateRange?: { from?: Date; to?: Date };
  selectedEventDates?: Date[];
}

export const useDynamicUnifiedFilterOptions = ({
  allItems,
  selectedType,
  selectedNeighborhood,
  selectedVillage,
  searchTerm,
  eventDateRange,
  selectedEventDates
}: UseDynamicUnifiedFilterOptionsProps) => {
  
  const availableCategories = useMemo(() => {
    // Safety check - return empty array if allItems is not available
    if (!allItems || !Array.isArray(allItems)) {
      return [];
    }
    
    // Filter items based on all criteria EXCEPT category
    const filteredItems = allItems.filter(item => {
      // Type filter
      const matchesType = selectedType === 'all' || item.type === selectedType;
      
      // Search filter
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Neighborhood filter
      const matchesNeighborhood = selectedNeighborhood === 'all' || 
        item.neighborhoods?.includes(selectedNeighborhood) ||
        item.location?.toLowerCase().includes(selectedNeighborhood.toLowerCase());
      
      // Village filter
      const matchesVillage = selectedVillage === 'all' || 
        (item.villages && Array.isArray(item.villages) && item.villages.includes(selectedVillage)) ||
        (item.villages && typeof item.villages === 'string' && item.villages.includes(selectedVillage));
      
      // Date filter for events
      let matchesDate = true;
      if (item.type === 'event' && item.start_time) {
        const eventDate = new Date(item.start_time);
        
        if (eventDateRange?.from && eventDateRange?.to) {
          matchesDate = eventDate >= eventDateRange.from && eventDate <= eventDateRange.to;
        } else if (selectedEventDates && selectedEventDates.length > 0) {
          matchesDate = selectedEventDates.some(selectedDate => {
            const selectedDateStr = selectedDate.toDateString();
            const eventDateStr = eventDate.toDateString();
            return selectedDateStr === eventDateStr;
          });
        }
      }
      
      return matchesType && matchesSearch && matchesNeighborhood && matchesVillage && matchesDate;
    });
    
    // Extract unique categories from filtered items
    const categorySet = new Set<string>();
    filteredItems.forEach(item => {
      if (item.category) {
        categorySet.add(item.category);
      }
    });
    
    return Array.from(categorySet).sort();
  }, [allItems, selectedType, selectedNeighborhood, selectedVillage, searchTerm, eventDateRange, selectedEventDates]);

  const availableNeighborhoods = useMemo(() => {
    // Safety check - return empty array if allItems is not available
    if (!allItems || !Array.isArray(allItems)) {
      return [];
    }
    
    // Filter items based on all criteria EXCEPT neighborhood
    const filteredItems = allItems.filter(item => {
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVillage = selectedVillage === 'all' || 
        (item.villages && Array.isArray(item.villages) && item.villages.includes(selectedVillage)) ||
        (item.villages && typeof item.villages === 'string' && item.villages.includes(selectedVillage));
      
      let matchesDate = true;
      if (item.type === 'event' && item.start_time) {
        const eventDate = new Date(item.start_time);
        if (eventDateRange?.from && eventDateRange?.to) {
          matchesDate = eventDate >= eventDateRange.from && eventDate <= eventDateRange.to;
        } else if (selectedEventDates && selectedEventDates.length > 0) {
          matchesDate = selectedEventDates.some(selectedDate => {
            const selectedDateStr = selectedDate.toDateString();
            const eventDateStr = eventDate.toDateString();
            return selectedDateStr === eventDateStr;
          });
        }
      }
      
      return matchesType && matchesSearch && matchesVillage && matchesDate;
    });
    
    const neighborhoodSet = new Set<string>();
    filteredItems.forEach(item => {
      if (item.neighborhoods && Array.isArray(item.neighborhoods)) {
        item.neighborhoods.forEach(neighborhood => neighborhoodSet.add(neighborhood));
      } else if (item.location) {
        neighborhoodSet.add(item.location);
      }
    });
    
    return Array.from(neighborhoodSet).sort();
  }, [allItems, selectedType, selectedVillage, searchTerm, eventDateRange, selectedEventDates]);

  const availableVillages = useMemo(() => {
    // Safety check - return empty array if allItems is not available
    if (!allItems || !Array.isArray(allItems)) {
      return [];
    }
    
    // Filter items based on all criteria EXCEPT village
    const filteredItems = allItems.filter(item => {
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNeighborhood = selectedNeighborhood === 'all' || 
        item.neighborhoods?.includes(selectedNeighborhood) ||
        item.location?.toLowerCase().includes(selectedNeighborhood.toLowerCase());
      
      let matchesDate = true;
      if (item.type === 'event' && item.start_time) {
        const eventDate = new Date(item.start_time);
        if (eventDateRange?.from && eventDateRange?.to) {
          matchesDate = eventDate >= eventDateRange.from && eventDate <= eventDateRange.to;
        } else if (selectedEventDates && selectedEventDates.length > 0) {
          matchesDate = selectedEventDates.some(selectedDate => {
            const selectedDateStr = selectedDate.toDateString();
            const eventDateStr = eventDate.toDateString();
            return selectedDateStr === eventDateStr;
          });
        }
      }
      
      return matchesType && matchesSearch && matchesNeighborhood && matchesDate;
    });
    
    const villageSet = new Set<string>();
    filteredItems.forEach(item => {
      if (item.villages && Array.isArray(item.villages)) {
        item.villages.forEach(village => villageSet.add(village));
      } else if (item.villages && typeof item.villages === 'string') {
        item.villages.split(',').map(v => v.trim()).forEach(village => villageSet.add(village));
      }
    });
    
    return Array.from(villageSet).sort();
  }, [allItems, selectedType, selectedNeighborhood, searchTerm, eventDateRange, selectedEventDates]);

  return {
    availableCategories,
    availableNeighborhoods, 
    availableVillages
  };
};