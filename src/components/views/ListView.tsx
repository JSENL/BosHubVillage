import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    return (
      <EmptyState 
        title={t('emptyStates.noItemsFound')}
        description={t('emptyStates.tryAdjustingSearch')}
      />
    );
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