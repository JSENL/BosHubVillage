import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { BusinessComment } from '@/types/business';
import { toast } from 'sonner';

interface BusinessWithComments extends Business {
  business_comments: BusinessComment[];
  comment_count: number;
  average_rating: number;
}

export const useBusinessOwnership = () => {
  const queryClient = useQueryClient();

  const { data: ownedBusinesses, isLoading } = useQuery({
    queryKey: ['owned-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_owner')
        .select(`
          business_id,
          business:business_id (
            *,
            business_comments (
              *,
              profiles:user_id (
                full_name,
                email
              )
            )
          )
        `)
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      // Transform data to include aggregated comment info
      const businessesWithComments: BusinessWithComments[] = data?.map(item => {
        const business = item.business as any;
        const comments = (business?.business_comments || []) as BusinessComment[];
        const averageRating = comments.length > 0 
          ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
          : 0;

        return {
          ...business,
          business_comments: comments,
          comment_count: comments.length,
          average_rating: averageRating
        } as BusinessWithComments;
      }) || [];

      return businessesWithComments;
    },
    staleTime: 5 * 60 * 1000,
  });

  const claimBusinessMutation = useMutation({
    mutationFn: async (businessId: string) => {
      const { error } = await supabase
        .from('business_owner')
        .insert({
          business_id: businessId,
          owner_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owned-businesses'] });
      toast.success('Business claimed successfully');
    },
    onError: (error) => {
      console.error('Error claiming business:', error);
      toast.error('Failed to claim business');
    }
  });

  return {
    ownedBusinesses,
    isLoading,
    claimBusiness: claimBusinessMutation.mutate,
    isClaimingBusiness: claimBusinessMutation.isPending
  };
};