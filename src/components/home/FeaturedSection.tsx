import { Sparkles } from 'lucide-react';
import { UnifiedItem } from '@/types/unifiedItem';
import { EventCard } from '@/components/EventCard';
import NewsCard from '@/components/NewsCard';
import BusinessCard from '@/components/BusinessCard';
import LocalServiceCard from '@/components/LocalServiceCard';
import { getEventCardData, getNewsCardData, getBusinessCardData, getLocalServiceCardData } from '@/utils/cardTranslationData';

interface FeaturedSectionProps {
  items: UnifiedItem[];
}

/**
 * Displays a horizontal scrollable section of sponsored/featured items.
 * Only renders if there are sponsored items to show.
 */
export const FeaturedSection = ({ items }: FeaturedSectionProps) => {
  // Filter to only sponsored items
  const sponsoredItems = items.filter(item => item.is_sponsored === true);

  // Don't render if no sponsored items
  if (sponsoredItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-6 sm:mb-8 w-full overflow-hidden" data-testid="featured-section">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          <h2 className="text-sm sm:text-lg font-bold">Featured</h2>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {sponsoredItems.length} sponsored {sponsoredItems.length === 1 ? 'listing' : 'listings'}
        </span>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
          {sponsoredItems.map((item) => (
            <div 
              key={`featured-${item.type}-${item.id}`} 
              className="flex-shrink-0 w-52 sm:w-64"
              data-testid="featured-item"
            >
              {renderCard(item)}
            </div>
          ))}
        </div>
        
        {/* Gradient fade on right edge to indicate scrollability */}
        {sponsoredItems.length > 4 && (
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-purple-50 to-transparent pointer-events-none" />
        )}
      </div>
    </section>
  );
};

/**
 * Renders the appropriate card component based on item type
 */
function renderCard(item: UnifiedItem) {
  switch (item.type) {
    case 'event':
      return (
        <EventCard
          event={getEventCardData(item)}
          viewMode="grid"
        />
      );
    case 'news':
      return (
        <NewsCard
          news={getNewsCardData(item)}
        />
      );
    case 'business':
      return (
        <BusinessCard
          business={getBusinessCardData(item)}
        />
      );
    case 'local-service':
      return (
        <LocalServiceCard
          localService={getLocalServiceCardData(item)}
        />
      );
    default:
      return null;
  }
}

export default FeaturedSection;
