import { useQuery } from '@tanstack/react-query';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';

const PAGE_SIZE = 100;

export const useBusiness = () => {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const allData: any[] = [];
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
          .from('business')
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

      // Fetch business owners for all businesses in one batch
      const businessIds = allData.map(b => b.id);
      const { data: ownerData } = await supabase
        .from('business_owner')
        .select(`
          id,
          owner_id,
          business_id,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .in('business_id', businessIds);

      // Group owners by business_id
      const ownersByBusiness = (ownerData || []).reduce((acc: Record<string, any[]>, owner) => {
        if (!acc[owner.business_id]) acc[owner.business_id] = [];
        acc[owner.business_id].push(owner);
        return acc;
      }, {});

      return allData.map(business => ({
        ...business,
        business_owner: ownersByBusiness[business.id] || []
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
