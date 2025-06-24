
import { useDynamicFilterOptions } from '@/hooks/useDynamicFilterOptions';
import { EventWithFilters } from '@/hooks/useEventsWithFilters';
import { FilterHeader } from './filters/FilterHeader';
import { CategoryFilter } from './filters/CategoryFilter';
import { LocationFilter } from './filters/LocationFilter';
import { DateTimeFilter } from './filters/DateTimeFilter';
import { ClearAllButton } from './filters/ClearAllButton';

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

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <FilterHeader filteredEventsCount={filteredEventsCount} />
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        availableCategories={availableCategories}
      />

      <LocationFilter 
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={onNeighborhoodChange}
        selectedVillage={selectedVillage}
        onVillageChange={onVillageChange}
        availableNeighborhoods={availableNeighborhoods}
        availableVillages={availableVillages}
      />

      <DateTimeFilter 
        dateFilter={dateFilter}
        onDateFilterChange={onDateFilterChange}
        timeFilter={timeFilter}
        onTimeFilterChange={onTimeFilterChange}
      />

      <ClearAllButton 
        hasActiveFilters={hasActiveFilters}
        onClearAll={handleClearAll}
      />
    </div>
  );
};
