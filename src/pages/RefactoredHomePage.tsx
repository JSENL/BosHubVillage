import { useRef, useState } from 'react';
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
import { HelpCircle, Map as MapIcon } from 'lucide-react';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { DonateSection } from '@/components/home/DonateSection';
import { Footer } from '@/components/common/Footer';

const MainContent = () => {
  const { 
    allItems, 
    isLoading, 
    filters, 
    updateFilter, 
    filteredItems 
  } = useAppState();
  
  const tourRef = useRef<OnboardingTourRef>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);

  const handleHelpClick = () => {
    tourRef.current?.openTour();
  };

  const selectedTypesForMap = filters.selectedType === 'all' 
    ? ['event', 'business', 'local-service', 'news'] 
    : [filters.selectedType];

  return (
    <>
      {/* Help Button - Fixed position */}
      <Button
        onClick={handleHelpClick}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        title="Need help? Start the tour"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <ResizablePanelGroup direction="horizontal" className="gap-6">
        {/* Main content */}
        <ResizablePanel defaultSize={70} minSize={40}>
          <section className="space-y-4 md:space-y-6" aria-labelledby="community-heading">
            <div className="flex items-center justify-between">
              <h1 id="community-heading" className="text-xl md:text-2xl font-bold text-gray-900">
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

            {/* Filter Bar */}
            <FilterBar
              allItems={allItems}
              filteredItemsCount={filteredItems.length}
            />

            {/* Mobile/Tablet: Show map toggle button and list first */}
            <div className="lg:hidden space-y-4">
              <Button
                onClick={() => setShowMobileMap(!showMobileMap)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <MapIcon className="h-4 w-4" />
                {showMobileMap ? 'Hide Map' : 'Show Map'}
              </Button>
              
              {showMobileMap && (
                <div className="h-[400px] rounded-lg border overflow-hidden">
                  <MapView
                    items={filteredItems}
                    selectedTypes={selectedTypesForMap}
                    height="100%"
                  />
                </div>
              )}
              
              <div className="bg-background">
                <ListView
                  items={filteredItems}
                  isLoading={isLoading}
                />
              </div>
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
                      />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <ListView
                  items={filteredItems}
                  isLoading={isLoading}
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

      {/* Mobile/Tablet: Discovery section below main content */}
      <aside className="lg:hidden w-full mt-6" aria-label="Discovery and recommendations">
        <DiscoverySidebar />
      </aside>

      {/* Donate Section */}
      <div className="mt-8">
        <DonateSection />
      </div>

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