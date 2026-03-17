import { useRef, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { MapView } from '@/components/views/MapView';
import { ListView } from '@/components/views/ListView';
import { FilterBar } from '@/components/filters/FilterBar';
import { DiscoverySidebar } from '@/components/discovery/DiscoverySidebar';
import { TranslationTestModal } from '@/components/pages/TranslationTestModal';
import { AppStateProvider } from '@/contexts/AppStateProvider';
import { useAppState } from '@/contexts/AppStateContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { OnboardingTour, OnboardingTourRef } from '@/components/onboarding/OnboardingTour';
import { Button } from '@/components/ui/button';
import { HelpCircle, Layers } from 'lucide-react';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { DonateSection } from '@/components/home/DonateSection';
import { Footer } from '@/components/common/Footer';
import { MobileCategoryChips } from '@/components/mobile/MobileCategoryChips';
import { MobileMapPreview } from '@/components/mobile/MobileMapPreview';
import { SwipeableCardStack } from '@/components/mobile/SwipeableCardStack';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { getQuickBrowseItems } from '@/utils/quickBrowseUtils';
import { useQuickBrowse, getQuickBrowseIds } from '@/hooks/useQuickBrowse';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/ErrorState';

const MainContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    allItems,
    isLoading,
    error,
    refetch,
    filters,
    updateFilter,
    filteredItems
  } = useAppState();
  const { entries } = useQuickBrowse();

  useEffect(() => {
    const state = location.state as { unauthorized?: boolean } | undefined;
    if (state?.unauthorized) {
      toast.error("You don't have access to that page.");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);
  const adminQuickBrowseIds = getQuickBrowseIds(entries);
  const quickBrowseItems = getQuickBrowseItems(filteredItems, 10, adminQuickBrowseIds.length > 0 ? adminQuickBrowseIds : undefined);
  
  const tourRef = useRef<OnboardingTourRef>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showSwipeCards, setShowSwipeCards] = useState(false);

  const handleHelpClick = () => {
    tourRef.current?.openTour();
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'near-me':
        // Could trigger geolocation filter
        break;
      case 'today':
        // Set to today's events by filtering
        updateFilter('selectedType', 'event');
        break;
      case 'popular':
        // Could sort by popularity
        break;
    }
  };

  const handleRefresh = useCallback(async () => {
    // Simple refresh - page will refetch on mount
    await new Promise(resolve => setTimeout(resolve, 800));
    window.location.reload();
  }, []);

  const selectedTypesForMap = filters.selectedType === 'all' 
    ? ['event', 'business', 'local-service', 'news'] 
    : [filters.selectedType];

  // Loading skeleton for mobile
  const MobileLoadingSkeleton = () => (
    <div className="space-y-4 lg:hidden">
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <ErrorState error={error} onRetry={refetch} title="Couldn't load content" />
      </div>
    );
  }

  return (
    <>
      {/* Help Button - Fixed position */}
      <Button
        onClick={handleHelpClick}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        title="Need help? Start the tour"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      {/* Swipeable Cards Overlay */}
      {showSwipeCards && quickBrowseItems.length > 0 && (
        <SwipeableCardStack
          items={quickBrowseItems}
          onClose={() => setShowSwipeCards(false)}
        />
      )}

      <PullToRefresh onRefresh={handleRefresh} disabled={isLoading}>
        <div className="w-full overflow-x-hidden" aria-live="polite" aria-busy={isLoading}>
          <ResizablePanelGroup direction="horizontal" className="gap-4 md:gap-6">
            {/* Main content */}
            <ResizablePanel defaultSize={70} minSize={40}>
              <section className="space-y-4 md:space-y-6" aria-labelledby="community-heading">
                <div className="flex items-center justify-between">
                  <h1 id="community-heading" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    Local Community
                  </h1>
                  {/* Desktop view toggle */}
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={() => updateFilter('viewMode', filters.viewMode === 'map' ? 'list' : 'map')}
                      className="px-3 py-1 bg-white border rounded-lg text-sm hover:bg-gray-50"
                    >
                      {filters.viewMode === 'map' ? 'List View' : 'Map View'}
                    </button>
                  </div>
                </div>

                {/* Featured Section - shows sponsored items */}
                <FeaturedSection items={allItems} />

                {/* Mobile Category Chips */}
                <MobileCategoryChips
                  selectedType={filters.selectedType}
                  onTypeChange={(type) => updateFilter('selectedType', type)}
                  onQuickAction={handleQuickAction}
                />

                {/* Filter Bar - hidden on smallest mobile */}
                <div className="hidden sm:block">
                  <FilterBar
                    allItems={allItems}
                    filteredItemsCount={filteredItems.length}
                  />
                </div>

                {/* Mobile/Tablet Content */}
                <div className="lg:hidden space-y-4">
                  {isLoading ? (
                    <MobileLoadingSkeleton />
                  ) : (
                    <>
                      {/* Swipe Browse Button */}
                      {quickBrowseItems.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setShowSwipeCards(true)}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300"
                        >
                          <Layers className="h-4 w-4" />
                          Quick Browse ({quickBrowseItems.length} items)
                        </Button>
                      )}

                      {/* Map Preview */}
                      {!showMobileMap && (
                        <MobileMapPreview 
                          items={filteredItems}
                          onShowMap={() => setShowMobileMap(true)}
                        />
                      )}
                      
                      {showMobileMap && (
                        <div className="space-y-2 animate-fade-in">
                          <div className="h-[350px] rounded-lg border overflow-hidden shadow-lg">
                            <MapView
                              items={filteredItems}
                              selectedTypes={selectedTypesForMap}
                              height="100%"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMobileMap(false)}
                            className="w-full text-muted-foreground"
                          >
                            Hide Map
                          </Button>
                        </div>
                      )}
                      
                      {/* List View with animation */}
                      <div className="bg-background animate-fade-in">
                        <ListView
                          items={filteredItems}
                          isLoading={isLoading}
                          emptyStateVariant={filters.selectedType === 'all' ? 'filter' : filters.selectedType === 'event' ? 'events' : (filters.selectedType as 'business' | 'news' | 'local-service')}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                {/* Desktop: Resizable panels or list view based on viewMode */}
                <div className="hidden lg:block">
                  {filters.viewMode === 'map' ? (
                    <ResizablePanelGroup 
                      direction="vertical" 
                      className="min-h-[900px] rounded-lg border"
                    >
                      <ResizablePanel defaultSize={50} minSize={25}>
                        <div className="h-full">
                          <MapView
                            items={filteredItems}
                            selectedTypes={selectedTypesForMap}
                            height="100%"
                          />
                        </div>
                      </ResizablePanel>
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={50} minSize={25}>
                        <div className="h-full overflow-y-auto p-4 bg-background">
                          <ListView
                            items={filteredItems}
                            isLoading={isLoading}
                            emptyStateVariant={filters.selectedType === 'all' ? 'filter' : filters.selectedType === 'event' ? 'events' : (filters.selectedType as 'business' | 'news' | 'local-service')}
                          />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  ) : (
                    <ListView
                      items={filteredItems}
                      isLoading={isLoading}
                      emptyStateVariant={filters.selectedType === 'all' ? 'filter' : filters.selectedType === 'event' ? 'events' : (filters.selectedType as 'business' | 'news' | 'local-service')}
                    />
                  )}
                </div>
              </section>
            </ResizablePanel>

            <ResizableHandle withHandle className="hidden lg:flex" />

            {/* Discovery sidebar - resizable on desktop only */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="hidden lg:block">
              <aside aria-label="Discovery and recommendations">
                <DiscoverySidebar />
              </aside>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile/Tablet: Discovery section below main content */}
        <aside className="lg:hidden w-full mt-6" aria-label="Discovery and recommendations">
          <h2 className="text-lg font-semibold mb-3 px-1">Community & Discovery</h2>
          <DiscoverySidebar />
        </aside>

        {/* Donate Section */}
        <div className="mt-8">
          <DonateSection />
        </div>
      </PullToRefresh>

      <OnboardingTour ref={tourRef} />
      
      <TranslationTestModal />
    </>
  );
};

export const RefactoredHomePage = () => {
  return (
    <AppStateProvider>
      <AppLayout>
        <MainContent />
      </AppLayout>
      <Footer />
    </AppStateProvider>
  );
};
