import { TrendingSection } from './TrendingSection';
import { BookmarksSection } from './BookmarksSection';
import { DiscoverPeople } from './DiscoverPeople';
import { FollowingActivityFeed } from './FollowingActivityFeed';
import { SavedSearchesList } from '@/components/search/SavedSearchesList';
import { useAuth } from '@/hooks/useAuth';

export const DiscoverySidebar = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {user && <FollowingActivityFeed />}
      
      <TrendingSection />
      
      {user && <SavedSearchesList />}
      
      {user && <BookmarksSection />}
      
      {user && <DiscoverPeople />}
    </div>
  );
};