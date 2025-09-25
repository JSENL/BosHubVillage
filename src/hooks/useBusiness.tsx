import { useQuery } from '@tanstack/react-query';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';

export const useBusiness = () => {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      console.log('Fetching businesses from Supabase...');
      
      const { data, error } = await supabase
        .from('business')
        .select(`
          *,
          business_owner (
            id,
            owner_id,
            profiles:owner_id (
              id,
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching businesses:', error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} business items from Supabase`);
      
      return (data || []) as any[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};