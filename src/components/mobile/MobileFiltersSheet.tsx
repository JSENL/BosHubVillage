import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { HomeFiltersPanel } from '@/components/filters/HomeFiltersPanel';
import { UnifiedItem } from '@/types/unifiedItem';

interface MobileFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allItems: UnifiedItem[];
  filteredItemsCount: number;
}

export const MobileFiltersSheet = ({
  open,
  onOpenChange,
  allItems,
  filteredItemsCount,
}: MobileFiltersSheetProps) => {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[min(92vh,720px)] flex-col gap-0 rounded-t-2xl p-0 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <SheetHeader className="shrink-0 border-b px-4 py-4 text-left pr-12">
          <SheetTitle>{t('filters.filters', 'Filters')}</SheetTitle>
          <SheetDescription>
            {t('mobile.filterSheetHelp', 'Narrow events, businesses, culture, and services on the map and list.')}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <HomeFiltersPanel
            allItems={allItems}
            filteredItemsCount={filteredItemsCount}
            layout="stacked"
          />
        </div>

        <div className="shrink-0 border-t px-4 py-3">
          <Button className="w-full min-h-[44px]" onClick={() => onOpenChange(false)}>
            {t('mobile.showResults', 'Show results')} ({filteredItemsCount})
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
