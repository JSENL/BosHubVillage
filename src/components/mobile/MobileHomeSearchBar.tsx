import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppState } from '@/contexts/AppStateContext';
import { countActiveHomeFilters } from '@/components/filters/HomeFiltersPanel';
import { MobileFiltersSheet } from '@/components/mobile/MobileFiltersSheet';
import { UnifiedItem } from '@/types/unifiedItem';

interface MobileHomeSearchBarProps {
  allItems: UnifiedItem[];
  filteredItemsCount: number;
}

export const MobileHomeSearchBar = ({
  allItems,
  filteredItemsCount,
}: MobileHomeSearchBarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { filters, updateFilter } = useAppState();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = countActiveHomeFilters(filters);

  const goToSiteSearch = () => {
    const q = filters.searchTerm.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <>
      <div className="space-y-2 lg:hidden" role="search" aria-label={t('mobile.homeSearch', 'Search and filter community content')}>
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Input
              type="search"
              enterKeyHint="search"
              placeholder={t('emptyStates.searchAllContent', 'Search events, businesses, news...')}
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10 h-11"
              aria-label={t('mobile.filterListPlaceholder', 'Filter the list below')}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 relative"
            onClick={() => setFiltersOpen(true)}
            aria-label={t('filters.filters', 'Filters')}
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeFilterCount > 0 ? (
              <Badge
                variant="default"
                className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 text-[10px] flex items-center justify-center"
              >
                {activeFilterCount}
              </Badge>
            ) : null}
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full h-9 text-muted-foreground gap-2"
          onClick={goToSiteSearch}
        >
          <Globe className="h-4 w-4 shrink-0" />
          {t('mobile.searchEntireSite', 'Search entire site (database)')}
        </Button>
      </div>

      <MobileFiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        allItems={allItems}
        filteredItemsCount={filteredItemsCount}
      />
    </>
  );
};
