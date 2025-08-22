import { DateRange } from 'react-day-picker';
import { UniversalFilters } from "@/components/UniversalFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Map, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { UnifiedItem } from "@/types/unifiedItem";
import { useState } from 'react';

interface ListViewFiltersProps {
  allItems: UnifiedItem[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  eventDateRange: DateRange | undefined;
  onEventDateRangeChange: (range: DateRange | undefined) => void;
  selectedEventDates: Date[];
  onSelectedEventDatesChange: (dates: Date[]) => void;
  filteredItemsCount: number;
  onViewModeChange: (mode: 'map' | 'list') => void;
}

export const ListViewFilters = ({
  allItems,
  searchTerm,
  onSearchTermChange,
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
  onViewModeChange
}: ListViewFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* Search and Map View Toggle Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events, businesses, local services..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10 w-full sm:w-64 md:w-80"
              />
            </div>
          </div>
          <Button
            onClick={() => onViewModeChange('map')}
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto justify-center text-caribbean-teal border-caribbean-teal hover:bg-caribbean-teal hover:text-white"
          >
            <Map className="h-4 w-4" />
            Map View
          </Button>
        </div>
      </div>

      {/* Collapsible Filters */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <div className="bg-white rounded-lg shadow-sm border">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-caribbean-teal" />
                <span className="font-semibold text-gray-900">Filters</span>
                <span className="text-sm text-gray-500">({filteredItemsCount} items found)</span>
              </div>
              {isFiltersOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="border-t">
            <div className="p-4">
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
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};