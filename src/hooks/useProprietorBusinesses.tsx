import { useQuery } from '@tanstack/react-query';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProprietorBusinesses = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['proprietor-businesses', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching proprietor businesses from Supabase...');
      
      // Fetch both approved businesses and pending submissions for this user
      const [businessesResult, submissionsResult] = await Promise.all([
        supabase
          .from('business')
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('business_submissions')
          .select('*')
          .eq('submitted_by', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (businessesResult.error) {
        console.error('Error fetching businesses:', businessesResult.error);
        throw businessesResult.error;
      }

      if (submissionsResult.error) {
        console.error('Error fetching business submissions:', submissionsResult.error);
        throw submissionsResult.error;
      }

      const businesses = (businessesResult.data || []) as Business[];
      const submissions = submissionsResult.data || [];

      console.log(`Fetched ${businesses.length} approved businesses and ${submissions.length} submissions for proprietor`);
      
      return { businesses, submissions };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user?.id,
  });
};