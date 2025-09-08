import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTrending = () => {
  // Get trending items directly from tables since trending_content exists but might be empty
  const { data: trendingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['trending-events'],
    queryFn: async () => {
      const currentDate = new Date().toISOString().split('T')[0];
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', currentDate)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return events || [];
    },
  });

  const { data: trendingBusinesses, isLoading: businessesLoading } = useQuery({
    queryKey: ['trending-businesses'],
    queryFn: async () => {
      const { data: businesses, error } = await supabase
        .from('business')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return businesses || [];
    },
  });

  const { data: trendingNews, isLoading: newsLoading } = useQuery({
    queryKey: ['trending-news'],
    queryFn: async () => {
      const { data: news, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return news || [];
    },
  });

  const isLoading = eventsLoading || businessesLoading || newsLoading;

  return {
    trendingItems: null, // Not using this anymore
    trendingEvents,
    trendingBusinesses,
    trendingNews,
    isLoading,
  };
};