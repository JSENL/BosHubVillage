import { useState } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { EnhancedUniversalMap } from '@/components/map/EnhancedUniversalMap';
import { MapItemSidebar } from '@/components/MapItemSidebar';

interface MapViewProps {
  items: UnifiedItem[];
  selectedTypes: string[];
  height?: string;
}

export const MapView = ({ items, selectedTypes, height = "540px" }: MapViewProps) => {
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);

  const handleMarkerClick = (item: UnifiedItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="relative w-full" style={{ height }}>
      <EnhancedUniversalMap
        key={`enhanced-map-${selectedTypes.join('-')}-${items.length}`}
        items={items}
        height={height}
        selectedTypes={selectedTypes}
        onItemClick={handleMarkerClick}
      />
      <MapItemSidebar 
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onGetDirections={() => {}} // This should be handled by the map component
      />
    </div>
  );
};