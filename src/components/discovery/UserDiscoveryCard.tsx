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
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">
                {user.full_name || 'Anonymous User'}
              </h4>
              {user.is_verified && (
                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            
            {user.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{user.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={handleFollowClick}
          disabled={isFollowingUser || isUnfollowing}
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          className="flex-shrink-0"
        >
          {isFollowingUser ? 'Following...' : 
           isUnfollowing ? 'Unfollowing...' :
           isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
      
      {user.bio && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {user.bio}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{user.followers_count} followers</span>
        </div>
        
        {reason && (
          <Badge variant="secondary" className="text-xs">
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
              className="text-xs px-1.5 py-0.5"
            >
              {interest}
            </Badge>
          ))}
          {user.interests.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              +{user.interests.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};