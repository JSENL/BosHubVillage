import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFollowingActivity, ActivityType } from '@/hooks/useFollowingActivity';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Bookmark, MessageSquare, Calendar, Newspaper, Briefcase, MapPin } from 'lucide-react';

export const FollowingActivityFeed = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<ActivityType>('all');
  const { data: activities, isLoading } = useFollowingActivity(filterType);

  const getItemLink = (type: string, id: string) => {
    switch (type) {
      case 'event':
        return `/event/${id}`;
      case 'news':
        return `/news/${id}`;
      case 'business':
        return `/business/${id}`;
      case 'local-service':
        return `/local-resource/${id}`;
      default:
        return '#';
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-3 w-3" />;
      case 'news':
        return <Newspaper className="h-3 w-3" />;
      case 'business':
        return <Briefcase className="h-3 w-3" />;
      case 'local-service':
        return <MapPin className="h-3 w-3" />;
      case 'bookmark':
        return <Bookmark className="h-3 w-3" />;
      case 'comment':
        return <MessageSquare className="h-3 w-3" />;
      case 'registration':
        return <Calendar className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Following Feed
        </CardTitle>
        
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as ActivityType)} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="post" className="text-xs">Posts</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p>No recent activity from people you follow.</p>
            <p className="mt-2 text-xs">Start following users to see their updates here!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {activities?.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Link to={`/user/${activity.user.id}`} className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {activity.user.full_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1">
                    <Link 
                      to={`/user/${activity.user.id}`}
                      className="font-medium text-sm hover:underline truncate"
                    >
                      {activity.user.full_name}
                    </Link>
                    {activity.user.is_verified && (
                      <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {activity.action}
                  </p>

                  <Link 
                    to={getItemLink(activity.item.type, activity.item.id)}
                    className="text-xs font-medium hover:underline mt-1 line-clamp-1 flex items-center gap-1.5"
                  >
                    {getItemIcon(activity.type)}
                    <span className="truncate">{activity.item.title}</span>
                  </Link>

                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activities && activities.length > 0 && user && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2"
            asChild
          >
            <Link to={`/user/${user.id}`}>View All Activity</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
