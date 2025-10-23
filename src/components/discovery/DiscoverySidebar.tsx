import { TrendingSection } from './TrendingSection';
import { BookmarksSection } from './BookmarksSection';
import { DiscoverPeople } from './DiscoverPeople';
import { FollowingActivityFeed } from './FollowingActivityFeed';
import { useAuth } from '@/hooks/useAuth';

export const DiscoverySidebar = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {user && <FollowingActivityFeed />}
      
      <TrendingSection />
      
      {user && <BookmarksSection />}
      
      {user && <DiscoverPeople />}
    </div>
  );
};