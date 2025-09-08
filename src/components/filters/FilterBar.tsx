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
  const { filters, updateFilter } = useAppState();
  return (
    <div className="space-y-4">
      {/* Search Section */}
      <SearchSection />
      
      {/* Filters */}
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
          filteredItemsCount={filteredItemsCount}
          itemType="events"
        />
      </div>
    </div>
  );
};