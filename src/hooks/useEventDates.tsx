import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEventDates = () => {
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentDate = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('events')
          .select('date')
          .gte('date', currentDate)
          .order('date', { ascending: true });

        if (error) {
          throw error;
        }

        // Convert string dates to Date objects and remove duplicates
        const uniqueDates = Array.from(
          new Set(data.map(event => event.date))
        ).map(dateStr => new Date(dateStr));

        setEventDates(uniqueDates);
      } catch (err) {
        console.error('Error fetching event dates:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDates();
  }, []);

  return { eventDates, isLoading, error };
};