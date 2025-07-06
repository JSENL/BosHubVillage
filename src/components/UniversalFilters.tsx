
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { 
  useEventFilterOptions, 
  useNewsFilterOptions, 
  useBusinessFilterOptions, 
  useLocalServiceFilterOptions 
} from '@/hooks/useDatabaseFilterOptions';

interface UniversalFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  selectedTypeFilter: string;
  onTypeFilterChange: (type: string) => void;
  filteredItemsCount: number;
  itemType: 'events' | 'businesses' | 'news' | 'local-services';
}

export const UniversalFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedNeighborhood,
  onNeighborhoodChange,
  selectedVillage,
  onVillageChange,
  selectedTypeFilter,
  onTypeFilterChange,
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

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'event', label: 'Events' },
    { value: 'business', label: 'Business' },
    { value: 'local-service', label: 'Local Resources' },
    { value: 'news', label: 'News' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1)
    }))
  ];

  const neighborhoodOptions = [
    { value: 'all', label: 'All Neighborhoods' },
    ...neighborhoods.map(neighborhood => ({
      value: neighborhood.toLowerCase().replace(/\s+/g, '-'),
      label: neighborhood
    }))
  ];

  const villageOptions = [
    { value: 'all', label: 'All Villages' },
    ...villages.map(village => ({
      value: village.toLowerCase().replace(/\s+/g, '-'),
      label: village
    }))
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        <span className="text-xs sm:text-sm font-medium text-gray-600">Filters:</span>
      </div>
      
      <Select value={selectedTypeFilter} onValueChange={onTypeFilterChange}>
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

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedNeighborhood} onValueChange={onNeighborhoodChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Neighborhood" />
        </SelectTrigger>
        <SelectContent>
          {neighborhoodOptions.map((neighborhood) => (
            <SelectItem key={neighborhood.value} value={neighborhood.value}>
              {neighborhood.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedVillage} onValueChange={onVillageChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Village" />
        </SelectTrigger>
        <SelectContent>
          {villageOptions.map((village) => (
            <SelectItem key={village.value} value={village.value}>
              {village.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="text-xs sm:text-sm text-gray-600">
        {filteredItemsCount} {itemType} found
      </div>
    </div>
  );
};
