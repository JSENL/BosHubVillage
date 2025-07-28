import { useMapLoader } from '@/hooks/useMapLoader';
import { useMapboxInstance } from '@/hooks/useMapboxInstance';
import { MapMarkers } from '@/components/map/MapMarkers';
import { MapOverlays } from '@/components/map/MapOverlays';
import { MapDebugOverlay } from '@/components/map/MapDebugOverlay';
import { useItemFiltering } from '@/components/map/MapItemFiltering';
import { useMapClickHandlers } from '@/components/map/MapClickHandlers';
import { UnifiedItem } from '@/types/unifiedItem';

interface MapboxMapProps {
  items: UnifiedItem[];
  height?: string;
  selectedTypes: string[];
  onItemClick?: (item: UnifiedItem) => void;
}

export const MapboxMap = ({ 
  items, 
  height = "400px", 
  selectedTypes,
  onItemClick
}: MapboxMapProps) => {
  const { apiKey: mapboxToken, isLoadingApiKey, error } = useMapLoader();
  const { filteredMappableItems } = useItemFiltering({ items, selectedTypes });
  const { handleMarkerClick, handleMarkerDoubleClick } = useMapClickHandlers({ onItemClick });
  const { mapRef, mapInstance } = useMapboxInstance({ mapboxToken, isLoadingApiKey });

  console.log('🗺️ MapboxMap Analysis:', {
    totalItems: items.length,
    filteredItems: filteredMappableItems.length,
    selectedTypes,
    mapboxToken: mapboxToken ? 'Available' : 'Missing',
    isLoading: isLoadingApiKey,
    error: error || 'None',
    itemsByType: items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });

  if (isLoadingApiKey) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center flex-col p-8" style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  if (error || !mapboxToken) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center flex-col p-8" style={{ height }}>
        <p className="text-red-500 mb-4">{error || 'Failed to load Mapbox API key'}</p>
        <p className="text-sm text-gray-400">Please check your Mapbox configuration</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden relative" style={{ height }}>
        <div ref={mapRef} className="w-full h-full" />
        <MapMarkers
          map={mapInstance}
          items={filteredMappableItems}
          onMarkerClick={handleMarkerClick}
          onMarkerDoubleClick={handleMarkerDoubleClick}
        />
        <MapOverlays 
          itemCount={filteredMappableItems.length}
          isEmpty={filteredMappableItems.length === 0 && !isLoadingApiKey}
        />
        <MapDebugOverlay
          totalItems={items.length}
          filteredItems={filteredMappableItems}
          selectedTypes={selectedTypes}
          isMapReady={!!mapInstance}
        />
      </div>
    </div>
  );
};