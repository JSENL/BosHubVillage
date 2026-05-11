import { UnifiedItem } from '@/types/unifiedItem';
import { UnifiedItemCard } from '@/components/UnifiedItemCard';
import { LoadingListRows } from '@/components/common/LoadingState';
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
    return <LoadingListRows count={8} />;
  }

  if (items.length === 0) {
    return <IllustratedEmptyState variant={emptyStateVariant} />;
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div
        className="flex w-full max-w-none flex-col gap-2 sm:gap-3"
        data-list-presentation="rows"
      >
        {currentItems.map((item) => (
          <UnifiedItemCard
            key={`${item.type}-${item.id}`}
            item={item}
            viewMode="list"
            listCompact={false}
            listSplitMeta
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