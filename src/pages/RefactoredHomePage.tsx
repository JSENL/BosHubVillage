import { HeroSection } from "@/components/HeroSection";
import { AppLayout } from '@/components/layout/AppLayout';
import { MapView } from '@/components/views/MapView';
import { ListView } from '@/components/views/ListView';
import { FilterBar } from '@/components/filters/FilterBar';
import { DiscoverySidebar } from '@/components/discovery/DiscoverySidebar';
import { MapboxTestModal } from '@/components/pages/MapboxTestModal';
import { AppStateProvider } from '@/contexts/AppStateProvider';
import { useAppState } from '@/contexts/AppStateContext';

const MainContent = () => {
  const { 
    allItems, 
    isLoading, 
    filters, 
    updateFilter, 
    filteredItems 
  } = useAppState();

  const selectedTypesForMap = filters.selectedType === 'all' 
    ? ['event', 'business', 'local-service', 'news'] 
    : [filters.selectedType];

  return (
    <>
      <HeroSection />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Discovery sidebar - shows at top on mobile, side on desktop */}
        <aside className="w-full lg:w-80 lg:order-2" aria-label="Discovery and recommendations">
          <DiscoverySidebar />
        </aside>

        {/* Main content */}
        <section className="flex-1 lg:order-1 space-y-4 md:space-y-6" aria-labelledby="community-heading">
          <div className="flex items-center justify-between">
            <h1 id="community-heading" className="text-xl md:text-2xl font-bold text-gray-900">
              Local Community
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateFilter('viewMode', filters.viewMode === 'map' ? 'list' : 'map')}
                className="px-3 py-1 bg-white border rounded-lg text-sm hover:bg-gray-50"
              >
                {filters.viewMode === 'map' ? 'List View' : 'Map View'}
              </button>
            </div>
          </div>
          
          {/* Map or List View */}
          {filters.viewMode === 'map' ? (
            <div className="min-h-[540px]">
              <MapView
                items={filteredItems}
                selectedTypes={selectedTypesForMap}
                height="540px"
              />
            </div>
          ) : (
            <ListView
              items={filteredItems}
              isLoading={isLoading}
            />
          )}

          {/* Filter Bar */}
          <FilterBar
            allItems={allItems}
            filteredItemsCount={filteredItems.length}
          />
          
          {/* Full list view for map mode */}
          {filters.viewMode === 'map' && (
            <div className="max-h-96 overflow-y-auto">
              <ListView
                items={filteredItems}
                isLoading={isLoading}
              />
            </div>
          )}
        </section>
      </div>
      
      <MapboxTestModal />
    </>
  );
};

export const RefactoredHomePage = () => {
  return (
    <AppStateProvider>
      <AppLayout>
        <MainContent />
      </AppLayout>
    </AppStateProvider>
  );
};