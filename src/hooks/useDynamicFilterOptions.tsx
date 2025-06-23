
import { useMemo } from 'react';
import { EventWithFilters } from '@/hooks/useEventsWithFilters';

interface UseDynamicFilterOptionsProps {
  events: EventWithFilters[];
  selectedCategory: string;
  selectedNeighborhood: string;
  selectedVillage: string;
  dateFilter: string;
  timeFilter: string;
  searchTerm: string;
}

export const useDynamicFilterOptions = ({
  events,
  selectedCategory,
  selectedNeighborhood,
  selectedVillage,
  dateFilter,
  timeFilter,
  searchTerm
}: UseDynamicFilterOptionsProps) => {
  
  // Helper function to safely parse villages data
  const parseVillages = (villagesData: any) => {
    if (!villagesData) return [];
    
    if (Array.isArray(villagesData)) {
      return villagesData;
    }
    
    if (typeof villagesData === 'string') {
      if (villagesData.trim().startsWith('[') && villagesData.trim().endsWith(']')) {
        try {
          return JSON.parse(villagesData);
        } catch (error) {
          return [];
        }
      } else {
        return [villagesData.trim()];
      }
    }
    
    return [];
  };

  // Get available categories based on current filters (excluding category filter itself)
  const availableCategories = useMemo(() => {
    const filteredEvents = events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesNeighborhood = selectedNeighborhood === 'all' || 
        (event.neighborhoods && event.neighborhoods.includes(selectedNeighborhood.replace('-', ' '))) ||
        event.location.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase());

      const matchesVillage = selectedVillage === 'all' || 
        (event.villages && Array.isArray(event.villages) && 
         event.villages.some(village => 
           village.toLowerCase().replace(/\s+/g, '-') === selectedVillage ||
           village.toLowerCase() === selectedVillage.replace('-', ' ').toLowerCase()
         ));

      const matchesDate = dateFilter === '' || event.date === dateFilter;

      const matchesTime = timeFilter === 'all' || (() => {
        if (!event.start_time) return timeFilter === 'all';
        
        const eventHour = parseInt(event.start_time.split(':')[0]);
        
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

      return matchesSearch && matchesNeighborhood && matchesVillage && matchesDate && matchesTime;
    });

    const categories = new Set(filteredEvents.map(event => event.category));
    return Array.from(categories).sort();
  }, [events, selectedNeighborhood, selectedVillage, dateFilter, timeFilter, searchTerm]);

  // Get available neighborhoods based on current filters (excluding neighborhood filter itself)
  const availableNeighborhoods = useMemo(() => {
    const filteredEvents = events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

      const matchesVillage = selectedVillage === 'all' || 
        (event.villages && Array.isArray(event.villages) && 
         event.villages.some(village => 
           village.toLowerCase().replace(/\s+/g, '-') === selectedVillage ||
           village.toLowerCase() === selectedVillage.replace('-', ' ').toLowerCase()
         ));

      const matchesDate = dateFilter === '' || event.date === dateFilter;

      const matchesTime = timeFilter === 'all' || (() => {
        if (!event.start_time) return timeFilter === 'all';
        
        const eventHour = parseInt(event.start_time.split(':')[0]);
        
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

      return matchesSearch && matchesCategory && matchesVillage && matchesDate && matchesTime;
    });

    const neighborhoods = new Set<string>();
    
    filteredEvents.forEach(event => {
      if (event.neighborhoods) {
        // Split by common separators and add each neighborhood
        const eventNeighborhoods = event.neighborhoods.split(/[,;|]/).map(n => n.trim());
        eventNeighborhoods.forEach(neighborhood => {
          if (neighborhood) {
            neighborhoods.add(neighborhood);
          }
        });
      }
      
      // Also extract from location field as fallback
      const location = event.location.toLowerCase();
      // Extract neighborhood names from location if they contain common neighborhood keywords
      if (location.includes('dorchester')) neighborhoods.add('Dorchester');
      if (location.includes('jamaica plain')) neighborhoods.add('Jamaica Plain');
      if (location.includes('cambridge')) neighborhoods.add('Cambridge');
      if (location.includes('somerville')) neighborhoods.add('Somerville');
      if (location.includes('beacon hill')) neighborhoods.add('Beacon Hill');
      if (location.includes('back bay')) neighborhoods.add('Back Bay');
      if (location.includes('north end')) neighborhoods.add('North End');
      if (location.includes('south end')) neighborhoods.add('South End');
      if (location.includes('chinatown')) neighborhoods.add('Chinatown');
      if (location.includes('financial district')) neighborhoods.add('Financial District');
      if (location.includes('fenway')) neighborhoods.add('Fenway');
      if (location.includes('charlestown')) neighborhoods.add('Charlestown');
      if (location.includes('roxbury')) neighborhoods.add('Roxbury');
      if (location.includes('hyde park')) neighborhoods.add('Hyde Park');
    });

    return Array.from(neighborhoods).sort();
  }, [events, selectedCategory, selectedVillage, dateFilter, timeFilter, searchTerm]);

  // Get available villages based on current filters (excluding village filter itself)
  const availableVillages = useMemo(() => {
    const filteredEvents = events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

      const matchesNeighborhood = selectedNeighborhood === 'all' || 
        (event.neighborhoods && event.neighborhoods.includes(selectedNeighborhood.replace('-', ' '))) ||
        event.location.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase());

      const matchesDate = dateFilter === '' || event.date === dateFilter;

      const matchesTime = timeFilter === 'all' || (() => {
        if (!event.start_time) return timeFilter === 'all';
        
        const eventHour = parseInt(event.start_time.split(':')[0]);
        
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

      return matchesSearch && matchesCategory && matchesNeighborhood && matchesDate && matchesTime;
    });

    const villages = new Set<string>();
    
    filteredEvents.forEach(event => {
      if (event.villages) {
        const parsedVillages = parseVillages(event.villages);
        parsedVillages.forEach(village => {
          if (village && typeof village === 'string') {
            villages.add(village.trim());
          }
        });
      }
    });

    return Array.from(villages).sort();
  }, [events, selectedCategory, selectedNeighborhood, dateFilter, timeFilter, searchTerm]);

  return {
    availableCategories,
    availableNeighborhoods,
    availableVillages
  };
};
