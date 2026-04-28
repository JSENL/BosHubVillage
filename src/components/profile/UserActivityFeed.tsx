import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark, UserPlus, MessageCircle, Calendar, Heart, Building2, Newspaper, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { eventDetailPath } from '@/lib/eventUrl';
import { useTranslation } from 'react-i18next';

interface UserActivityFeedProps {
  userId: string;
}

interface Activity {
  id: string;
  activity_type: string;
  item_type: string;
  item_id: string;
  created_at: string;
  metadata?: any;
}

interface EnrichedActivity extends Activity {
  itemName?: string;
  /** When item_type is event, slug for /event/:slug URLs. */
  eventSlug?: string;
}

export const UserActivityFeed = ({ userId }: UserActivityFeedProps) => {
  const { t } = useTranslation();
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ['user-activities-enriched', userId],
    queryFn: async () => {
      // Fetch activities
      const { data: activitiesData, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      if (!activitiesData?.length) return [];

      // Group activities by item type to batch fetch
      const userIds = activitiesData.filter(a => a.item_type === 'user').map(a => a.item_id);
      const eventIds = activitiesData.filter(a => a.item_type === 'event').map(a => a.item_id);
      const businessIds = activitiesData.filter(a => a.item_type === 'business').map(a => a.item_id);
      const newsIds = activitiesData.filter(a => a.item_type === 'news').map(a => a.item_id);
      const localServiceIds = activitiesData.filter(a => a.item_type === 'local-service').map(a => a.item_id);

      // Fetch related data in parallel
      const [usersData, eventsData, businessData, newsData, localresourcesData] = await Promise.all([
        userIds.length > 0 
          ? supabase.from('profiles').select('id, full_name').in('id', userIds)
          : { data: [] },
        eventIds.length > 0 
          ? supabase.from('events').select('id, slug, title').in('id', eventIds)
          : { data: [] },
        businessIds.length > 0 
          ? supabase.from('business').select('id, title').in('id', businessIds)
          : { data: [] },
        newsIds.length > 0 
          ? supabase.from('news').select('id, title').in('id', newsIds)
          : { data: [] },
        localServiceIds.length > 0 
          ? supabase.from('local_resources').select('id, name').in('id', localServiceIds)
          : { data: [] },
      ]);

      // Create lookup maps
      const userMap = new Map((usersData.data || []).map(u => [u.id, u.full_name || 'Unknown User']));
      const eventMap = new Map((eventsData.data || []).map(e => [e.id, e.title]));
      const eventSlugMap = new Map(
        (eventsData.data || []).map((e) => [e.id, (e as { slug?: string }).slug])
      );
      const businessMap = new Map((businessData.data || []).map(b => [b.id, b.title]));
      const newsMap = new Map((newsData.data || []).map(n => [n.id, n.title]));
      const localServiceMap = new Map((localresourcesData.data || []).map(l => [l.id, l.name]));

      // Enrich activities with item names
      return activitiesData.map((activity): EnrichedActivity => {
        let itemName: string | undefined;
        
        switch (activity.item_type) {
          case 'user':
            itemName = userMap.get(activity.item_id);
            break;
          case 'event':
            itemName = eventMap.get(activity.item_id);
            break;
          case 'business':
            itemName = businessMap.get(activity.item_id);
            break;
          case 'news':
            itemName = newsMap.get(activity.item_id);
            break;
          case 'local-service':
            itemName = localServiceMap.get(activity.item_id);
            break;
        }
        
        return {
          ...activity,
          itemName,
          eventSlug: activity.item_type === 'event' ? eventSlugMap.get(activity.item_id) : undefined,
        };
      });
    },
    enabled: !!userId,
  });

  const getActivityIcon = (activityType: string, itemType: string) => {
    if (activityType === 'follow') {
      return <UserPlus className="h-4 w-4 text-blue-500" />;
    }
    
    switch (itemType) {
      case 'event':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'business':
        return <Building2 className="h-4 w-4 text-amber-500" />;
      case 'news':
        return <Newspaper className="h-4 w-4 text-green-500" />;
      case 'local-service':
        return <MapPin className="h-4 w-4 text-red-500" />;
      case 'user':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      default:
        return <Bookmark className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityText = (activity: EnrichedActivity) => {
    const { activity_type, item_type, itemName } = activity;
    const displayName = itemName ? `"${itemName}"` : `a ${item_type}`;
    
    switch (activity_type) {
      case 'bookmark':
        return (
          <>
            Bookmarked {item_type === 'event' ? 'event' : item_type === 'business' ? 'business' : item_type} <span className="font-medium text-foreground">{displayName}</span>
          </>
        );
      case 'follow':
        return (
          <>
            Started following <span className="font-medium text-foreground">{itemName || 'a user'}</span>
          </>
        );
      case 'comment':
        return (
          <>
            Commented on <span className="font-medium text-foreground">{displayName}</span>
          </>
        );
      case 'attend':
        return (
          <>
            Registered for <span className="font-medium text-foreground">{displayName}</span>
          </>
        );
      case 'like':
        return (
          <>
            Liked <span className="font-medium text-foreground">{displayName}</span>
          </>
        );
      default:
        return (
          <>
            Interacted with <span className="font-medium text-foreground">{displayName}</span>
          </>
        );
    }
  };

  const getItemLink = (itemType: string, itemId: string, eventSlug?: string) => {
    switch (itemType) {
      case 'event':
        return eventDetailPath({ slug: eventSlug, id: itemId });
      case 'business':
        return `/business/${itemId}`;
      case 'news':
        return `/news/${itemId}`;
      case 'local-service':
        return `/local-resource/${itemId}`;
      case 'user':
        return `/user/${itemId}`;
      default:
        return '#';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.recentActivity', 'Recent Activity')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!activities?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.recentActivity', 'Recent Activity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6 text-sm">
            {t('profile.noActivityYet', 'No recent activity yet.')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.recentActivity', 'Recent Activity')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              to={getItemLink(activity.item_type, activity.item_id, activity.eventSlug)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
            >
              <div className="p-2 rounded-full bg-muted shrink-0">
                {getActivityIcon(activity.activity_type, activity.item_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
