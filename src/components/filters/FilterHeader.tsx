
import { Filter } from 'lucide-react';

interface FilterHeaderProps {
  filteredEventsCount: number;
}

export const FilterHeader = ({ filteredEventsCount }: FilterHeaderProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-yelp-gray" />
        <span className="text-xs sm:text-sm font-medium text-yelp-gray">Filters:</span>
      </div>
      
      <div className="text-xs sm:text-sm text-yelp-gray">
        {filteredEventsCount} events found
      </div>
    </>
  );
};
