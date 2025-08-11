
import { useState, useEffect } from 'react';
import { useMapboxToken } from '@/contexts/MapboxContext';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { MapOverlays } from '@/components/map/MapOverlays';
import { MapDebugOverlay } from '@/components/map/MapDebugOverlay';
import { useItemFiltering } from '@/components/map/MapItemFiltering';
import { useMapInitializer } from '@/components/map/MapInitializer';
import { MapItemSidebar } from '@/components/MapItemSidebar';
import { DirectionsModal } from '@/components/map/DirectionsModal';
import { ClearDirectionsButton } from '@/components/map/ClearDirectionsButton';
import { TurnByTurnDirections } from '@/components/map/TurnByTurnDirections';
import { MapLegend } from '@/components/map/MapLegend';
import { MapSearchBox } from '@/components/map/MapSearchBox';
import { useDirections } from '@/hooks/useDirections';
import { UnifiedItem } from '@/types/unifiedItem';

interface EnhancedUniversalMapProps {
  items: UnifiedItem[];
  height?: string;
  selectedTypes: string[];
  onItemClick?: (item: UnifiedItem) => void;
}

export const EnhancedUniversalMap = ({ 
  items, 
  height = "540px", 
  selectedTypes,
  onItemClick
}: EnhancedUniversalMapProps) => {
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [directionsItem, setDirectionsItem] = useState<UnifiedItem | null>(null);
  const { mapboxToken, isLoadingApiKey, error } = useMapboxToken();
  const { filteredMappableItems } = useItemFiltering({ 
    items: items, // Use the pre-filtered items directly 
    selectedTypes: selectedTypes 
  });
  const { mapRef, mapInstance } = useMapInitializer({ mapboxToken, isLoadingApiKey });
  const { getDirections, clearDirections, route, directions } = useDirections(mapInstance);

  console.log('🗺️ EnhancedUniversalMap Analysis:', {
    totalItems: items.length,
    filteredItems: filteredMappableItems.length,
    selectedTypes,
    mapboxToken: mapboxToken ? 'Available' : 'Missing',
    isLoading: isLoadingApiKey,
    error: error || 'None',
    itemsByType: items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    filteredItemsByType: filteredMappableItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });

  // Handle marker click to show in sidebar
  const handleMarkerClick = (item: UnifiedItem) => {
    console.log('📍 Marker clicked:', item.title);
    console.log('📍 Marker clicked:', item.title, 'ID:', item.id);
    setSelectedItem(item);
    if (onItemClick) {
      onItemClick(item);
    }
  };

  // Handle directions request
  const handleGetDirections = (startLocation: string, transportMode: string, item: UnifiedItem) => {
    getDirections(startLocation, item, transportMode);
  };

  // Listen for popup directions button clicks
  useEffect(() => {
    const handleDirectionsEvent = (event: CustomEvent) => {
      const { item } = event.detail;
      setDirectionsItem(item);
    };

    window.addEventListener('openDirections', handleDirectionsEvent as EventListener);
    
    return () => {
      window.removeEventListener('openDirections', handleDirectionsEvent as EventListener);
    };
  }, []);

  // Use the map markers hook with click handler
  useMapMarkers({
    map: mapInstance,
    items: filteredMappableItems,
    onMarkerClick: handleMarkerClick
  });

  // Force map resize when container dimensions change
  useEffect(() => {
    if (mapInstance) {
      const resizeTimeout = setTimeout(() => {
        console.log('🔄 Resizing map to fit container...');
        mapInstance.resize();
      }, 100);
      
      return () => clearTimeout(resizeTimeout);
    }
  }, [mapInstance, height]);

  const handleLocationSearch = (lat: number, lng: number, address: string) => {
    if (mapInstance) {
      mapInstance.flyTo({
        center: [lng, lat],
        zoom: 16,
        speed: 1.2,
        curve: 1.4
      });
    }
  };

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
    <div className="w-full h-full">      
      <div 
        className="bg-white rounded-lg border shadow-sm relative overflow-hidden"
        style={{ 
          height: '100%',
          width: '100%'
        }}
      >
        {/* Debug overlay */}
        <div className="absolute top-2 left-2 bg-black/75 text-white text-xs p-2 rounded z-50">
          <div>Items: {filteredMappableItems.length}</div>
          <div>Token: {mapboxToken ? '✅' : '❌'}</div>
          <div>Loading: {isLoadingApiKey ? '⏳' : '✅'}</div>
          <div>Error: {error || 'None'}</div>
          <div>MapRef: {mapRef.current ? '✅' : '❌'}</div>
          <div>MapInstance: {mapInstance ? '✅' : '❌'}</div>
          <div>Height: {height}</div>
        </div>
        
        {isLoadingApiKey ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 border border-red-200">
            <div className="text-center p-4">
              <p className="text-red-600 font-medium">Map Error</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <div 
              ref={mapRef} 
              className="absolute inset-0"
              style={{ 
                width: '100%',
                height: '100%'
              }}
            />
            <MapSearchBox onLocationFound={handleLocationSearch} />
            <MapLegend />
            <ClearDirectionsButton 
              onClear={clearDirections}
              isVisible={!!route}
            />
            <TurnByTurnDirections
              directions={directions || []}
              route={route}
              isVisible={!!(route && directions)}
              onClose={clearDirections}
            />
            <MapOverlays 
              itemCount={filteredMappableItems.length}
              isEmpty={filteredMappableItems.length === 0 && !isLoadingApiKey}
            />
            <MapItemSidebar 
              selectedItem={selectedItem}
              onClose={() => setSelectedItem(null)}
              onGetDirections={handleGetDirections}
            />
            {directionsItem && (
              <DirectionsModal 
                item={directionsItem}
                open={!!directionsItem}
                onOpenChange={(open) => !open && setDirectionsItem(null)}
                onGetDirections={(start, mode) => {
                  handleGetDirections(start, mode, directionsItem);
                  setDirectionsItem(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
