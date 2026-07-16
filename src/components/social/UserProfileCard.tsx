import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserProfile } from '@/hooks/useProfile';
import { useFollowers } from '@/hooks/useFollowers';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Globe, Check, UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfileCardProps {
  profile: UserProfile;
  showFollowButton?: boolean;
}

export const UserProfileCard = ({ profile, showFollowButton = true }: UserProfileCardProps) => {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;
  
  const {
    isFollowing,
    follow,
    unfollow,
    isFollowingUser,
    isUnfollowing,
  } = useFollowers(profile.id);

  const handleFollowClick = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-lg">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-semibold">
                {profile.full_name || 'Anonymous User'}
              </h3>
              {profile.is_verified && (
                <Badge variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            {profile.bio && (
              <p className="text-muted-foreground mt-2 text-sm">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location and Website */}
        {(profile.location || profile.website) && (
          <div className="space-y-2">
            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Interests</h4>
            <div className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 5).map((interest, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.interests.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-6 py-2">
          <div className="text-center">
            <p className="text-lg font-semibold">{profile.followers_count}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{profile.following_count}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Follow Button */}
        {showFollowButton && !isOwnProfile && !user && (
          <Button asChild className="w-full">
            <Link to="/auth">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign in to follow
            </Link>
          </Button>
        )}

        {showFollowButton && !isOwnProfile && user && (
          <Button 
            onClick={handleFollowClick}
            disabled={isFollowingUser || isUnfollowing}
            variant={isFollowing ? "outline" : "default"}
            className="w-full"
          >
            {isFollowing ? (
              <>
                <UserMinus className="h-4 w-4 mr-2" />
                {isUnfollowing ? 'Unfollowing...' : 'Unfollow'}
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                {isFollowingUser ? 'Following...' : 'Follow'}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};