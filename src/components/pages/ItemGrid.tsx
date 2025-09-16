import { EventCard } from "@/components/EventCard";
import BusinessCard from "@/components/BusinessCard";
import LocalServiceCard from "@/components/LocalServiceCard";
import { UnifiedItem } from "@/types/unifiedItem";
import { useDataContext } from './DataProvider';
import { useFilterContext } from './FilterProvider';

export const ItemGrid = () => {
  const { isLoading } = useDataContext();
  const { filteredItems } = useFilterContext();

  const renderItem = (item: UnifiedItem) => {
    switch (item.type) {
      case 'event':
        return <EventCard key={item.id} event={item.originalData} viewMode="grid" />;
      case 'business':
        return <BusinessCard key={item.id} business={item.originalData} />;
      case 'local-service':
        return <LocalServiceCard key={item.id} localService={item.originalData} />;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-4 mt-4 md:mt-6">
      {filteredItems.map(renderItem)}
    </div>
  );
};