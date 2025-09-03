import { TrendingSection } from './TrendingSection';
import { BookmarksSection } from './BookmarksSection';
import { DiscoverPeople } from './DiscoverPeople';
import { useAuth } from '@/hooks/useAuth';

export const DiscoverySidebar = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <TrendingSection />
      
      {user && <BookmarksSection />}
      
      {user && <DiscoverPeople />}
    </div>
  );
};