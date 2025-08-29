import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { BookmarkItemType } from './useBookmarks';

export const useRecentlyViewed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: recentlyViewed, isLoading } = useQuery({
    queryKey: ['recently-viewed', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('recently_viewed')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const addToRecentlyViewedMutation = useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: BookmarkItemType; itemId: string }) => {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('recently_viewed')
        .upsert({
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
          viewed_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed', user?.id] });
    },
  });

  return {
    recentlyViewed,
    isLoading,
    addToRecentlyViewed: addToRecentlyViewedMutation.mutate,
  };
};