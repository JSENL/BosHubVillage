import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type ActivityType = 'post' | 'activity' | 'all';

export interface FollowingActivity {
  id: string;
  type: 'event' | 'news' | 'business' | 'local-service' | 'bookmark' | 'comment' | 'registration';
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
  item: {
    id: string;
    title: string;
    type: string;
  };
  created_at: string;
  action: string;
}

export const useFollowingActivity = (filterType: ActivityType = 'all') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['following-activity', user?.id, filterType],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get list of users this person is following
      const { data: followingData } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id);

      const followingIds = followingData?.map(f => f.following_id) || [];
      
      if (followingIds.length === 0) return [];

      const activities: FollowingActivity[] = [];

      // Fetch posts (events, news, businesses, local services) if needed
      if (filterType === 'post' || filterType === 'all') {
        // Events (no status column - all events in this table are approved)
        const eventsResponse = await (supabase as any)
          .from('events')
          .select('id, title, created_at, created_by')
          .in('created_by', followingIds)
          .order('created_at', { ascending: false })
          .limit(10);

        if (eventsResponse.data) {
          for (const event of eventsResponse.data as any[]) {
            const profileResponse = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, is_verified')
              .eq('id', event.created_by || '')
              .maybeSingle();

            if (profileResponse.data) {
              const profile = profileResponse.data as any;
              activities.push({
                id: `event-${event.id}`,
                type: 'event',
                user: {
                  id: profile.id,
                  full_name: profile.full_name || '',
                  avatar_url: profile.avatar_url,
                  is_verified: profile.is_verified || false,
                },
                item: { id: event.id, title: event.title || '', type: 'event' },
                created_at: event.created_at || new Date().toISOString(),
                action: 'created an event',
              });
            }
          }
        }

        // News (no status column - all news in this table are approved)
        const newsResponse = await (supabase as any)
          .from('news')
          .select('id, title, created_at, created_by')
          .in('created_by', followingIds)
          .order('created_at', { ascending: false })
          .limit(10);

        if (newsResponse.data) {
          for (const item of newsResponse.data as any[]) {
            const profileResponse = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, is_verified')
              .eq('id', item.created_by || '')
              .maybeSingle();

            if (profileResponse.data) {
              const profile = profileResponse.data as any;
              activities.push({
                id: `news-${item.id}`,
                type: 'news',
                user: {
                  id: profile.id,
                  full_name: profile.full_name || '',
                  avatar_url: profile.avatar_url,
                  is_verified: profile.is_verified || false,
                },
                item: { id: item.id, title: item.title || '', type: 'news' },
                created_at: item.created_at || new Date().toISOString(),
                action: 'published news',
              });
            }
          }
        }

        // Businesses (no status column - all businesses in this table are approved)
        const businessesResponse: any = await (supabase as any)
          .from('businesses')
          .select('id, name, created_at, created_by')
          .in('created_by', followingIds)
          .order('created_at', { ascending: false })
          .limit(10);

        if (businessesResponse.data) {
          for (const business of businessesResponse.data) {
            const profileResponse: any = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, is_verified')
              .eq('id', business.created_by || '')
              .maybeSingle();

            if (profileResponse.data) {
              const profile = profileResponse.data;
              activities.push({
                id: `business-${business.id}`,
                type: 'business',
                user: {
                  id: profile.id,
                  full_name: profile.full_name || '',
                  avatar_url: profile.avatar_url,
                  is_verified: profile.is_verified || false,
                },
                item: { id: business.id, title: business.name || '', type: 'business' },
                created_at: business.created_at || new Date().toISOString(),
                action: 'added a business',
              });
            }
          }
        }

        // Local Services (no status column - all services in this table are approved)
        const servicesResponse: any = await (supabase as any)
          .from('local_services')
          .select('id, name, created_at, created_by')
          .in('created_by', followingIds)
          .order('created_at', { ascending: false })
          .limit(10);

        if (servicesResponse.data) {
          for (const service of servicesResponse.data) {
            const profileResponse: any = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, is_verified')
              .eq('id', service.created_by || '')
              .maybeSingle();

            if (profileResponse.data) {
              const profile = profileResponse.data;
              activities.push({
                id: `service-${service.id}`,
                type: 'local-service',
                user: {
                  id: profile.id,
                  full_name: profile.full_name || '',
                  avatar_url: profile.avatar_url,
                  is_verified: profile.is_verified || false,
                },
                item: { id: service.id, title: service.name || '', type: 'local-service' },
                created_at: service.created_at || new Date().toISOString(),
                action: 'added a local service',
              });
            }
          }
        }
      }

      // Fetch activity (bookmarks, comments, registrations) if needed
      if (filterType === 'activity' || filterType === 'all') {
        const { data: userActivities } = await supabase
          .from('user_activities')
          .select('id, activity_type, item_type, item_id, created_at, user_id')
          .in('user_id', followingIds)
          .in('activity_type', ['bookmark', 'comment', 'registration'])
          .order('created_at', { ascending: false })
          .limit(20);

        for (const activity of (userActivities as any[]) || []) {
          const profileResponse: any = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, is_verified')
            .eq('id', activity.user_id)
            .maybeSingle();

          if (!profileResponse.data) continue;
          const profile = profileResponse.data;

          let itemTitle = 'an item';
          const itemType = activity.item_type || 'unknown';

          // Fetch item details based on type
          if (activity.item_type === 'event') {
            const eventResponse: any = await supabase
              .from('events')
              .select('title')
              .eq('id', activity.item_id || '')
              .maybeSingle();
            if (eventResponse.data) itemTitle = eventResponse.data.title || 'Untitled Event';
          } else if (activity.item_type === 'news') {
            const newsResponse: any = await supabase
              .from('news')
              .select('title')
              .eq('id', activity.item_id || '')
              .maybeSingle();
            if (newsResponse.data) itemTitle = newsResponse.data.title || 'Untitled News';
          } else if (activity.item_type === 'business') {
            const businessResponse: any = await (supabase as any)
              .from('businesses')
              .select('name')
              .eq('id', activity.item_id || '')
              .maybeSingle();
            if (businessResponse.data?.name) itemTitle = businessResponse.data.name;
          } else if (activity.item_type === 'local-service') {
            const serviceResponse: any = await (supabase as any)
              .from('local_services')
              .select('name')
              .eq('id', activity.item_id || '')
              .maybeSingle();
            if (serviceResponse.data?.name) itemTitle = serviceResponse.data.name;
          }

          let action = '';
          let type: FollowingActivity['type'] = 'bookmark';

          if (activity.activity_type === 'bookmark') {
            action = `bookmarked ${itemType}`;
            type = 'bookmark';
          } else if (activity.activity_type === 'comment') {
            action = `commented on ${itemType}`;
            type = 'comment';
          } else if (activity.activity_type === 'registration') {
            action = 'registered for event';
            type = 'registration';
          }

          activities.push({
            id: `activity-${activity.id}`,
            type,
            user: {
              id: profile.id,
              full_name: profile.full_name || '',
              avatar_url: profile.avatar_url,
              is_verified: profile.is_verified || false,
            },
            item: { id: activity.item_id || '', title: itemTitle, type: itemType },
            created_at: activity.created_at || new Date().toISOString(),
            action,
          });
        }
      }

      // Sort all activities by date
      return activities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 20);
    },
    enabled: !!user?.id,
  });
};
