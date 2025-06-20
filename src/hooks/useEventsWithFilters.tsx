
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
  attendees_count?: number;
}

export const useEventsWithFilters = () => {
  const [events, setEvents] = useState<EventWithFilters[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
        end_time: event.end_time || '00:00:00'
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

      return matchesSearch && matchesCategory && matchesNeighborhood && matchesDate && matchesTime;
    });
  }, [events, selectedCategory, selectedNeighborhood, dateFilter, timeFilter, searchTerm]);

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
    dateFilter,
    setDateFilter,
    timeFilter,
    setTimeFilter,
    searchTerm,
    setSearchTerm,
    refetch: fetchEvents
  };
};
