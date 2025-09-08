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

      // Get users this person is already following to exclude them
      const { data: followingData } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id);
      
      const followingIds = followingData?.map(f => f.following_id) || [];
      
      // Get users that the current user is NOT already following
      let query = supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, bio, location, interests, is_verified, followers_count, following_count')
        .neq('id', user.id)
        .not('full_name', 'is', null); // Only get users with names
      
      if (followingIds.length > 0) {
        query = query.not('id', 'in', `(${followingIds.join(',')})`);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false }) // Show newest users first
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

      // Get users this person is already following to exclude them
      const { data: followingData } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id);
      
      const followingIds = followingData?.map(f => f.following_id) || [];

      // Find users with overlapping interests
      let query = supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, bio, location, interests, is_verified, followers_count, following_count')
        .neq('id', user.id)
        .not('full_name', 'is', null)
        .not('interests', 'is', null);
      
      if (followingIds.length > 0) {
        query = query.not('id', 'in', `(${followingIds.join(',')})`);
      }
      
      const { data, error } = await query
        .overlaps('interests', currentUserProfile.interests)
        .order('followers_count', { ascending: false })
        .limit(5);

      if (error) {
        console.log('Similar interests query error:', error);
        return [];
      }
      return data as UserProfile[];
    },
    enabled: !!user?.id,
  });

  // Get trending users (most active recently)
  const { data: trendingUsers, isLoading: loadingTrending } = useQuery({
    queryKey: ['trending-users', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get users this person is already following to exclude them
      const { data: followingData } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id);
      
      const followingIds = followingData?.map(f => f.following_id) || [];

      // Get users with recent activity, fallback to all users if no activities
      const { data: activityData, error: activityError } = await supabase
        .from('user_activities')
        .select(`
          user_id,
          profiles!inner(id, email, full_name, avatar_url, bio, location, interests, is_verified, followers_count, following_count)
        `)
        .neq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (activityError || !activityData?.length) {
        // Fallback to recent profiles if no activity data
        let fallbackQuery = supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, bio, location, interests, is_verified, followers_count, following_count')
          .neq('id', user.id)
          .not('full_name', 'is', null);
        
        if (followingIds.length > 0) {
          fallbackQuery = fallbackQuery.not('id', 'in', `(${followingIds.join(',')})`);
        }
        
        const { data: fallbackData } = await fallbackQuery
          .order('created_at', { ascending: false })
          .limit(3);
          
        return fallbackData as UserProfile[] || [];
      }

      // Group by user and count activities
      const userActivityCount = activityData.reduce((acc: Record<string, { profile: UserProfile; count: number }>, activity: any) => {
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

      // Get users this person is already following to exclude them
      const { data: followingData } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id);
      
      const followingIds = followingData?.map(f => f.following_id) || [];

      // Find users in the same location
      let query = supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, bio, location, interests, is_verified, followers_count, following_count')
        .neq('id', user.id)
        .not('full_name', 'is', null)
        .not('location', 'is', null);
      
      if (followingIds.length > 0) {
        query = query.not('id', 'in', `(${followingIds.join(',')})`);
      }
      
      const { data, error } = await query
        .ilike('location', `%${currentUserProfile.location}%`)
        .order('followers_count', { ascending: false })
        .limit(5);

      if (error) {
        console.log('Local users query error:', error);
        return [];
      }
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