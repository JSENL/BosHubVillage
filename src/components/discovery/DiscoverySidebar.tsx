import { TrendingSection } from './TrendingSection';
import { BookmarksSection } from './BookmarksSection';
import { useAuth } from '@/hooks/useAuth';

export const DiscoverySidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-80 space-y-6 hidden lg:block">
      <TrendingSection />
      
      {user && <BookmarksSection />}
      
      {/* Recommended Users - placeholder for future implementation */}
      {user && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-3">Discover People</h3>
          <p className="text-sm text-muted-foreground">
            Find and connect with community members who share your interests.
          </p>
        </div>
      )}
    </div>
  );
};