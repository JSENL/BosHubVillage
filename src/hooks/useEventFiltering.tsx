
import { useMemo } from 'react';
import { Event } from '@/hooks/useEvents';

interface UseEventFilteringProps {
  events: Event[];
  searchTerm: string;
  selectedCategory: string;
  priceRange: string;
}

export const useEventFiltering = ({
  events,
  searchTerm,
  selectedCategory,
  priceRange
}: UseEventFilteringProps) => {
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      
      const matchesPrice = priceRange === 'all' || 
                          (priceRange === 'free' && event.price === 0) ||
                          (priceRange === 'paid' && event.price > 0);
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [events, searchTerm, selectedCategory, priceRange]);

  return { filteredEvents };
};
