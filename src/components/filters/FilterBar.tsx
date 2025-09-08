import { UniversalFilters } from '@/components/UniversalFilters';
import { SearchSection } from '@/components/pages/SearchSection';
import { UnifiedItem } from '@/types/unifiedItem';
import { DateRange } from 'react-day-picker';

interface FilterBarProps {
  allItems: UnifiedItem[];
  searchTerm: string;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  eventDateRange?: DateRange;
  onEventDateRangeChange: (range?: DateRange) => void;
  selectedEventDates: Date[];
  onSelectedEventDatesChange: (dates: Date[]) => void;
  filteredItemsCount: number;
}

export const FilterBar = ({
  allItems,
  searchTerm,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  selectedNeighborhood,
  onNeighborhoodChange,
  selectedVillage,
  onVillageChange,
  eventDateRange,
  onEventDateRangeChange,
  selectedEventDates,
  onSelectedEventDatesChange,
  filteredItemsCount,
}: FilterBarProps) => {
  return (
    <div className="space-y-4">
      {/* Search Section */}
      <SearchSection />
      
      {/* Filters */}
      <div className="bg-white rounded-lg border shadow-sm">
        <UniversalFilters
          allItems={allItems}
          searchTerm={searchTerm}
          selectedType={selectedType}
          onTypeChange={onTypeChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          selectedNeighborhood={selectedNeighborhood}
          onNeighborhoodChange={onNeighborhoodChange}
          selectedVillage={selectedVillage}
          onVillageChange={onVillageChange}
          eventDateRange={eventDateRange}
          onEventDateRangeChange={onEventDateRangeChange}
          selectedEventDates={selectedEventDates}
          onSelectedEventDatesChange={onSelectedEventDatesChange}
          filteredItemsCount={filteredItemsCount}
          itemType="events"
        />
      </div>
    </div>
  );
};