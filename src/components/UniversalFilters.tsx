
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { LocationFilter } from '@/components/filters/LocationFilter';
import { NearMeFilter } from '@/components/filters/NearMeFilter';
import { useDynamicUnifiedFilterOptions } from '@/hooks/useDynamicUnifiedFilterOptions';
import { EventDateFilter } from '@/components/filters/EventDateFilter';
import { DateRange } from 'react-day-picker';
import { UnifiedItem } from '@/types/unifiedItem';

interface UniversalFiltersProps {
  allItems: UnifiedItem[];
  searchTerm: string;
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
  // Near me props
  maxDistance?: number | null;
  onMaxDistanceChange?: (distance: number | null) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  onLocationRequest?: () => Promise<{ latitude: number; longitude: number } | null>;
  onClearLocation?: () => void;
  isLoadingLocation?: boolean;
  layout?: 'inline' | 'stacked';
}

export const UniversalFilters = ({
  allItems,
  searchTerm,
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
  itemType,
  maxDistance,
  onMaxDistanceChange,
  userLocation,
  onLocationRequest,
  onClearLocation,
  isLoadingLocation,
  layout = 'inline',
}: UniversalFiltersProps) => {
  const { t } = useTranslation();
  // Use dynamic filter options based on current filters
  const { availableCategories, availableNeighborhoods, availableVillages } = useDynamicUnifiedFilterOptions({
    allItems,
    selectedType,
    selectedNeighborhood,
    selectedVillage,
    searchTerm,
    eventDateRange,
    selectedEventDates
  });

  const typeOptions = [
    { value: 'all', label: t('types.all') },
    { value: 'event', label: t('types.event') },
    { value: 'business', label: t('types.business') },
    { value: 'local-service', label: t('types.localService') }
  ];

  const isStacked = layout === 'stacked';

  return (
    <div
      className={
        isStacked
          ? 'flex flex-col gap-3 w-full'
          : 'flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border w-full overflow-hidden'
      }
    >
      <div className={`flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ${isStacked ? '' : ''}`}>
        <Filter className="h-4 w-4 text-gray-600" />
        <span className="text-xs font-medium text-gray-600">{t('filters.filters')}:</span>
      </div>

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger
          className={
            isStacked ? 'w-full h-10 text-sm' : 'w-28 sm:w-36 md:w-44 h-8 text-xs flex-shrink-0'
          }
        >
          <SelectValue placeholder={t('filters.type')} />
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
        <div className={isStacked ? 'w-full' : undefined}>
          <EventDateFilter
            eventDateRange={eventDateRange}
            onEventDateRangeChange={onEventDateRangeChange}
            selectedEventDates={selectedEventDates}
            onSelectedEventDatesChange={onSelectedEventDatesChange}
          />
        </div>
      )}

      <div className={isStacked ? 'w-full [&_button]:w-full' : undefined}>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          availableCategories={availableCategories}
        />
      </div>

      <div className={isStacked ? 'w-full space-y-2 [&_button]:w-full' : undefined}>
        <LocationFilter
          selectedNeighborhood={selectedNeighborhood}
          onNeighborhoodChange={onNeighborhoodChange}
          selectedVillage={selectedVillage}
          onVillageChange={onVillageChange}
          availableNeighborhoods={availableNeighborhoods}
          availableVillages={availableVillages}
        />
      </div>

      {onMaxDistanceChange && onLocationRequest && onClearLocation && (
        <div className={isStacked ? 'w-full' : undefined}>
          <NearMeFilter
            maxDistance={maxDistance ?? null}
            onMaxDistanceChange={onMaxDistanceChange}
            userLocation={userLocation ?? null}
            onLocationRequest={onLocationRequest}
            onClearLocation={onClearLocation}
            isLoading={isLoadingLocation ?? false}
          />
        </div>
      )}

      {!isStacked ? (
        <div className="text-xs text-gray-600 flex-shrink-0 ml-auto">
          {t('filters.resultsCount', { count: filteredItemsCount })}
        </div>
      ) : null}
    </div>
  );
};
