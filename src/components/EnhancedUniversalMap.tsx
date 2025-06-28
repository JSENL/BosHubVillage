
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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

  // Filter items to only show mappable ones (with coordinates) and selected types
  const filteredMappableItems = items.filter(item => 
    item.latitude !== null && 
    item.longitude !== null && 
    !isNaN(Number(item.latitude)) &&
    !isNaN(Number(item.longitude)) &&
    selectedTypes.includes(item.type)
  );

  console.log('EnhancedUniversalMap: Filtered mappable items count:', filteredMappableItems.length);
  console.log('EnhancedUniversalMap: Selected types:', selectedTypes);
  console.log('EnhancedUniversalMap: Total items received:', items.length);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isLoadingApiKey) return;

    console.log('Initializing Mapbox map...');
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-71.0589, 42.3601], // Boston center
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapInstanceRef.current = map;

    return () => {
      console.log('Cleaning up Mapbox map...');
      map.remove();
    };
  }, [mapboxToken, isLoadingApiKey]);

  // Handle marker click to highlight corresponding item
  const handleMarkerClick = (item: UnifiedItem) => {
    console.log('Marker clicked for item:', item.title, 'ID:', item.id);
    
    // Call the onItemClick callback if provided
    if (onItemClick) {
      onItemClick(item);
    }

    // Scroll to the corresponding item in the list
    setTimeout(() => {
      const itemElement = document.getElementById(`item-${item.id}`) || 
                         document.getElementById(`event-${item.id}`) ||
                         document.getElementById(`news-${item.id}`) ||
                         document.getElementById(`business-${item.id}`) ||
                         document.getElementById(`service-${item.id}`);
      
      if (itemElement) {
        console.log('Scrolling to item element:', item.id);
        itemElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add highlight effect
        itemElement.classList.add('ring-2', 'ring-purple-500', 'ring-opacity-75');
        setTimeout(() => {
          itemElement.classList.remove('ring-2', 'ring-purple-500', 'ring-opacity-75');
        }, 3000);
      } else {
        console.warn('Item element not found for ID:', item.id);
      }
    }, 100);
  };

  // Handle marker double-click to navigate to detail page
  const handleMarkerDoubleClick = (item: UnifiedItem) => {
    console.log('Marker double-clicked for item:', item.title);
    const routePath = item.type === 'local-service' ? 'local-service' : item.type;
    navigate(`/${routePath}/${item.id}`);
  };

  // Use the map markers hook
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
      </div>
    </div>
  );
};
