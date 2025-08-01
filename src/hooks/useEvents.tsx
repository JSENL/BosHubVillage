
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  event_type: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  address?: string;
  price: number;
  max_attendees: number | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  registration_required: boolean;
  created_by: string;
  latitude: number | null;
  longitude: number | null;
  neighborhoods: string | null;
  villages: string | null;
  attendees_count?: number;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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
        description: event.description || '',
        event_type: event.event_type || 'event',
        is_recurring: event.is_recurring || false,
        address: event.address || ''
      })) || [];

      setEvents(eventsWithAttendees);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_by' | 'attendees_count'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const insertData = {
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        event_type: eventData.event_type,
        date: eventData.date,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        location: eventData.location,
        address: eventData.address,
        price: eventData.price,
        max_attendees: eventData.max_attendees,
        is_recurring: eventData.is_recurring,
        recurring_pattern: eventData.recurring_pattern,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        neighborhoods: eventData.neighborhoods,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('events')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Event created successfully!');
      fetchEvents();
      return data;
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    fetchEvents,
    createEvent
  };
};
