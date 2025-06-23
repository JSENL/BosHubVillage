
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, X } from 'lucide-react';
import { useDynamicFilterOptions } from '@/hooks/useDynamicFilterOptions';
import { EventWithFilters } from '@/hooks/useEventsWithFilters';

interface EventFiltersEnhancedProps {
  events: EventWithFilters[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  timeFilter: string;
  onTimeFilterChange: (time: string) => void;
  searchTerm: string;
  filteredEventsCount: number;
}

export const EventFiltersEnhanced = ({
  events,
  selectedCategory,
  onCategoryChange,
  selectedNeighborhood,
  onNeighborhoodChange,
  selectedVillage,
  onVillageChange,
  dateFilter,
  onDateFilterChange,
  timeFilter,
  onTimeFilterChange,
  searchTerm,
  filteredEventsCount
}: EventFiltersEnhancedProps) => {
  
  const { availableCategories, availableNeighborhoods, availableVillages } = useDynamicFilterOptions({
    events,
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    dateFilter,
    timeFilter,
    searchTerm
  });

  const handleClearAll = () => {
    onCategoryChange('all');
    onNeighborhoodChange('all');
    onVillageChange('all');
    onDateFilterChange('');
    onTimeFilterChange('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || 
                          selectedNeighborhood !== 'all' || 
                          selectedVillage !== 'all' || 
                          dateFilter !== '' || 
                          timeFilter !== 'all';

  // Dynamic categories from database
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...availableCategories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1)
    }))
  ];

  // Dynamic neighborhoods from database
  const neighborhoodOptions = [
    { value: 'all', label: 'All Neighborhoods' },
    ...availableNeighborhoods.map(neighborhood => ({
      value: neighborhood.toLowerCase().replace(/\s+/g, '-'),
      label: neighborhood
    }))
  ];

  // Dynamic villages from database
  const villageOptions = [
    { value: 'all', label: 'All Villages' },
    ...availableVillages.map(village => ({
      value: village.toLowerCase().replace(/\s+/g, '-'),
      label: village
    }))
  ];

  const timeFilters = [
    { value: 'all', label: 'Any Time' },
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-12AM)' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-yelp-gray" />
        <span className="text-xs sm:text-sm font-medium text-yelp-gray">Filters:</span>
      </div>
      
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

      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-yelp-gray" />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="w-36 sm:w-40 h-8 sm:h-10 text-xs sm:text-sm"
          placeholder="Select date"
        />
      </div>

      <Select value={timeFilter} onValueChange={onTimeFilterChange}>
        <SelectTrigger className="w-32 sm:w-44 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          {timeFilters.map((time) => (
            <SelectItem key={time.value} value={time.value}>
              {time.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          onClick={handleClearAll}
          variant="outline"
          size="sm"
          className="h-8 sm:h-10 text-xs sm:text-sm gap-1"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
          Clear All
        </Button>
      )}

      <div className="text-xs sm:text-sm text-yelp-gray">
        {filteredEventsCount} events found
      </div>
    </div>
  );
};
