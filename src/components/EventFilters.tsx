
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface EventFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  filteredEventsCount: number;
}

export const EventFilters = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedLocation,
  onLocationChange,
  filteredEventsCount
}: EventFiltersProps) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'events', label: 'Events' },
    { value: 'news', label: 'News' },
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown Boston' },
    { value: 'cambridge', label: 'Cambridge' },
    { value: 'somerville', label: 'Somerville' },
    { value: 'back-bay', label: 'Back Bay' },
    { value: 'north-end', label: 'North End' },
    { value: 'south-end', label: 'South End' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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

      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.value} value={location.value}>
              {location.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priceRange} onValueChange={onPriceRangeChange}>
        <SelectTrigger className="w-24 sm:w-32 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
        </SelectContent>
      </Select>

      <div className="text-xs sm:text-sm text-yelp-gray">
        {filteredEventsCount} events found
      </div>
    </div>
  );
};
