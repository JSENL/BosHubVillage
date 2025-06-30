
import { useEffect, useState, useRef } from 'react';
import { useMapLoader } from '@/hooks/useMapLoader';
import { supabase } from '@/integrations/supabase/client';
import mapboxgl from 'mapbox-gl';

interface MapItem {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: 'business' | 'event' | 'news' | 'local_resource';
  address?: string;
  category?: string;
}

interface UniversalMapProps {
  height?: string;
  showFilters?: boolean;
}

export const UniversalMap = ({ height = "400px" }: UniversalMapProps) => {
  const { apiKey, mapLoaded, isLoadingApiKey, error } = useMapLoader();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapItems, setMapItems] = useState<MapItem[]>([]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        // Fetch local resources
        const { data: localResources, error: localResourcesError } = await supabase
          .from('local_resources')
          .select('*')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (localResourcesError) throw localResourcesError;

        // Fetch other data (businesses, events, news)
        const { data: businesses, error: businessError } = await supabase
          .from('business')
          .select('*')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (businessError) throw businessError;

        const allItems: MapItem[] = [];

        // Add local resources
        if (localResources) {
          localResources.forEach(resource => {
            if (resource.latitude && resource.longitude) {
              allItems.push({
                id: resource.id,
                name: resource.name,
                description: resource.description || undefined,
                latitude: resource.latitude,
                longitude: resource.longitude,
                type: 'local_resource',
                address: resource.address,
                category: resource.category
              });
            }
          });
        }

        // Add businesses
        if (businesses) {
          businesses.forEach(business => {
            if (business.latitude && business.longitude) {
              allItems.push({
                id: business.id,
                name: business.title,
                description: business.description,
                latitude: business.latitude,
                longitude: business.longitude,
                type: 'business',
                address: business.address,
                category: business.business_type
              });
            }
          });
        }

        setMapItems(allItems);
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchMapData();
  }, []);

  useEffect(() => {
    if (mapLoaded && apiKey && mapRef.current && !mapInstanceRef.current) {
      console.log('Initializing Mapbox map...');
      
      mapboxgl.accessToken = apiKey;
      
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-71.0589, 42.3601], // Boston center
        zoom: 12
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      mapInstanceRef.current = map;
    }
  }, [mapLoaded, apiKey]);

  useEffect(() => {
    if (mapInstanceRef.current && mapItems.length > 0) {
      console.log('Adding markers to map:', mapItems.length);
      
      // Add markers for each item
      mapItems.forEach(item => {
        const marker = new mapboxgl.Marker({
          color: item.type === 'business' ? '#22c55e' : 
                 item.type === 'local_resource' ? '#3b82f6' : '#ef4444'
        })
          .setLngLat([item.longitude, item.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div>
                  <h3>${item.name}</h3>
                  ${item.description ? `<p>${item.description}</p>` : ''}
                  ${item.address ? `<p><strong>Address:</strong> ${item.address}</p>` : ''}
                  ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ''}
                  <p><strong>Type:</strong> ${item.type.replace('_', ' ')}</p>
                </div>
              `)
          )
          .addTo(mapInstanceRef.current!);
      });

      // Fit map to show all markers
      if (mapItems.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        mapItems.forEach(item => {
          bounds.extend([item.longitude, item.latitude]);
        });
        mapInstanceRef.current!.fitBounds(bounds, { padding: 50 });
      }
    }
  }, [mapItems]);

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height, width: '100%' }}>
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoadingApiKey || !mapLoaded) {
    return (
      <div className="flex items-center justify-center" style={{ height, width: '100%' }}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
};
