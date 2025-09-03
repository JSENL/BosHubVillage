import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { UniversalFilters } from "@/components/UniversalFilters";
import { DataProvider } from './DataProvider';
import { FilterProvider } from './FilterProvider';
import { MapViewSection } from './MapViewSection';
import { ListViewSection } from './ListViewSection';
import { SearchSection } from './SearchSection';
import { ItemGrid } from './ItemGrid';
import { TranslationTestModal } from './TranslationTestModal';
import { DiscoverySidebar } from '@/components/discovery/DiscoverySidebar';
import { useDataContext } from './DataProvider';
import { useFilterContext } from './FilterProvider';

const MapViewContent = () => {
  const { allItems } = useDataContext();
  const { 
    filteredItems,
    selectedType,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    selectedVillage,
    setSelectedVillage,
    eventDateRange,
    setEventDateRange,
    selectedEventDates,
    setSelectedEventDates,
    setSelectedType,
    viewMode
  } = useFilterContext();

  if (viewMode === 'list') {
    return <ListViewSection />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex gap-6">
          {/* Main content */}
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
                searchTerm=""
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedNeighborhood={selectedNeighborhood}
                onNeighborhoodChange={setSelectedNeighborhood}
                selectedVillage={selectedVillage}
                onVillageChange={setSelectedVillage}
                eventDateRange={eventDateRange}
                onEventDateRangeChange={setEventDateRange}
                selectedEventDates={selectedEventDates}
                onSelectedEventDatesChange={setSelectedEventDates}
                filteredItemsCount={filteredItems.length}
                itemType="events"
              />
            </div>

            {/* Bottom grid - only show when in map view on all screen sizes */}
            <ItemGrid />
          </section>

          {/* Discovery sidebar */}
          <aside className="w-80 space-y-6 hidden lg:block" aria-label="Discovery and recommendations">
            <DiscoverySidebar />
          </aside>
        </div>
      </main>
      
      <TranslationTestModal />
    </div>
  );
};

export const HomePage = () => {
  return (
    <DataProvider>
      <HomePageContent />
    </DataProvider>
  );
};

const HomePageContent = () => {
  const { allItems } = useDataContext();
  
  return (
    <FilterProvider allItems={allItems}>
      <MapViewContent />
    </FilterProvider>
  );
};