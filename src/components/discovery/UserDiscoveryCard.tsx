import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Users, CheckCircle } from 'lucide-react';
import { UserProfile } from '@/hooks/useDiscoverPeople';
import { useFollowers } from '@/hooks/useFollowers';

interface UserDiscoveryCardProps {
  user: UserProfile;
  reason?: string;
}

export const UserDiscoveryCard = ({ user, reason }: UserDiscoveryCardProps) => {
  const { isFollowing, follow, unfollow, isFollowingUser, isUnfollowing } = useFollowers(user.id);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFollowClick = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  return (
    <div className="bg-white rounded-lg border p-2 sm:p-3 md:p-4 hover:shadow-md transition-shadow w-full min-w-0">
      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs sm:text-sm">
            {getInitials(user.full_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            <h4 className="font-medium text-xs sm:text-sm truncate">
              {user.full_name || 'Anonymous User'}
            </h4>
            {user.is_verified && (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
            )}
          </div>
          
          {user.location && (
            <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
              <span className="truncate">{user.location}</span>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleFollowClick}
          disabled={isFollowingUser || isUnfollowing}
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          className="flex-shrink-0 text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
        >
          {isFollowingUser ? 'Following...' : 
           isUnfollowing ? 'Unfollowing...' :
           isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
      
      {user.bio && (
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2 break-words">
          {user.bio}
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
          <span className="truncate">{user.followers_count} followers</span>
        </div>
        
        {reason && (
          <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0 w-fit">
            {reason}
          </Badge>
        )}
      </div>
      
      {user.interests && user.interests.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {user.interests.slice(0, 3).map((interest, idx) => (
            <Badge 
              key={idx} 
              variant="outline" 
              className="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 truncate max-w-full"
            >
              {interest}
            </Badge>
          ))}
          {user.interests.length > 3 && (
            <Badge variant="outline" className="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 flex-shrink-0">
              +{user.interests.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};