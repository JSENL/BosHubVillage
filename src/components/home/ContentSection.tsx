import { EventCard } from "@/components/EventCard";
import NewsCard from "@/components/NewsCard";
import BusinessCard from "@/components/BusinessCard";
import LocalServiceCard from "@/components/LocalServiceCard";
import { SectionMap } from "@/components/SectionMap";
import { EnhancedUniversalMap } from "@/components/EnhancedUniversalMap";
import { UnifiedItem } from "@/types/unifiedItem";
import { HomePageFilters } from "@/hooks/useHomePageFilters";

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
        <SectionMap />
        <EnhancedUniversalMap 
          items={allItems} 
          height="600px"
          selectedTypes={['event', 'business', 'local-service', 'news']}
        />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          switch (item.type) {
            case 'event':
              return (
                <EventCard
                  key={`event-${item.id}`}
                  event={item.originalData}
                  viewMode="grid"
                />
              );
            case 'news':
              return (
                <NewsCard
                  key={`news-${item.id}`}
                  news={item.originalData}
                />
              );
            case 'business':
              return (
                <BusinessCard
                  key={`business-${item.id}`}
                  business={item.originalData}
                />
              );
            case 'local-service':
              return (
                <LocalServiceCard
                  key={`local-service-${item.id}`}
                  localService={item.originalData}
                />
              );
            default:
              return null;
          }
        })}
      </div>

      {/* No results message */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No items found matching your criteria.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
};