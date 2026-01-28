import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark, UserPlus, MessageCircle, Calendar, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
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
  metadata?: Record<string, any>;
}

export const UserActivityFeed = ({ userId }: UserActivityFeedProps) => {
  const { t } = useTranslation();
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ['user-activities', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!userId,
  });

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'bookmark':
        return <Bookmark className="h-4 w-4 text-amber-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'attend':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    const { activity_type, item_type } = activity;
    
    switch (activity_type) {
      case 'bookmark':
        return `Bookmarked a${item_type === 'event' ? 'n' : ''} ${item_type}`;
      case 'follow':
        return 'Started following a user';
      case 'comment':
        return `Commented on a${item_type === 'event' ? 'n' : ''} ${item_type}`;
      case 'attend':
        return 'Registered for an event';
      case 'like':
        return `Liked a${item_type === 'event' ? 'n' : ''} ${item_type}`;
      default:
        return `Interacted with a${item_type === 'event' ? 'n' : ''} ${item_type}`;
    }
  };

  const getItemLink = (itemType: string, itemId: string) => {
    switch (itemType) {
      case 'event':
        return `/event/${itemId}`;
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
        <div className="space-y-4">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              to={getItemLink(activity.item_type, activity.item_id)}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-full bg-muted">
                {getActivityIcon(activity.activity_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-muted-foreground">
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
