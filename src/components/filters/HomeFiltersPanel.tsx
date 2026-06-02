import { useTranslation } from 'react-i18next';
import { UniversalFilters } from '@/components/UniversalFilters';
import { SearchSection } from '@/components/pages/SearchSection';
import { ClearAllButton } from '@/components/filters/ClearAllButton';
import { UnifiedItem } from '@/types/unifiedItem';
import { useAppState } from '@/contexts/AppStateContext';

type HomeFilters = ReturnType<typeof useAppState>['filters'];

interface HomeFiltersPanelProps {
  allItems: UnifiedItem[];
  filteredItemsCount: number;
  /** Stack filters vertically (mobile sheet). */
  layout?: 'inline' | 'stacked';
}

export function countActiveHomeFilters(filters: HomeFilters): number {
  let n = 0;
  if (filters.selectedType !== 'all') n++;
  if (filters.selectedCategory !== 'all') n++;
  if (filters.selectedNeighborhood !== 'all') n++;
  if (filters.selectedVillage !== 'all') n++;
  if (filters.searchTerm.trim()) n++;
  if (filters.eventDateRange?.from || filters.selectedEventDates.length > 0) n++;
  if (filters.maxDistance != null) n++;
  return n;
}

export const HomeFiltersPanel = ({
  allItems,
  filteredItemsCount,
  layout = 'inline',
}: HomeFiltersPanelProps) => {
  const { t } = useTranslation();
  const {
    filters,
    updateFilter,
    clearAllFilters,
    userLocation,
    isLoadingLocation,
    requestLocation,
    clearLocation,
  } = useAppState();

  const activeCount = countActiveHomeFilters(filters);

  return (
    <div className="space-y-4">
      <div data-tour="search">
        <SearchSection />
      </div>

      <div
        className={
          layout === 'stacked'
            ? 'rounded-lg border bg-white shadow-sm p-4 space-y-4'
            : 'bg-white rounded-lg border shadow-sm'
        }
        data-tour="filters"
      >
        <UniversalFilters
          layout={layout}
          allItems={allItems}
          searchTerm={filters.searchTerm}
          selectedType={filters.selectedType}
          onTypeChange={(type) => updateFilter('selectedType', type)}
          selectedCategory={filters.selectedCategory}
          onCategoryChange={(category) => updateFilter('selectedCategory', category)}
          selectedNeighborhood={filters.selectedNeighborhood}
          onNeighborhoodChange={(neighborhood) => updateFilter('selectedNeighborhood', neighborhood)}
          selectedVillage={filters.selectedVillage}
          onVillageChange={(village) => updateFilter('selectedVillage', village)}
          eventDateRange={filters.eventDateRange}
          onEventDateRangeChange={(range) => updateFilter('eventDateRange', range)}
          selectedEventDates={filters.selectedEventDates}
          onSelectedEventDatesChange={(dates) => updateFilter('selectedEventDates', dates)}
          filteredItemsCount={filteredItemsCount}
          itemType="events"
          maxDistance={filters.maxDistance}
          onMaxDistanceChange={(distance) => updateFilter('maxDistance', distance)}
          userLocation={userLocation}
          onLocationRequest={requestLocation}
          onClearLocation={clearLocation}
          isLoadingLocation={isLoadingLocation}
        />
      </div>

      {layout === 'stacked' && activeCount > 0 ? (
        <ClearAllButton hasActiveFilters onClearAll={clearAllFilters} />
      ) : null}

      {layout === 'stacked' ? (
        <p className="text-xs text-muted-foreground text-center">
          {t('filters.resultsCount', { count: filteredItemsCount })}
        </p>
      ) : null}
    </div>
  );
};
