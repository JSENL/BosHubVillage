
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LocalResource } from '@/types/localServices';

const PAGE_SIZE = 100;

export const useLocalServices = () => {
  return useQuery({
    queryKey: ['local-resources'],
    queryFn: async () => {
      const allData: any[] = [];
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
          .from('local_resources')
          .select('*')
          .order('created_at', { ascending: false })
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

      return allData as LocalResource[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
