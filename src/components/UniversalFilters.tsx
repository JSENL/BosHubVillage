
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { useVillages } from '@/hooks/useVillages';

interface UniversalFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  filteredItemsCount: number;
  itemType: 'events' | 'businesses' | 'news';
}

export const UniversalFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedNeighborhood,
  onNeighborhoodChange,
  selectedVillage,
  onVillageChange,
  filteredItemsCount,
  itemType
}: UniversalFiltersProps) => {
  const { villages } = useVillages();

  const getCategories = () => {
    switch (itemType) {
      case 'events':
        return [
          { value: 'all', label: 'All Categories' },
          { value: 'music', label: 'Music' },
          { value: 'sports', label: 'Sports' },
          { value: 'food', label: 'Food & Drink' },
          { value: 'art', label: 'Arts & Culture' },
          { value: 'business', label: 'Business' },
          { value: 'education', label: 'Education' },
          { value: 'family', label: 'Family' },
          { value: 'health', label: 'Health & Wellness' },
          { value: 'community', label: 'Community' },
          { value: 'technology', label: 'Technology' },
        ];
      case 'businesses':
        return [
          { value: 'all', label: 'All Types' },
          { value: 'restaurant', label: 'Restaurant' },
          { value: 'retail', label: 'Retail' },
          { value: 'service', label: 'Service' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'professional', label: 'Professional' },
          { value: 'entertainment', label: 'Entertainment' },
        ];
      case 'news':
        return [
          { value: 'all', label: 'All Categories' },
          { value: 'local', label: 'Local News' },
          { value: 'business', label: 'Business' },
          { value: 'community', label: 'Community' },
          { value: 'events', label: 'Events' },
          { value: 'government', label: 'Government' },
        ];
      default:
        return [{ value: 'all', label: 'All Categories' }];
    }
  };

  const neighborhoods = [
    { value: 'all', label: 'All Neighborhoods' },
    { value: 'beacon-hill', label: 'Beacon Hill' },
    { value: 'back-bay', label: 'Back Bay' },
    { value: 'north-end', label: 'North End' },
    { value: 'south-end', label: 'South End' },
    { value: 'chinatown', label: 'Chinatown' },
    { value: 'financial-district', label: 'Financial District' },
    { value: 'fenway', label: 'Fenway' },
    { value: 'cambridge', label: 'Cambridge' },
    { value: 'somerville', label: 'Somerville' },
    { value: 'charlestown', label: 'Charlestown' },
    { value: 'roxbury', label: 'Roxbury' },
    { value: 'dorchester', label: 'Dorchester' },
  ];

  // Dynamic villages from database
  const villageOptions = [
    { value: 'all', label: 'All Villages' },
    ...villages.map(village => ({
      value: village.toLowerCase().replace(/\s+/g, '-'),
      label: village
    }))
  ];

  const categories = getCategories();

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        <span className="text-xs sm:text-sm font-medium text-gray-600">Filters:</span>
      </div>
      
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
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
          {neighborhoods.map((neighborhood) => (
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
