
import { MapboxMap } from '@/components/map/MapboxMap';
import { UnifiedItem } from '@/types/unifiedItem';

interface EnhancedUniversalMapProps {
  items: UnifiedItem[];
  height?: string;
  selectedTypes: string[];
  onItemClick?: (item: UnifiedItem) => void;
}

export const EnhancedUniversalMap = ({ 
  items, 
  height = "400px", 
  selectedTypes,
  onItemClick
}: EnhancedUniversalMapProps) => {
  return (
    <MapboxMap
      items={items}
      height={height}
      selectedTypes={selectedTypes}
      onItemClick={onItemClick}
    />
  );
};
