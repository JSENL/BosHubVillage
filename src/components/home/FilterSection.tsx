import { UniversalFilters } from "@/components/UniversalFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Map, List } from 'lucide-react';
import { HomePageFilters } from "@/hooks/useHomePageFilters";
import { UnifiedItem } from "@/types/unifiedItem";

interface FilterSectionProps {
  filters: HomePageFilters;
  allItems: UnifiedItem[];
  filteredItemsCount: number;
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  onNeighborhoodChange: (neighborhood: string) => void;
  onVillageChange: (village: string) => void;
  onViewModeChange: (mode: 'map' | 'list') => void;
  onEventDateRangeChange: (range: any) => void;
  onSelectedEventDatesChange: (dates: Date[]) => void;
}

export const FilterSection = ({
  filters,
  allItems,
  filteredItemsCount,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onNeighborhoodChange,
  onVillageChange,
  onViewModeChange,
  onEventDateRangeChange,
  onSelectedEventDatesChange
}: FilterSectionProps) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search events, businesses, news, or local resources..."
          value={filters.searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Universal Filters */}
      <UniversalFilters
        allItems={allItems}
        searchTerm={filters.searchTerm}
        selectedType={filters.selectedType}
        selectedCategory={filters.selectedCategory}
        selectedNeighborhood={filters.selectedNeighborhood}
        selectedVillage={filters.selectedVillage}
        eventDateRange={filters.eventDateRange}
        selectedEventDates={filters.selectedEventDates}
        onTypeChange={onTypeChange}
        onCategoryChange={onCategoryChange}
        onNeighborhoodChange={onNeighborhoodChange}
        onVillageChange={onVillageChange}
        onEventDateRangeChange={onEventDateRangeChange}
        onSelectedEventDatesChange={onSelectedEventDatesChange}
        filteredItemsCount={filteredItemsCount}
        itemType="events"
      />

      {/* View Mode Toggle */}
      <div className="flex justify-center space-x-2">
        <Button
          variant={filters.viewMode === 'map' ? 'default' : 'outline'}
          onClick={() => onViewModeChange('map')}
          className="flex items-center gap-2"
        >
          <Map className="h-4 w-4" />
          Map View
        </Button>
        <Button
          variant={filters.viewMode === 'list' ? 'default' : 'outline'}
          onClick={() => onViewModeChange('list')}
          className="flex items-center gap-2"
        >
          <List className="h-4 w-4" />
          List View
        </Button>
      </div>
    </div>
  );
};