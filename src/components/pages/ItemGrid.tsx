import { EventCard } from "@/components/EventCard";
import BusinessCard from "@/components/BusinessCard";
import LocalServiceCard from "@/components/LocalServiceCard";
import { UnifiedItem } from "@/types/unifiedItem";
import { useAppState } from '@/contexts/AppStateContext';
import { getEventCardData, getBusinessCardData, getLocalServiceCardData } from '@/utils/cardTranslationData';

export const ItemGrid = () => {
  const { isLoading, filteredItems } = useAppState();

  const renderItem = (item: UnifiedItem) => {
    switch (item.type) {
      case 'event':
        return <EventCard key={item.id} event={getEventCardData(item)} viewMode="grid" />;
      case 'business':
        return <BusinessCard key={item.id} business={getBusinessCardData(item)} />;
      case 'local-service':
        return <LocalServiceCard key={item.id} localService={getLocalServiceCardData(item)} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6 md:py-8">
        <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm md:text-base text-gray-600">Loading content...</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-6 md:py-8 text-gray-500">
        <p className="text-sm md:text-base">No content found. Try adjusting your filters or be the first to add something!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4 mt-4 md:mt-6">
      {filteredItems.map(renderItem)}
    </div>
  );
};