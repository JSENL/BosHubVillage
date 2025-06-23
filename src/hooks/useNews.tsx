
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { News } from '@/types/news';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date_posted', { ascending: false });

      if (error) throw error;
      
      // Parse villages JSON string to array
      const newsWithParsedVillages = data?.map(news => ({
        ...news,
        villages: news.villages ? (typeof news.villages === 'string' ? JSON.parse(news.villages) : news.villages) : null
      })) || [];
      
      return newsWithParsedVillages as News[];
    },
  });
};
