import { HomeFiltersPanel } from '@/components/filters/HomeFiltersPanel';
import { UnifiedItem } from '@/types/unifiedItem';

interface FilterBarProps {
  allItems: UnifiedItem[];
  filteredItemsCount: number;
}

export const FilterBar = ({ allItems, filteredItemsCount }: FilterBarProps) => (
  <HomeFiltersPanel allItems={allItems} filteredItemsCount={filteredItemsCount} layout="inline" />
);