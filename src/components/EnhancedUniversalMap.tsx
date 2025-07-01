import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom';
import { useMapLoader } from '@/hooks/useMapLoader';
import { useMapMarkers } from '@/components/map/MapMarkerManager';
import { MapOverlays } from '@/components/map/MapOverlays';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const { apiKey: mapboxToken, isLoadingApiKey, error } = useMapLoader();

  // Enhanced filtering with detailed logging
  const filteredMappableItems = items.filter(item => {
    const hasCoords = item.latitude !== null && 
                     item.longitude !== null && 
                     !isNaN(Number(item.latitude)) &&
                     !isNaN(Number(item.longitude));
    
    const isSelectedType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);
    const isValidCoords = lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    
    console.log(`🔍 Item Analysis: ${item.title}`, {
      id: item.id,
      type: item.type,
      rawLat: item.latitude,
      rawLng: item.longitude,
      convertedLat: lat,
      convertedLng: lng,
      hasCoords,
      isValidCoords,
      isSelectedType,
      willShow: hasCoords && isValidCoords && isSelectedType
    });
    
    return hasCoords && isValidCoords && isSelectedType;
  });

  console.log('🗺️ EnhancedUniversalMap Analysis:', {
    totalItems: items.length,
    filteredItems: filteredMappableItems.length,
    selectedTypes,
    mapboxToken: mapboxToken ? 'Available' : 'Missing',
    isLoading: isLoadingApiKey,
    error: error || 'None'
  });

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isLoadingApiKey) {
      console.log('⏳ Map initialization skipped:', { 
        hasMapRef: !!mapRef.current, 
        hasToken: !!mapboxToken, 
        isLoading: isLoadingApiKey 
      });
      return;
    }

    console.log('🚀 Initializing Mapbox map...');
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-71.0589, 42.3601], // Boston center
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      console.log('✅ Mapbox map loaded successfully');
    });

    map.on('error', (e) => {
      console.error('❌ Mapbox map error:', e);
    });

    mapInstanceRef.current = map;

    return () => {
      console.log('🧹 Cleaning up Mapbox map...');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapboxToken, isLoadingApiKey]);

  // Handle marker click to highlight corresponding item
  const handleMarkerClick = (item: UnifiedItem) => {
    console.log('📍 Marker clicked:', item.title, 'ID:', item.id);
    
    if (onItemClick) {
      onItemClick(item);
    }

    // Enhanced element finding with multiple ID patterns
    setTimeout(() => {
      const possibleIds = [
        `item-${item.id}`,
        `event-${item.id}`,
        `news-${item.id}`,
        `business-${item.id}`,
        `service-${item.id}`,
        `local-service-${item.id}`
      ];
      
      let itemElement = null;
      for (const id of possibleIds) {
        itemElement = document.getElementById(id);
        if (itemElement) {
          console.log(`✅ Found element with ID: ${id}`);
          break;
        }
      }
      
      if (itemElement) {
        itemElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        itemElement.classList.add('ring-2', 'ring-purple-500', 'ring-opacity-75');
        setTimeout(() => {
          itemElement?.classList.remove('ring-2', 'ring-purple-500', 'ring-opacity-75');
        }, 3000);
      } else {
        console.warn('⚠️ Item element not found for any ID pattern:', possibleIds);
      }
    }, 100);
  };

  // Handle marker double-click to navigate to detail page
  const handleMarkerDoubleClick = (item: UnifiedItem) => {
    console.log('🖱️ Marker double-clicked:', item.title);
    const routePath = item.type === 'local-service' ? 'local-service' : item.type;
    navigate(`/${routePath}/${item.id}`);
  };

  // Use the map markers hook with enhanced logging
  useMapMarkers({
    map: mapInstanceRef.current,
    items: filteredMappableItems,
    onMarkerClick: handleMarkerClick,
    onMarkerDoubleClick: handleMarkerDoubleClick
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
        <MapOverlays 
          itemCount={filteredMappableItems.length}
          isEmpty={filteredMappableItems.length === 0 && !isLoadingApiKey}
        />
        
        {/* Enhanced debug info overlay */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-3 rounded max-w-xs">
          <div className="space-y-1">
            <div>📊 Total Items: {items.length}</div>
            <div>📍 Mappable: {filteredMappableItems.length}</div>
            <div>🗺️ Map: {mapInstanceRef.current ? '✅ Ready' : '⏳ Loading'}</div>
            <div>🔧 Types: {selectedTypes.length === 0 ? 'All' : selectedTypes.join(', ')}</div>
            {filteredMappableItems.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-500">
                <div className="text-green-300">Next marker coords:</div>
                <div>Lat: {filteredMappableItems[0].latitude}</div>
                <div>Lng: {filteredMappableItems[0].longitude}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
