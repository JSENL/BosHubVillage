import { EventCard } from "@/components/EventCard";
import NewsCard from "@/components/NewsCard";
import BusinessCard from "@/components/BusinessCard";
import LocalServiceCard from "@/components/LocalServiceCard";
import { getEventCardData, getNewsCardData, getBusinessCardData, getLocalServiceCardData } from '@/utils/cardTranslationData';
import { IllustratedEmptyState } from '@/components/common/IllustratedEmptyState';
import { EnhancedUniversalMap } from "@/components/EnhancedUniversalMap";
import { UnifiedItem } from "@/types/unifiedItem";
import { HomePageFilters } from "@/hooks/useHomePageFilters";
import { UnifiedItemCard } from "@/components/UnifiedItemCard";

interface ContentSectionProps {
  filters: HomePageFilters;
  allItems: UnifiedItem[];
  filteredItems: UnifiedItem[];
  isLoading: boolean;
}

export const ContentSection = ({
  filters,
  allItems,
  filteredItems,
  isLoading
}: ContentSectionProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  if (filters.viewMode === 'map') {
    return (
      <div className="space-y-6">
        <EnhancedUniversalMap 
          items={allItems} 
          height="600px"
          selectedTypes={['event', 'business', 'local-service', 'news']}
        />
      </div>
    );
  }

  if (filters.viewMode === 'list') {
    const compact = filters.listDensity === 'compact';
    return (
      <div className="space-y-6">
        <div className="text-center text-muted-foreground">
          Showing {filteredItems.length} items
          {filters.selectedType !== 'all' && ` (${filters.selectedType})`}
        </div>
        <div
          className="mx-auto flex w-full max-w-4xl flex-col gap-2"
          data-list-density={filters.listDensity}
        >
          {filteredItems.map((item) => (
            <UnifiedItemCard
              key={`${item.type}-${item.id}`}
              item={item}
              viewMode="list"
              listCompact={compact}
            />
          ))}
        </div>
        {filteredItems.length === 0 && <IllustratedEmptyState variant="filter" />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Display total count */}
      <div className="text-center text-muted-foreground">
        Showing {filteredItems.length} items
        {filters.selectedType !== 'all' && ` (${filters.selectedType})`}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
        {filteredItems.map((item) => {
          switch (item.type) {
            case 'event':
              return (
                <EventCard
                  key={`event-${item.id}`}
                  event={getEventCardData(item)}
                  viewMode="grid"
                />
              );
            case 'news':
              return (
                <NewsCard
                  key={`news-${item.id}`}
                  news={getNewsCardData(item)}
                />
              );
            case 'business':
              return (
                <BusinessCard
                  key={`business-${item.id}`}
                  business={getBusinessCardData(item)}
                />
              );
            case 'local-service':
              return (
                <LocalServiceCard
                  key={`local-service-${item.id}`}
                  localService={getLocalServiceCardData(item)}
                />
              );
            default:
              return null;
          }
        })}
      </div>

      {filteredItems.length === 0 && <IllustratedEmptyState variant="filter" />}
    </div>
  );
};