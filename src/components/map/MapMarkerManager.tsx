
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
    if (!map) {
      console.log('🗺️ MapMarkers: No map available');
      return;
    }

    if (!items || items.length === 0) {
      console.log('🗺️ MapMarkers: No items to display');
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

        // Validate coordinates more strictly
        if (!item.latitude || !item.longitude || isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
          console.warn(`Invalid coordinates for item ${item.id} "${item.title}":`, {
            rawLat: item.latitude,
            rawLng: item.longitude,
            convertedLat: lat,
            convertedLng: lng
          });
          return;
        }

        // Additional validation for reasonable coordinate ranges
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(`Coordinates out of range for item ${item.id} "${item.title}":`, { lat, lng });
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

        // Create marker using the standard Mapbox approach
        const marker = new mapboxgl.Marker({
          color: getMarkerColor(item.type)
        })
          .setLngLat([lng, lat])
          .addTo(map);

        // Create simple popup content
        const popupContent = `
          <div style="max-width: 300px; font-family: system-ui;">
            <h3 style="margin: 0 0 8px 0; color: ${getMarkerColor(item.type)}; font-size: 16px; font-weight: 600;">${item.title}</h3>
            <div style="background: ${getMarkerColor(item.type)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; text-transform: uppercase; display: inline-block; margin-bottom: 8px;">
              ${item.type.replace('-', ' ')}
            </div>
            <p style="margin: 8px 0; font-size: 14px; color: #666; line-height: 1.4;">${item.description || 'No description available'}</p>
            ${item.address ? `<p style="margin: 4px 0; font-size: 13px; color: #888;"><strong>📍</strong> ${item.address}</p>` : ''}
            ${item.location && item.location !== item.address ? `<p style="margin: 4px 0; font-size: 13px; color: #888;"><strong>📍</strong> ${item.location}</p>` : ''}
          </div>
        `;

        // Add click handler to show popup
        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('📍 Marker clicked:', item.title);
          
          // Create and show popup
          new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false
          })
            .setLngLat([lng, lat])
            .setHTML(popupContent)
            .addTo(map);
          
          if (onMarkerClick) {
            onMarkerClick(item);
          }
        });

        newMarkers.push(marker);
        
        console.log(`✅ Created marker ${index + 1}/${items.length}: "${item.title}" (${item.type}) at [${lng}, ${lat}]`);

      } catch (error) {
        console.error(`❌ Error creating marker for item ${item.id} "${item.title}":`, error);
      }
    });

    markersRef.current = newMarkers;
    
    console.log(`🎯 Successfully created ${newMarkers.length} out of ${items.length} markers`);

    // Fit map to show all markers if we have any
    if (newMarkers.length > 0) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        items.forEach(item => {
          const lat = Number(item.latitude);
          const lng = Number(item.longitude);
          if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
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
