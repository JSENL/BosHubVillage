
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EventWithFilters {
  id: string;
  title: string;
  description: string;
  category: string;
  event_type: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  price: number;
  max_attendees: number | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  created_by: string;
  latitude: number | null;
  longitude: number | null;
  neighborhoods: string | null;
  villages: string[] | null;
  attendees_count?: number;
}

export const useEventsWithFilters = () => {
  const [events, setEvents] = useState<EventWithFilters[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to safely parse villages data
  const parseVillages = (villagesData: any) => {
    if (!villagesData) return [];
    
    // If it's already an array, return it
    if (Array.isArray(villagesData)) {
      return villagesData;
    }
    
    // If it's a string, try to parse as JSON first
    if (typeof villagesData === 'string') {
      // Check if it looks like a JSON array (starts with [ and ends with ])
      if (villagesData.trim().startsWith('[') && villagesData.trim().endsWith(']')) {
        try {
          return JSON.parse(villagesData);
        } catch (error) {
          console.warn('Failed to parse villages as JSON:', villagesData, error);
          return [];
        }
      } else {
        // If it's a plain string, treat it as a single village
        return [villagesData.trim()];
      }
    }
    
    return [];
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_attendees(count)
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      const eventsWithAttendees = data?.map(event => ({
        ...event,
        attendees_count: event.event_attendees?.[0]?.count || 0,
        price: Number(event.price || 0),
        start_time: event.start_time || '00:00:00',
        end_time: event.end_time || '00:00:00',
        villages: parseVillages(event.villages)
      })) || [];

      setEvents(eventsWithAttendees);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

      // Neighborhood filter
      const matchesNeighborhood = selectedNeighborhood === 'all' || 
        (event.neighborhoods && event.neighborhoods.includes(selectedNeighborhood.replace('-', ' '))) ||
        event.location.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase());

      // Village filter - now properly handles parsed villages array
      const matchesVillage = selectedVillage === 'all' || 
        (event.villages && Array.isArray(event.villages) && 
         event.villages.some(village => 
           village.toLowerCase().replace(/\s+/g, '-') === selectedVillage ||
           village.toLowerCase() === selectedVillage.replace('-', ' ').toLowerCase()
         ));

      // Date filter
      const matchesDate = dateFilter === '' || event.date === dateFilter;

      // Time filter
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

      return matchesSearch && matchesCategory && matchesNeighborhood && matchesVillage && matchesDate && matchesTime;
    });
  }, [events, selectedCategory, selectedNeighborhood, selectedVillage, dateFilter, timeFilter, searchTerm]);

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events: filteredEvents,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    selectedVillage,
    setSelectedVillage,
    dateFilter,
    setDateFilter,
    timeFilter,
    setTimeFilter,
    searchTerm,
    setSearchTerm,
    refetch: fetchEvents
  };
};
