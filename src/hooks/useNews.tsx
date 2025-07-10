
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { News } from '@/types/news';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      console.log('Fetching news from Supabase...');
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date_posted', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} news items`, data);
      
      // Parse villages field safely
      const newsWithParsedVillages = data?.map(news => ({
        ...news,
        villages: news.villages ? 
          (typeof news.villages === 'string' ? 
            news.villages.split(',').map(v => v.trim()) : 
            news.villages
          ) : 
          []
      })) || [];
      
      console.log('Processed news items:', newsWithParsedVillages);
      
      return newsWithParsedVillages as News[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });
};
