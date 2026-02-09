
import { useState, useEffect, useRef, useCallback } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapboxToken } from '@/contexts/MapboxContext';
import { useMapClusters } from '@/hooks/useMapClusters';
import { MapOverlays } from '@/components/map/MapOverlays';
import { MapDebugOverlay } from '@/components/map/MapDebugOverlay';
import { MapStateDebugger } from '@/components/MapStateDebugger';
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
  viewMode?: 'map' | 'list'; // Add viewMode for debugging
}

export const EnhancedUniversalMap = ({ 
  items, 
  height = "100%", 
  selectedTypes,
  onItemClick,
  viewMode = 'map'
}: EnhancedUniversalMapProps) => {
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [directionsItem, setDirectionsItem] = useState<UnifiedItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerScale, setContainerScale] = useState(1);
  const containerRef = useState<HTMLDivElement | null>(null)[0];
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
    mapInstance: mapInstance ? 'Created' : 'Not Created',
    mapLoaded: mapInstance ? mapInstance.loaded() : false,
    mapStyleLoaded: mapInstance ? mapInstance.isStyleLoaded() : false,
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

  // Exit fullscreen on Escape key
  useEffect(() => {
    if (!isFullscreen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setTimeout(() => mapInstance?.resize(), 100);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen, mapInstance]);

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

  // Use the map markers hook with click handler - Wait for map to be ready
  useEffect(() => {
    if (mapInstance && mapInstance.loaded()) {
      console.log('🗺️ Map is ready, adding markers...');
    } else if (mapInstance) {
      const handleLoad = () => {
        console.log('🗺️ Map load event fired, will add markers...');
      };
      mapInstance.on('load', handleLoad);
      return () => {
        mapInstance.off('load', handleLoad);
      };
    }
  }, [mapInstance]);

  // Use the map clusters hook with click handler - this must be called as a hook
  useMapClusters({
    map: mapInstance,
    items: filteredMappableItems,
    onMarkerClick: handleMarkerClick
  });

  // Monitor container size and calculate scale factor
  useEffect(() => {
    const mapContainer = mapRef.current?.parentElement;
    if (!mapContainer) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Base scale on 1200px as the reference width
        const scale = Math.max(0.5, Math.min(1, width / 1200));
        setContainerScale(scale);
        console.log('📏 Container width:', width, 'Scale:', scale);
      }
    });

    resizeObserver.observe(mapContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapRef]);

  // Force map resize when container dimensions change or component mounts
  useEffect(() => {
    if (mapInstance) {
      const resizeTimeout = setTimeout(() => {
        console.log('🔄 Resizing map to fit container...');
        mapInstance.resize();
        
        // Force a second resize after a short delay to ensure proper rendering
        setTimeout(() => {
          if (mapInstance && !mapInstance._removed) {
            mapInstance.resize();
            console.log('🔄 Secondary map resize completed');
          }
        }, 200);
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
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'}`}>      
      <div 
        className={`bg-card rounded-lg border shadow-sm relative overflow-hidden ${isFullscreen ? 'rounded-none border-0' : ''}`}
        style={{ 
          height: '100%',
          width: '100%'
        }}
      >
        {/* Debug overlay - hidden by default */}
        
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
            {/* Map State Debugger - hidden by default, can be enabled when needed */}
            <div 
              ref={mapRef} 
              className="absolute inset-0"
              style={{ 
                width: '100%',
                height: '100%'
              }}
            />
            <MapSearchBox onLocationFound={handleLocationSearch} scale={containerScale} />
            <MapLegend scale={containerScale} />
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-3 right-3 z-10 bg-card/90 backdrop-blur-sm shadow-md"
              onClick={() => {
                setIsFullscreen(prev => !prev);
                setTimeout(() => mapInstance?.resize(), 100);
              }}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <ClearDirectionsButton 
              onClear={clearDirections}
              isVisible={!!route}
              scale={containerScale}
            />
            <TurnByTurnDirections
              directions={directions || []}
              route={route}
              isVisible={!!(route && directions)}
              onClose={clearDirections}
              scale={containerScale}
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
