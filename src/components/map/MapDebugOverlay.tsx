
import { UnifiedItem } from '@/types/unifiedItem';

interface MapDebugOverlayProps {
  totalItems: number;
  filteredItems: UnifiedItem[];
  selectedTypes: string[];
  isMapReady: boolean;
}

export const MapDebugOverlay = ({ 
  totalItems, 
  filteredItems, 
  selectedTypes, 
  isMapReady 
}: MapDebugOverlayProps) => {
  const itemsByType = filteredItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-3 rounded max-w-xs">
      <div className="space-y-1">
        <div>📊 Total Items: {totalItems}</div>
        <div>📍 Mappable: {filteredItems.length}</div>
        <div>🗺️ Map: {isMapReady ? '✅ Ready' : '⏳ Loading'}</div>
        <div>🔧 Types: {selectedTypes.length === 0 ? 'All' : selectedTypes.join(', ')}</div>
        
        <div className="mt-2 pt-2 border-t border-gray-500 text-xs">
          <div>By Type:</div>
          {Object.entries(itemsByType).map(([type, count]) => (
            <div key={type}>• {type}: {count}</div>
          ))}
        </div>
        
        {filteredItems.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-500">
            <div className="text-green-300">Next marker coords:</div>
            <div>Lat: {filteredItems[0].latitude}</div>
            <div>Lng: {filteredItems[0].longitude}</div>
          </div>
        )}
        
        <div className="mt-2 pt-2 border-t border-gray-500 text-yellow-300">
          💡 Double-click markers to view details
        </div>
      </div>
    </div>
  );
};
