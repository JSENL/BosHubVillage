import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { UniversalFilters } from "@/components/UniversalFilters";
import { AppStateProvider } from '@/contexts/AppStateProvider';
import { useAppState } from '@/contexts/AppStateContext';
import { MapViewSection } from './MapViewSection';
import { SearchSection } from './SearchSection';
import { ListViewSection } from './ListViewSection';
import { ItemGrid } from './ItemGrid';
import { DiscoverySidebar } from '@/components/discovery/DiscoverySidebar';
import { useAuth } from '@/hooks/useAuth';

const MapViewContent = () => {
  const { allItems, filters, updateFilter, filteredItems } = useAppState();
  const { user } = useAuth();

  if (filters.viewMode === 'list') {
    return <ListViewSection />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex gap-6">
          {/* Main content - full width when not logged in */}
          <section className="flex-1 space-y-4 md:space-y-6" aria-labelledby="community-heading">
            <h1 id="community-heading" className="text-xl md:text-2xl font-bold text-gray-900">Local Community</h1>
            
            {/* Mobile-responsive map */}
            <MapViewSection />

            {/* Search all content - positioned below map and above filters */}
            <SearchSection />

            {/* Mobile-optimized filters */}
            <div className="bg-white rounded-lg border shadow-sm">
              <UniversalFilters
                allItems={allItems}
                searchTerm={filters.searchTerm}
                selectedType={filters.selectedType}
                onTypeChange={(type) => updateFilter('selectedType', type)}
                selectedCategory={filters.selectedCategory}
                onCategoryChange={(category) => updateFilter('selectedCategory', category)}
                selectedNeighborhood={filters.selectedNeighborhood}
                onNeighborhoodChange={(neighborhood) => updateFilter('selectedNeighborhood', neighborhood)}
                selectedVillage={filters.selectedVillage}
                onVillageChange={(village) => updateFilter('selectedVillage', village)}
                eventDateRange={filters.eventDateRange}
                onEventDateRangeChange={(range) => updateFilter('eventDateRange', range)}
                selectedEventDates={filters.selectedEventDates}
                onSelectedEventDatesChange={(dates) => updateFilter('selectedEventDates', dates)}
                filteredItemsCount={filteredItems.length}
                itemType="events"
              />
            </div>

            {/* Bottom grid - only show when in map view on all screen sizes */}
            <ItemGrid />
          </section>

          {/* Discovery sidebar - only show when user is logged in */}
          {user && (
            <aside className="w-80 space-y-6 hidden lg:block flex-shrink-0" aria-label="Discovery and recommendations">
              <DiscoverySidebar />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export const HomePage = () => {
  return (
    <AppStateProvider>
      <MapViewContent />
    </AppStateProvider>
  );
};
