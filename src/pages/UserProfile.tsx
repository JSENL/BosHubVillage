import { useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { UserProfileCard } from '@/components/social/UserProfileCard';
import { useProfile, usePublicProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserActivityFeed } from '@/components/profile/UserActivityFeed';
import { FollowersList } from '@/components/profile/FollowersList';
import { FollowingList } from '@/components/profile/FollowingList';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const isOwnProfile = user?.id === userId;
  
  // Use different hooks based on whether it's own profile or public profile
  const { profile: ownProfile, isLoading: isLoadingOwn } = useProfile(userId);
  const { data: publicProfile, isLoading: isLoadingPublic } = usePublicProfile(userId || '');
  
  const profile = isOwnProfile ? ownProfile : publicProfile;
  const isLoading = isOwnProfile ? isLoadingOwn : isLoadingPublic;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">User not found</h2>
              <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
              <Link to="/" className="inline-block mt-4">
                <Button variant="outline">Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <UserProfileCard 
              profile={profile as any} 
              showFollowButton={!isOwnProfile}
            />
            
            {/* Action buttons for own profile */}
            {isOwnProfile && (
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/edit-profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Feed */}
            <UserActivityFeed userId={userId || ''} />

            {/* Followers/Following */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FollowersList userId={userId || ''} />
              <FollowingList userId={userId || ''} />
            </div>

            {/* Submissions/Contributions - Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  User's submissions and contributions will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;