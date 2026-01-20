import { useMemo } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { DateRange } from 'react-day-picker';
import { calculateDistance } from '@/hooks/useGeolocation';
import { sortBySponsored } from '@/utils/sponsoredUtils';

interface FilterOptions {
  selectedType: string;
  selectedCategory: string;
  selectedNeighborhood: string;
  selectedVillage: string;
  searchTerm: string;
  eventDateRange?: DateRange;
  selectedEventDates: Date[];
  viewMode: 'map' | 'list';
  maxDistance: number | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export const useItemFiltering = (
  items: UnifiedItem[], 
  filters: FilterOptions, 
  userLocation?: UserLocation | null
): UnifiedItem[] => {
  return useMemo(() => {
    if (!items.length) return [];

    const filtered = items.filter(item => {
      // Exclude past events
      if (item.type === 'event' && item.date) {
        const eventDate = new Date(item.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
          return false;
        }
      }

      // Type filter
      const matchesType = filters.selectedType === 'all' || item.type === filters.selectedType;

      // Search term filter
      const matchesSearch = filters.searchTerm === '' || 
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.address?.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = filters.selectedCategory === 'all' || 
        item.category === filters.selectedCategory ||
        item.business_type === filters.selectedCategory;

      // Neighborhood filter
      const matchesNeighborhood = filters.selectedNeighborhood === 'all' || 
        (item.neighborhoods && item.neighborhoods.includes(filters.selectedNeighborhood.replace('-', ' '))) ||
        (item.location && item.location.toLowerCase().includes(filters.selectedNeighborhood.replace('-', ' ').toLowerCase())) ||
        (item.address && item.address.toLowerCase().includes(filters.selectedNeighborhood.replace('-', ' ').toLowerCase()));

      // Village filter
      const matchesVillage = filters.selectedVillage === 'all' || (() => {
        if (!item.villages) return false;
        
        const itemVillages = Array.isArray(item.villages) ? item.villages : [item.villages];
        
        return itemVillages.some(village => {
          const normalized = village.toLowerCase().replace(/\s+/g, '-');
          const selectedNormalized = filters.selectedVillage.toLowerCase();
          const selectedWithSpaces = filters.selectedVillage.replace('-', ' ').toLowerCase();
          
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
        
        // Check individual dates
        if (filters.selectedEventDates.length > 0) {
          return filters.selectedEventDates.some(selectedDate => 
            selectedDate.toDateString() === itemDate.toDateString()
          );
        }
        
        // Check date range
        if (filters.eventDateRange?.from) {
          const fromDate = new Date(filters.eventDateRange.from);
          const toDate = filters.eventDateRange.to ? new Date(filters.eventDateRange.to) : fromDate;
          
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(23, 59, 59, 999);
          
          return itemDate >= fromDate && itemDate <= toDate;
        }
        
        return true;
      })();

      // Distance filter (Near Me)
      const matchesDistance = !filters.maxDistance || !userLocation || (() => {
        if (!item.latitude || !item.longitude) return false;
        
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          item.latitude,
          item.longitude
        );
        
        return distance <= filters.maxDistance;
      })();

      return matchesType && matchesSearch && matchesCategory && matchesNeighborhood && matchesVillage && matchesEventDate && matchesDistance;
    });

    // Sort filtered items so sponsored items appear first
    return sortBySponsored(filtered);
  }, [items, filters, userLocation]);
};