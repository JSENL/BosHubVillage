
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { TypeFilter } from '@/components/filters/TypeFilter';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { LocationFilter } from '@/components/filters/LocationFilter';
import { DateTimeFilter } from '@/components/filters/DateTimeFilter';
import { 
  useEventFilterOptions, 
  useNewsFilterOptions, 
  useBusinessFilterOptions, 
  useLocalServiceFilterOptions 
} from '@/hooks/useDatabaseFilterOptions';

interface UniversalFiltersProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  dateFilter?: string;
  onDateFilterChange?: (date: string) => void;
  timeFilter?: string;
  onTimeFilterChange?: (time: string) => void;
  filteredItemsCount: number;
  itemType: 'events' | 'businesses' | 'news' | 'local-services';
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
  dateFilter = '',
  onDateFilterChange,
  timeFilter = 'all',
  onTimeFilterChange,
  filteredItemsCount,
  itemType
}: UniversalFiltersProps) => {
  const eventOptions = useEventFilterOptions();
  const newsOptions = useNewsFilterOptions();
  const businessOptions = useBusinessFilterOptions();
  const localServiceOptions = useLocalServiceFilterOptions();

  const getFilterOptions = () => {
    switch (itemType) {
      case 'events':
        return eventOptions;
      case 'news':
        return newsOptions;
      case 'businesses':
        return businessOptions;
      case 'local-services':
        return localServiceOptions;
      default:
        return { categories: [], neighborhoods: [], villages: [] };
    }
  };

  const { categories, neighborhoods, villages } = getFilterOptions();

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        <span className="text-xs sm:text-sm font-medium text-gray-600">Filters:</span>
      </div>
      
      <TypeFilter
        selectedType={selectedType}
        onTypeChange={onTypeChange}
      />
      
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

      {onDateFilterChange && onTimeFilterChange && (
        <DateTimeFilter
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
          timeFilter={timeFilter}
          onTimeFilterChange={onTimeFilterChange}
        />
      )}

      <div className="text-xs sm:text-sm text-gray-600">
        {filteredItemsCount} {itemType} found
      </div>
    </div>
  );
};
