import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedItem } from '@/types/unifiedItem';

interface MobileMapPreviewProps {
  items: UnifiedItem[];
  onShowMap: () => void;
}

export const MobileMapPreview = ({ items, onShowMap }: MobileMapPreviewProps) => {
  // Count items with valid coordinates
  const itemsWithLocation = items.filter(
    item => item.latitude && item.longitude
  ).length;

  return (
    <Button
      variant="outline"
      onClick={onShowMap}
      className="w-full flex items-center justify-between gap-3 p-4 h-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 group lg:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          {/* Ping animation */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </div>
        <div className="text-left">
          <p className="font-medium text-sm">Explore on Map</p>
          <p className="text-xs text-muted-foreground">
            {itemsWithLocation} locations nearby
          </p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform duration-200">
        Tap to view →
      </div>
    </Button>
  );
};
