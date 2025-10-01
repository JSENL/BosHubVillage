import { useState, useRef, useEffect } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { EnhancedUniversalMap } from '@/components/map/EnhancedUniversalMap';
import { MapItemSidebar } from '@/components/MapItemSidebar';

interface MapViewProps {
  items: UnifiedItem[];
  selectedTypes: string[];
  height?: string;
}

export const MapView = ({ items, selectedTypes, height = "100%" }: MapViewProps) => {
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMarkerClick = (item: UnifiedItem) => {
    setSelectedItem(item);
  };

  // Listen for panel resize and dispatch a custom event
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log('📐 Map container resized:', {
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
        
        // Dispatch custom event that the map can listen to
        window.dispatchEvent(new CustomEvent('mapContainerResized'));
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full" style={{ height }}>
      <EnhancedUniversalMap
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