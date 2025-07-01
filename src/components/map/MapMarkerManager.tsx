
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  items: UnifiedItem[];
  onMarkerClick?: (item: UnifiedItem) => void;
  onMarkerDoubleClick?: (item: UnifiedItem) => void;
}

export const useMapMarkers = ({
  map,
  items,
  onMarkerClick,
  onMarkerDoubleClick
}: UseMapMarkersProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map || !items.length) {
      console.log('🗺️ MapMarkers: No map or items', { hasMap: !!map, itemsCount: items.length });
      return;
    }

    console.log('🎯 Creating markers for items:', items.length);

    // Clear existing markers
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.warn('Error removing marker:', error);
      }
    });
    markersRef.current = [];

    // Create new markers safely
    const newMarkers: mapboxgl.Marker[] = [];
    
    items.forEach((item, index) => {
      try {
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);

        // Validate coordinates
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates for item ${item.id}:`, { lat, lng });
          return;
        }

        // Determine marker color based on type
        const getMarkerColor = (type: string): string => {
          switch (type) {
            case 'event': return '#ef4444'; // red
            case 'news': return '#3b82f6'; // blue
            case 'business': return '#22c55e'; // green
            case 'local-service': return '#eab308'; // yellow
            default: return '#6b7280'; // gray
          }
        };

        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker-custom';
        markerElement.style.cssText = `
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${getMarkerColor(item.type)};
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        `;

        // Add hover effect
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.2)';
        });
        
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
        });

        // Create popup content
        const popupContent = `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-sm mb-1">${item.title}</h3>
            <p class="text-xs text-gray-600 mb-2">${item.description || 'No description available'}</p>
            <div class="space-y-1 text-xs">
              ${item.address ? `<p><strong>Address:</strong> ${item.address}</p>` : ''}
              ${item.location ? `<p><strong>Location:</strong> ${item.location}</p>` : ''}
              ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ''}
              <p><strong>Type:</strong> ${item.type.replace('-', ' ')}</p>
            </div>
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(popupContent);

        // Create marker
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        // Add click handlers using simple data passing (not cloning objects)
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('📍 Marker clicked:', item.title);
          
          // Create a simple data object to avoid cloning issues
          const safeItem = {
            id: item.id,
            title: item.title,
            type: item.type,
            latitude: item.latitude,
            longitude: item.longitude,
            description: item.description,
            address: item.address,
            location: item.location,
            category: item.category
          };
          
          if (onMarkerClick) {
            onMarkerClick(safeItem as UnifiedItem);
          }
        });

        markerElement.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          console.log('🖱️ Marker double-clicked:', item.title);
          
          // Create a simple data object to avoid cloning issues
          const safeItem = {
            id: item.id,
            title: item.title,
            type: item.type,
            latitude: item.latitude,
            longitude: item.longitude,
            description: item.description,
            address: item.address,
            location: item.location,
            category: item.category
          };
          
          if (onMarkerDoubleClick) {
            onMarkerDoubleClick(safeItem as UnifiedItem);
          }
        });

        newMarkers.push(marker);
        
        console.log(`✅ Created marker ${index + 1}/${items.length}:`, {
          title: item.title,
          type: item.type,
          coordinates: [lng, lat]
        });

      } catch (error) {
        console.error(`❌ Error creating marker for item ${item.id}:`, error);
      }
    });

    markersRef.current = newMarkers;
    
    console.log(`🎯 Successfully created ${newMarkers.length} markers`);

    // Fit map to show all markers if we have any
    if (newMarkers.length > 0) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        items.forEach(item => {
          const lat = Number(item.latitude);
          const lng = Number(item.longitude);
          if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            bounds.extend([lng, lat]);
          }
        });
        
        map.fitBounds(bounds, { 
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15
        });
      } catch (error) {
        console.warn('Error fitting bounds:', error);
      }
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.warn('Error cleaning up marker:', error);
        }
      });
      markersRef.current = [];
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);

  return markersRef.current;
};
