import { UnifiedItem } from '@/types/unifiedItem';
import { UnifiedItemCard } from '@/components/UnifiedItemCard';
import { LoadingGrid } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';

interface ListViewProps {
  items: UnifiedItem[];
  isLoading?: boolean;
}

export const ListView = ({ items, isLoading = false }: ListViewProps) => {
  if (isLoading) {
    return <LoadingGrid count={6} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        title="No items found"
        description="Try adjusting your search criteria to find more content."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <UnifiedItemCard 
          key={`${item.type}-${item.id}`} 
          item={item} 
          viewMode="grid"
        />
      ))}
    </div>
  );
};