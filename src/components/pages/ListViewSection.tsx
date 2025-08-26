import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { ListViewFilters } from "@/components/ListViewFilters";
import { useDataContext } from './DataProvider';
import { useFilterContext } from './FilterProvider';
import { ItemGrid } from './ItemGrid';

export const ListViewSection = () => {
  const { allItems, isLoading } = useDataContext();
  const { 
    filteredItems,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
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
    setViewMode
  } = useFilterContext();

  const handleViewModeChange = (newViewMode: 'map' | 'list') => {
    setViewMode(newViewMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 w-full">
      <Navigation />
      <HeroSection />
      
      {/* Filters Component */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <ListViewFilters
          allItems={allItems}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
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
          onViewModeChange={handleViewModeChange}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Local Community</h2>
            <div className="text-sm text-gray-600">
              {filteredItems.length} results found
            </div>
          </div>

          {/* Content list */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading content...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-6">
                <ItemGrid />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No content found. Try adjusting your filters!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};