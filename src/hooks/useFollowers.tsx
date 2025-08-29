import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export const useFollowers = (userId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user follows the target user
  const { data: isFollowing, isLoading: isCheckingFollow } = useQuery({
    queryKey: ['is-following', userId],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('user_followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id && !!userId && user.id !== userId,
  });

  // Get followers list
  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_followers')
        .select(`
          id,
          created_at,
          follower:profiles!follower_id(
            id,
            full_name,
            avatar_url,
            is_verified
          )
        `)
        .eq('following_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Get following list
  const { data: following, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_followers')
        .select(`
          id,
          created_at,
          following:profiles!following_id(
            id,
            full_name,
            avatar_url,
            is_verified
          )
        `)
        .eq('follower_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_followers')
        .insert({
          follower_id: user.id,
          following_id: userId,
        });

      if (error) throw error;

      // Log activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'follow',
          item_type: 'user',
          item_id: userId,
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      
      toast({
        title: "Following",
        description: "You are now following this user.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      
      toast({
        title: "Unfollowed",
        description: "You are no longer following this user.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unfollow user. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    isFollowing,
    isCheckingFollow,
    followers,
    following,
    isLoadingFollowers,
    isLoadingFollowing,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowingUser: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
  };
};