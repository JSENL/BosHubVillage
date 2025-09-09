import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedItem } from '@/types/unifiedItem';

interface SimpleMapboxProps {
  items: UnifiedItem[];
  height?: string;
}

export const SimpleMapbox = ({ items, height = "540px" }: SimpleMapboxProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log('🗝️ Fetching Mapbox token...');
        const { data, error } = await supabase.functions.invoke('get-mapbox-key');
        
        if (error) {
          console.error('❌ Token fetch error:', error);
          setError('Failed to fetch map configuration');
          setIsLoading(false);
          return;
        }

        if (data?.mapboxKey) {
          console.log('✅ Token received successfully');
          setMapboxToken(data.mapboxKey);
        } else {
          console.error('❌ No token in response');
          setError('No map token configured');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError('Network error');
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    console.log('🗺️ Initializing map...');
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-71.0589, 42.3601], // Boston
        zoom: 12
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('✅ Map loaded successfully');
        setIsLoading(false);
      });

      map.current.on('error', (e) => {
        console.error('❌ Map error:', e);
        setError('Map failed to load');
        setIsLoading(false);
      });

    } catch (err) {
      console.error('❌ Map initialization error:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Add markers when items change
  useEffect(() => {
    if (!map.current || !items.length) return;

    console.log(`📍 Adding ${items.length} markers...`);

    const markers: mapboxgl.Marker[] = [];
    const validItems = items.filter(item => 
      item.latitude && item.longitude && 
      !isNaN(Number(item.latitude)) && !isNaN(Number(item.longitude))
    );

    validItems.forEach(item => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.style.width = '20px';
      markerElement.style.height = '20px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.cursor = 'pointer';
      
      // Color by type
      const colorMap: Record<string, string> = {
        'event': '#ff6b6b',
        'business': '#4ecdc4', 
        'local-service': '#45b7d1',
        'news': '#96ceb4'
      };
      markerElement.style.backgroundColor = colorMap[item.type] || '#666';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${item.title}</h3>
          <p class="text-xs text-gray-600">${item.type}</p>
          ${item.address ? `<p class="text-xs">${item.address}</p>` : ''}
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      markers.push(marker);
    });

    // Fit bounds to markers
    if (validItems.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validItems.forEach(item => {
        bounds.extend([Number(item.longitude), Number(item.latitude)]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [items]);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50 rounded-lg" style={{ height }}>
        <div className="text-center p-6">
          <p className="text-red-600 font-medium">Map Error</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-blue-50 rounded-lg" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-blue-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm" style={{ height, width: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};