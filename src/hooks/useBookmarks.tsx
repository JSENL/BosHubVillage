import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export type BookmarkItemType = 'event' | 'business' | 'news' | 'local_service';

export const useBookmarks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's bookmarks
  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Check if specific item is bookmarked
  const useIsBookmarked = (itemType: BookmarkItemType, itemId: string) => {
    return useQuery({
      queryKey: ['is-bookmarked', itemType, itemId],
      queryFn: async () => {
        if (!user?.id) return false;
        
        const { data, error } = await supabase
          .from('user_bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('item_type', itemType)
          .eq('item_id', itemId)
          .maybeSingle();

        if (error) throw error;
        return !!data;
      },
      enabled: !!user?.id && !!itemId,
    });
  };

  const addBookmarkMutation = useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: BookmarkItemType; itemId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
        });

      if (error) throw error;

      // Log activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'bookmark',
          item_type: itemType,
          item_id: itemId,
        });
    },
    onSuccess: (_, { itemType, itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['is-bookmarked', itemType, itemId] });
      
      toast({
        title: "Bookmarked",
        description: "Item added to your bookmarks.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to bookmark item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: BookmarkItemType; itemId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (error) throw error;
    },
    onSuccess: (_, { itemType, itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['is-bookmarked', itemType, itemId] });
      
      toast({
        title: "Removed",
        description: "Item removed from your bookmarks.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove bookmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    bookmarks,
    isLoading,
    useIsBookmarked,
    addBookmark: addBookmarkMutation.mutate,
    removeBookmark: removeBookmarkMutation.mutate,
    isAddingBookmark: addBookmarkMutation.isPending,
    isRemovingBookmark: removeBookmarkMutation.isPending,
  };
};