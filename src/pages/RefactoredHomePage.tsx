import { HeroSection } from "@/components/HeroSection";
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
      <HeroSection />
      
      <div className="flex gap-6">
        {/* Main content */}
        <section className="flex-1 space-y-4 md:space-y-6" aria-labelledby="community-heading">
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
          
          {/* Bottom grid for map view */}
          {filters.viewMode === 'map' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.slice(0, 6).map((item) => (
                <div key={`${item.type}-${item.id}`} className="bg-white rounded-lg border shadow-sm p-4">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{item.type}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Discovery sidebar */}
        <aside className="w-80 space-y-6 hidden lg:block" aria-label="Discovery and recommendations">
          <DiscoverySidebar />
        </aside>
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