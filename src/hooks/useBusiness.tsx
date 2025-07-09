
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';

export const useBusiness = () => {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      console.log('Fetching business from Supabase...');
      
      const { data, error } = await supabase
        .from('business')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching business:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} business items`);
      
      // Parse villages JSON string to array
      const businessWithParsedVillages = data?.map(business => ({
        ...business,
        villages: business.villages ? (typeof business.villages === 'string' ? JSON.parse(business.villages) : business.villages) : null
      })) || [];
      
      return businessWithParsedVillages as Business[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });
};
