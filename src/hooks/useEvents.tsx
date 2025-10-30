import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  website_link?: string;
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
  is_sponsored?: boolean;
}

export const useEvents = () => {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading: loading, refetch: fetchEvents } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const currentDate = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_attendees(count)
        `)
        .gte('date', currentDate)
        .order('date', { ascending: true });

      if (error) throw error;

      return data?.map(event => ({
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
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'created_by' | 'attendees_count'>) => {
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
      return data;
    },
    onSuccess: () => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  });

  const createEvent = createEventMutation.mutateAsync;

  return {
    events,
    loading,
    fetchEvents,
    createEvent
  };
};
