import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useMapLoader } from '@/hooks/useMapLoader';

interface MapItem {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  type: 'event' | 'news' | 'business' | 'local-service';
  address?: string;
  location?: string;
  category?: string;
}

interface UniversalMapProps {
  height?: string;
  showFilters?: boolean;
}

export const UniversalMap = ({ height = "400px", showFilters = false }: UniversalMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['event', 'news', 'business', 'local-service']);
  const navigate = useNavigate();
  const { apiKey: mapboxToken, isLoadingApiKey, error } = useMapLoader();

  // Fetch all data from Supabase
  const fetchMapData = async () => {
    try {
      console.log('Fetching map data from all tables...');
      
      const [eventsRes, newsRes, businessRes, localServicesRes] = await Promise.all([
        supabase.from('events').select('id, title, description, latitude, longitude, location, category'),
        supabase.from('news').select('id, title, content, location'),
        supabase.from('business').select('id, title, description, address, neighborhood'),
        supabase.from('local_services_nonprofits').select('id, name, description, latitude, longitude, address, category')
      ]);

      const items: MapItem[] = [];

      // Process events
      if (eventsRes.data) {
        eventsRes.data.forEach(event => {
          if (event.latitude && event.longitude) {
            items.push({
              id: event.id,
              title: event.title,
              description: event.description || '',
              latitude: Number(event.latitude),
              longitude: Number(event.longitude),
              type: 'event',
              location: event.location,
              category: event.category
            });
          }
        });
      }

      // Process local services
      if (localServicesRes.data) {
        localServicesRes.data.forEach(service => {
          if (service.latitude && service.longitude) {
            items.push({
              id: service.id,
              title: service.name,
              description: service.description || '',
              latitude: Number(service.latitude),
              longitude: Number(service.longitude),
              type: 'local-service',
              address: service.address,
              category: service.category
            });
          }
        });
      }

      console.log('Fetched map items:', items);
      setMapItems(items);
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isLoadingApiKey) return;

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
      map.remove();
    };
  }, [mapboxToken, isLoadingApiKey]);

  // Fetch data
  useEffect(() => {
    fetchMapData();
  }, []);

  // Create marker color based on type
  const getMarkerColor = (type: string): string => {
    const colors = {
      event: '#dc2626',
      news: '#2563eb',
      business: '#16a34a',
      'local-service': '#ca8a04'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  // Create popup content
  const createPopupContent = (item: MapItem): string => {
    const typeLabel = {
      event: 'Event',
      news: 'News',
      business: 'Business',
      'local-service': 'Local Service'
    }[item.type];

    return `
      <div style="padding: 10px; max-width: 200px;">
        <div style="background: ${getMarkerColor(item.type)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px;">
          ${typeLabel}
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #374151;">${item.title}</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7280;">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</p>
        ${item.location ? `<p style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>📍 ${item.location}</strong></p>` : ''}
        ${item.address ? `<p style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>📍 ${item.address}</strong></p>` : ''}
        ${item.category ? `<p style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>🏷️ ${item.category}</strong></p>` : ''}
        <div style="margin: 8px 0 0 0;">
          <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-service' : item.type}/${item.id}'" style="
            background: linear-gradient(to right, #8b5cf6, #3b82f6);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 500;
          ">View Details</button>
        </div>
      </div>
    `;
  };

  // Add markers to map
  useEffect(() => {
    if (!mapInstanceRef.current || mapItems.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter items based on selected types
    const filteredItems = mapItems.filter(item => selectedTypes.includes(item.type));

    // Add new markers
    filteredItems.forEach((item) => {
      const marker = new mapboxgl.Marker({
        color: getMarkerColor(item.type)
      })
        .setLngLat([item.longitude, item.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(createPopupContent(item))
        )
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (filteredItems.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredItems.forEach(item => {
        bounds.extend([item.longitude, item.latitude]);
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [mapItems, selectedTypes]);

  // Handle type filter changes
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
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
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {[
            { type: 'event', label: 'Events', color: 'bg-red-100 text-red-700' },
            { type: 'news', label: 'News', color: 'bg-blue-100 text-blue-700' },
            { type: 'business', label: 'Businesses', color: 'bg-green-100 text-green-700' },
            { type: 'local-service', label: 'Local Services', color: 'bg-yellow-100 text-yellow-700' }
          ].map(({ type, label, color }) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedTypes.includes(type) 
                  ? color
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {label} ({mapItems.filter(item => item.type === type).length})
            </button>
          ))}
        </div>
      )}
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden relative" style={{ height }}>
        <div ref={mapRef} className="w-full h-full" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
