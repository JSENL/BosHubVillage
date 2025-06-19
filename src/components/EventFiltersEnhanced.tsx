
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, Calendar } from 'lucide-react';

interface EventFiltersEnhancedProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  timeFilter: string;
  onTimeFilterChange: (time: string) => void;
  filteredEventsCount: number;
}

export const EventFiltersEnhanced = ({
  selectedCategory,
  onCategoryChange,
  selectedNeighborhood,
  onNeighborhoodChange,
  dateFilter,
  onDateFilterChange,
  timeFilter,
  onTimeFilterChange,
  filteredEventsCount
}: EventFiltersEnhancedProps) => {
  const categories = [
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

      <div className="text-xs sm:text-sm text-yelp-gray">
        {filteredEventsCount} events found
      </div>
    </div>
  );
};
