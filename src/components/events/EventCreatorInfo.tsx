import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, UserMinus, User } from 'lucide-react';
import { useFollowers } from '@/hooks/useFollowers';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface EventCreatorInfoProps {
  creatorId: string;
}

export const EventCreatorInfo = ({ creatorId }: EventCreatorInfoProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { data: creator, isLoading } = useQuery({
    queryKey: ['profile', creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', creatorId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!creatorId,
  });

  const { 
    isFollowing, 
    follow, 
    unfollow, 
    isFollowingUser, 
    isUnfollowing,
    isCheckingFollow 
  } = useFollowers(creatorId);

  const isOwnProfile = user?.id === creatorId;

  const handleFollowClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  const handleProfileClick = () => {
    navigate(`/user/${creatorId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  if (!creator) {
    return null;
  }

  const initials = creator.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleProfileClick}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={creator.avatar_url || undefined} alt={creator.full_name || 'User'} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-muted-foreground">
          {t('events.postedBy')} <span className="text-foreground hover:underline">{creator.full_name || t('common.anonymous')}</span>
        </span>
      </div>
      
      {!isOwnProfile && (
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          onClick={handleFollowClick}
          disabled={isFollowingUser || isUnfollowing || isCheckingFollow}
          className="h-7 text-xs"
        >
          {isFollowing ? (
            <>
              <UserMinus className="h-3 w-3 mr-1" />
              {t('profile.unfollow')}
            </>
          ) : (
            <>
              <UserPlus className="h-3 w-3 mr-1" />
              {t('profile.follow')}
            </>
          )}
        </Button>
      )}
    </div>
  );
};
