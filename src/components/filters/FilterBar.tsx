import { UniversalFilters } from '@/components/UniversalFilters';
import { SearchSection } from '@/components/pages/SearchSection';
import { UnifiedItem } from '@/types/unifiedItem';
import { useAppState } from '@/contexts/AppStateContext';

interface FilterBarProps {
  allItems: UnifiedItem[];
  filteredItemsCount: number;
}

export const FilterBar = ({
  allItems,
  filteredItemsCount,
}: FilterBarProps) => {
  const { 
    filters, 
    updateFilter, 
    userLocation, 
    isLoadingLocation, 
    requestLocation, 
    clearLocation 
  } = useAppState();
  
  return (
    <div className="space-y-4">
      {/* Search Section */}
      <div data-tour="search">
        <SearchSection />
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg border shadow-sm" data-tour="filters">
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
          filteredItemsCount={filteredItemsCount}
          itemType="events"
          // Near Me props
          maxDistance={filters.maxDistance}
          onMaxDistanceChange={(distance) => updateFilter('maxDistance', distance)}
          userLocation={userLocation}
          onLocationRequest={requestLocation}
          onClearLocation={clearLocation}
          isLoadingLocation={isLoadingLocation}
        />
      </div>
    </div>
  );
};