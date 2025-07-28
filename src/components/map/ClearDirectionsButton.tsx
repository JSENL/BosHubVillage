import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ClearDirectionsButtonProps {
  onClear: () => void;
  isVisible: boolean;
}

export const ClearDirectionsButton = ({ onClear, isVisible }: ClearDirectionsButtonProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-4 left-4 z-50">
      <Button
        onClick={onClear}
        variant="secondary"
        size="sm"
        className="bg-white/90 backdrop-blur-sm border shadow-md hover:bg-white text-xs gap-1"
      >
        <X className="h-3 w-3" />
        Clear Directions
      </Button>
    </div>
  );
};