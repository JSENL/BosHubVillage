
import { useEffect, useState } from 'react';
import { useMapLoader } from '@/hooks/useMapLoader';
import { supabase } from '@/integrations/supabase/client';

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

export const UniversalMap = () => {
  const { isLoaded, loadError } = useMapLoader();
  const [map, setMap] = useState<google.maps.Map | null>(null);
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
    if (isLoaded && !map) {
      const mapInstance = new google.maps.Map(
        document.getElementById('universal-map') as HTMLElement,
        {
          center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
          zoom: 12,
        }
      );
      setMap(mapInstance);
    }
  }, [isLoaded, map]);

  useEffect(() => {
    if (map && mapItems.length > 0) {
      // Clear existing markers
      // Add new markers
      mapItems.forEach(item => {
        const marker = new google.maps.Marker({
          position: { lat: item.latitude, lng: item.longitude },
          map: map,
          title: item.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3>${item.name}</h3>
              ${item.description ? `<p>${item.description}</p>` : ''}
              ${item.address ? `<p><strong>Address:</strong> ${item.address}</p>` : ''}
              ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ''}
              <p><strong>Type:</strong> ${item.type.replace('_', ' ')}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      // Fit map to show all markers
      if (mapItems.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        mapItems.forEach(item => {
          bounds.extend({ lat: item.latitude, lng: item.longitude });
        });
        map.fitBounds(bounds);
      }
    }
  }, [map, mapItems]);

  if (loadError) {
    return <div>Error loading map</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div
      id="universal-map"
      style={{ height: '400px', width: '100%' }}
    />
  );
};
