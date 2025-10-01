
import { AppLayout } from '@/components/layout/AppLayout';
import { MapView } from '@/components/views/MapView';
import { ListView } from '@/components/views/ListView';
import { FilterBar } from '@/components/filters/FilterBar';
import { DiscoverySidebar } from '@/components/discovery/DiscoverySidebar';
import { TranslationTestModal } from '@/components/pages/TranslationTestModal';
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

          {/* Filter Bar */}
          <FilterBar
            allItems={allItems}
            filteredItemsCount={filteredItems.length}
          />
          
          {/* Map or List View */}
          {filters.viewMode === 'map' ? (
            <div className="h-[60vh] min-h-[400px] max-h-[800px] sm:h-[65vh] lg:h-[70vh] xl:h-[75vh]">
              <MapView
                items={filteredItems}
                selectedTypes={selectedTypesForMap}
                height="100%"
              />
            </div>
          ) : (
            <ListView
              items={filteredItems}
              isLoading={isLoading}
            />
          )}
          
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
    </AppStateProvider>
  );
};