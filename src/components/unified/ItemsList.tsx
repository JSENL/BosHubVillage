
import { Search } from 'lucide-react';
import { UnifiedItemCard } from '@/components/UnifiedItemCard';
import { UnifiedItem } from '@/types/unifiedItem';

interface ItemsListProps {
  allItems: UnifiedItem[];
  selectedItem: UnifiedItem | null;
  highlightedItemId: string | null;
  onRefresh: () => void;
}

export const ItemsList = ({ allItems, selectedItem, highlightedItemId, onRefresh }: ItemsListProps) => {
  if (allItems.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
        <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No items found</h3>
        <p className="text-gray-600 text-sm sm:text-base mb-4">Try adjusting your search criteria or browse all items.</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Items ({allItems.length})</h2>
        {selectedItem && (
          <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            Selected: {selectedItem.title}
          </div>
        )}
      </div>
      <div className="grid gap-6">
        {allItems.map((item) => (
          <UnifiedItemCard
            key={item.id}
            item={item}
            viewMode="list"
            isHighlighted={highlightedItemId === item.id}
          />
        ))}
      </div>
    </div>
  );
};
