import { useState } from 'react';
import { useFollowers } from '@/hooks/useFollowers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface FollowingListProps {
  userId: string;
}

const INITIAL_DISPLAY_COUNT = 4;

export const FollowingList = ({ userId }: FollowingListProps) => {
  const { t } = useTranslation();
  const { following, isLoadingFollowing } = useFollowers(userId);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoadingFollowing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('profile.following', 'Following')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const displayedFollowing = isExpanded 
    ? following 
    : following?.slice(0, INITIAL_DISPLAY_COUNT);
  
  const hasMore = (following?.length || 0) > INITIAL_DISPLAY_COUNT;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('profile.following', 'Following')} ({following?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!following?.length ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            {t('profile.notFollowingAnyone', 'Not following anyone yet')}
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {displayedFollowing?.map((item) => {
                const user = item.following as any;
                if (!user) return null;
                
                return (
                  <Link
                    key={item.id}
                    to={`/user/${user.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar_url || ''} alt={user.full_name || ''} />
                      <AvatarFallback className="text-xs">
                        {(user.full_name || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm font-medium truncate">{user.full_name || 'Anonymous'}</span>
                      {user.is_verified && (
                        <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            {hasMore && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-muted-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    {t('common.showLess', 'Show less')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {t('common.showMore', 'Show more')} ({(following?.length || 0) - INITIAL_DISPLAY_COUNT})
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
