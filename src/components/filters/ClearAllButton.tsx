
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ClearAllButtonProps {
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

export const ClearAllButton = ({ hasActiveFilters, onClearAll }: ClearAllButtonProps) => {
  if (!hasActiveFilters) return null;

  return (
    <Button
      onClick={onClearAll}
      variant="outline"
      size="sm"
      className="h-8 sm:h-10 text-xs sm:text-sm gap-1"
    >
      <X className="h-3 w-3 sm:h-4 sm:w-4" />
      Clear All
    </Button>
  );
};
