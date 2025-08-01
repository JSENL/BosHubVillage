
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { LocationFilter } from '@/components/filters/LocationFilter';
import { useUnifiedFilterOptions } from '@/hooks/useDatabaseFilterOptions';
import { EventDateFilter } from '@/components/filters/EventDateFilter';
import { DateRange } from 'react-day-picker';

interface UniversalFiltersProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  eventDateRange?: DateRange;
  onEventDateRangeChange?: (dateRange: DateRange | undefined) => void;
  selectedEventDates?: Date[];
  onSelectedEventDatesChange?: (dates: Date[]) => void;
  filteredItemsCount: number;
  itemType: 'events' | 'business' | 'news';
}

export const UniversalFilters = ({
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
  itemType
}: UniversalFiltersProps) => {
  // Use unified filter options that properly handle database categories
  const { categories, neighborhoods, villages } = useUnifiedFilterOptions(selectedType);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'event', label: 'Events' },
    { value: 'business', label: 'Business' },
    { value: 'news', label: 'News' },
    { value: 'local-service', label: 'Local Resources' },
    { value: 'past-event', label: 'Past Events' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        <span className="text-xs sm:text-sm font-medium text-gray-600">Filters:</span>
      </div>

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(selectedType === 'event' || selectedType === 'past-event' || selectedType === 'all') && (
        <EventDateFilter
          eventDateRange={eventDateRange}
          onEventDateRangeChange={onEventDateRangeChange}
          selectedEventDates={selectedEventDates}
          onSelectedEventDatesChange={onSelectedEventDatesChange}
        />
      )}
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        availableCategories={categories}
      />

      <LocationFilter
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={onNeighborhoodChange}
        selectedVillage={selectedVillage}
        onVillageChange={onVillageChange}
        availableNeighborhoods={neighborhoods}
        availableVillages={villages}
      />

      <div className="text-xs sm:text-sm text-gray-600">
        {filteredItemsCount} {selectedType === 'all' ? 'items' : selectedType === 'business' ? 'businesses' : itemType} found
      </div>
    </div>
  );
};
