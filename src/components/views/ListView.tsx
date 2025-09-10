import { UnifiedItem } from '@/types/unifiedItem';
import { UnifiedItemCard } from '@/components/UnifiedItemCard';
import { LoadingGrid } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/common/PaginationControls';

interface ListViewProps {
  items: UnifiedItem[];
  isLoading?: boolean;
}

export const ListView = ({ items, isLoading = false }: ListViewProps) => {
  const {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination({ items, itemsPerPage: 12 });

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {currentItems.map((item) => (
          <UnifiedItemCard 
            key={`${item.type}-${item.id}`} 
            item={item} 
            viewMode="grid"
          />
        ))}
      </div>
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        totalItems={totalItems}
      />
    </div>
  );
};