import { TrendingSection } from './TrendingSection';
import { BookmarksSection } from './BookmarksSection';
import { DiscoverPeople } from './DiscoverPeople';
import { useAuth } from '@/hooks/useAuth';

export const DiscoverySidebar = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <TrendingSection />
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-32 rounded-lg"></div>
          <div className="bg-gray-200 h-32 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TrendingSection />
      
      {user ? (
        <>
          <BookmarksSection />
          <DiscoverPeople />
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">Sign in to discover people and view your bookmarks</p>
            <a href="/auth" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Sign In
            </a>
          </div>
        </div>
      )}
    </div>
  );
};