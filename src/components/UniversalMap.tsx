
import { useEffect, useRef, useState } from 'react';
import { useMapLoader } from '@/hooks/useMapLoader';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { fitMapToBounds, clearMarkers } from '@/utils/mapUtils';

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
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['event', 'news', 'business', 'local-service']);
  const navigate = useNavigate();
  const { apiKey, mapLoaded, isLoadingApiKey, loadMap } = useMapLoader();

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

      // Process news (we'll need to geocode these since they don't have coordinates)
      if (newsRes.data) {
        newsRes.data.forEach(news => {
          // For now, skip news without coordinates - we could geocode later
          console.log('News item found but no coordinates:', news.title);
        });
      }

      // Process businesses (we'll need to geocode these)
      if (businessRes.data) {
        businessRes.data.forEach(business => {
          // For now, skip businesses without coordinates - we could geocode later
          console.log('Business found but no coordinates:', business.title);
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

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!apiKey) return;
      
      const map = await loadMap(mapRef);
      if (map) {
        mapInstanceRef.current = map;
      }
    };

    initializeMap();
  }, [apiKey, loadMap]);

  // Fetch data
  useEffect(() => {
    fetchMapData();
  }, []);

  // Create marker icon based on type
  const createMarkerIcon = (type: string): google.maps.Icon => {
    const colors = {
      event: '#dc2626',
      news: '#2563eb',
      business: '#16a34a',
      'local-service': '#ca8a04'
    };

    const color = colors[type as keyof typeof colors] || '#6b7280';

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    };
  };

  // Create info window content
  const createInfoWindowContent = (item: MapItem): string => {
    const typeLabel = {
      event: 'Event',
      news: 'News',
      business: 'Business',
      'local-service': 'Local Service'
    }[item.type];

    return `
      <div style="padding: 10px; max-width: 200px;">
        <div style="background: ${item.type === 'event' ? '#dc2626' : item.type === 'news' ? '#2563eb' : item.type === 'business' ? '#16a34a' : '#ca8a04'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px;">
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
    if (!mapInstanceRef.current || !mapLoaded || !window.google || mapItems.length === 0) {
      return;
    }

    console.log('Adding markers to map...');

    // Clear existing markers
    markersRef.current = clearMarkers(markersRef.current);

    // Filter items based on selected types
    const filteredItems = mapItems.filter(item => selectedTypes.includes(item.type));

    // Add new markers
    filteredItems.forEach((item) => {
      const marker = new window.google.maps.Marker({
        position: { lat: item.latitude, lng: item.longitude },
        map: mapInstanceRef.current!,
        title: item.title,
        icon: createMarkerIcon(item.type)
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(item)
      });

      marker.addListener('click', () => {
        // Close all other info windows
        markersRef.current.forEach(m => {
          if ((m as any).infoWindow) {
            (m as any).infoWindow.close();
          }
        });

        infoWindow.open(mapInstanceRef.current!, marker);
        (marker as any).infoWindow = infoWindow;
        mapInstanceRef.current!.panTo({ lat: item.latitude, lng: item.longitude });
      });

      (marker as any).infoWindow = infoWindow;
      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (filteredItems.length > 0) {
      fitMapToBounds(mapInstanceRef.current, markersRef.current);
    }
  }, [mapItems, mapLoaded, selectedTypes]);

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
      <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <p className="text-gray-500">Google Maps not configured</p>
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
        {(loading || !mapLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">
                {loading ? 'Loading data...' : 'Loading map...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
