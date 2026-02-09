
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { News } from '@/types/news';

const PAGE_SIZE = 100;

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const allData: any[] = [];
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('date_posted', { ascending: false })
          .range(from, to);

        if (error) throw error;

        if (data && data.length > 0) {
          allData.push(...data);
          hasMore = data.length === PAGE_SIZE;
        } else {
          hasMore = false;
        }
        page++;
      }
      
      // Parse villages field safely
      return allData.map(news => ({
        ...news,
        villages: news.villages ? 
          (typeof news.villages === 'string' ? 
            news.villages.split(',').map((v: string) => v.trim()) : 
            news.villages
          ) : 
          []
      })) as News[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
