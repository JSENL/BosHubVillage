import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
  email: string;
};

export const useDiscoverPeople = () => {
  const { user } = useAuth();

  // Get recommended users based on various criteria
  const { data: recommendedUsers, isLoading } = useQuery({
    queryKey: ['discover-people', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get users that the current user is NOT already following
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .not('id', 'in', `(
          SELECT following_id 
          FROM user_followers 
          WHERE follower_id = '${user.id}'
        )`)
        .order('followers_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: !!user?.id,
  });

  // Get users with similar interests
  const { data: similarInterestUsers, isLoading: loadingSimilar } = useQuery({
    queryKey: ['similar-interest-users', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get current user's interests
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('interests')
        .eq('id', user.id)
        .single();

      if (!currentUserProfile?.interests?.length) return [];

      // Find users with overlapping interests
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .not('id', 'in', `(
          SELECT following_id 
          FROM user_followers 
          WHERE follower_id = '${user.id}'
        )`)
        .overlaps('interests', currentUserProfile.interests)
        .order('followers_count', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: !!user?.id,
  });

  // Get trending users (most active recently)
  const { data: trendingUsers, isLoading: loadingTrending } = useQuery({
    queryKey: ['trending-users', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get users with recent activity
      const { data, error } = await supabase
        .from('user_activities')
        .select(`
          user_id,
          profiles!inner(*)
        `)
        .neq('user_id', user.id)
        .not('user_id', 'in', `(
          SELECT following_id 
          FROM user_followers 
          WHERE follower_id = '${user.id}'
        )`)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Group by user and count activities
      const userActivityCount = data.reduce((acc: Record<string, { profile: UserProfile; count: number }>, activity: any) => {
        const profile = activity.profiles;
        if (!acc[profile.id]) {
          acc[profile.id] = { profile, count: 0 };
        }
        acc[profile.id].count++;
        return acc;
      }, {});

      // Sort by activity count and return top users
      return Object.values(userActivityCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(item => item.profile);
    },
    enabled: !!user?.id,
  });

  // Get users from the same location
  const { data: localUsers, isLoading: loadingLocal } = useQuery({
    queryKey: ['local-users', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get current user's location
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('location')
        .eq('id', user.id)
        .single();

      if (!currentUserProfile?.location) return [];

      // Find users in the same location
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .not('id', 'in', `(
          SELECT following_id 
          FROM user_followers 
          WHERE follower_id = '${user.id}'
        )`)
        .ilike('location', `%${currentUserProfile.location}%`)
        .order('followers_count', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: !!user?.id,
  });

  return {
    recommendedUsers,
    similarInterestUsers,
    trendingUsers,
    localUsers,
    isLoading: isLoading || loadingSimilar || loadingTrending || loadingLocal,
  };
};