import { TrendingSection } from './TrendingSection';
import { BookmarksSection } from './BookmarksSection';
import { DiscoverPeople } from './DiscoverPeople';
import { FollowingActivityFeed } from './FollowingActivityFeed';
import { SavedSearchesList } from '@/components/search/SavedSearchesList';
import { useAuth } from '@/hooks/useAuth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Users, TrendingUp, Bookmark, Search, Activity } from 'lucide-react';

export const DiscoverySidebar = () => {
  const { user } = useAuth();

  // Desktop view - show all sections normally
  const desktopView = (
    <div className="hidden lg:block space-y-4 w-full max-w-md mx-auto overflow-hidden">
      {user && <FollowingActivityFeed />}
      <TrendingSection />
      {user && <SavedSearchesList />}
      {user && <BookmarksSection />}
      {user && <DiscoverPeople />}
    </div>
  );

  // Mobile/Tablet view - collapsible accordion
  const mobileView = (
    <div className="lg:hidden w-full max-w-full overflow-hidden">
      <Accordion type="multiple" defaultValue={['trending']} className="space-y-2">
        {user && (
          <AccordionItem value="following" className="border rounded-lg bg-card overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Following Activity</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <FollowingActivityFeed />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="trending" className="border rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Trending Now</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <TrendingSection />
          </AccordionContent>
        </AccordionItem>

        {user && (
          <AccordionItem value="saved" className="border rounded-lg bg-card overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Saved Searches</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <SavedSearchesList />
            </AccordionContent>
          </AccordionItem>
        )}

        {user && (
          <AccordionItem value="bookmarks" className="border rounded-lg bg-card overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">My Bookmarks</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <BookmarksSection />
            </AccordionContent>
          </AccordionItem>
        )}

        {user && (
          <AccordionItem value="discover" className="border rounded-lg bg-card overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Discover People</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <DiscoverPeople />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );

  return (
    <>
      {desktopView}
      {mobileView}
    </>
  );
};
