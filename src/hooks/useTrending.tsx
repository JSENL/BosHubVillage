import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTrending = () => {
  const { data: trendingItems, isLoading } = useQuery({
    queryKey: ['trending-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trending_content')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const { data: trendingEvents } = useQuery({
    queryKey: ['trending-events'],
    queryFn: async () => {
      const { data: trending } = await supabase
        .from('trending_content')
        .select('item_id')
        .eq('item_type', 'event')
        .order('score', { ascending: false })
        .limit(5);

      if (!trending?.length) return [];

      const eventIds = trending.map(t => t.item_id);
      
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds);

      if (error) throw error;
      return events;
    },
  });

  const { data: trendingBusinesses } = useQuery({
    queryKey: ['trending-businesses'],
    queryFn: async () => {
      const { data: trending } = await supabase
        .from('trending_content')
        .select('item_id')
        .eq('item_type', 'business')
        .order('score', { ascending: false })
        .limit(5);

      if (!trending?.length) return [];

      const businessIds = trending.map(t => t.item_id);
      
      const { data: businesses, error } = await supabase
        .from('business')
        .select('*')
        .in('id', businessIds);

      if (error) throw error;
      return businesses;
    },
  });

  const { data: trendingNews } = useQuery({
    queryKey: ['trending-news'],
    queryFn: async () => {
      const { data: trending } = await supabase
        .from('trending_content')
        .select('item_id')
        .eq('item_type', 'news')
        .order('score', { ascending: false })
        .limit(5);

      if (!trending?.length) return [];

      const newsIds = trending.map(t => t.item_id);
      
      const { data: news, error } = await supabase
        .from('news')
        .select('*')
        .in('id', newsIds);

      if (error) throw error;
      return news;
    },
  });

  return {
    trendingItems,
    trendingEvents,
    trendingBusinesses,
    trendingNews,
    isLoading,
  };
};