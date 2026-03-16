import { UnifiedItem } from '@/types/unifiedItem';
import { UnifiedItemCard } from '@/components/UnifiedItemCard';
import { LoadingGrid } from '@/components/common/LoadingState';
import { IllustratedEmptyState } from '@/components/common/IllustratedEmptyState';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/common/PaginationControls';

type EmptyVariant = 'search' | 'events' | 'business' | 'news' | 'local-service' | 'filter';

interface ListViewProps {
  items: UnifiedItem[];
  isLoading?: boolean;
  /** Variant for the empty state when no items match (default: filter) */
  emptyStateVariant?: EmptyVariant;
}

export const ListView = ({ items, isLoading = false, emptyStateVariant = 'filter' }: ListViewProps) => {
  const {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination({ items, itemsPerPage: 30 });

  if (isLoading) {
    return <LoadingGrid count={6} />;
  }

  if (items.length === 0) {
    return <IllustratedEmptyState variant={emptyStateVariant} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 sm:gap-4">
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