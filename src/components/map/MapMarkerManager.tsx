
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  items: UnifiedItem[];
  onMarkerClick?: (item: UnifiedItem) => void;
}

export const useMapMarkers = ({
  map,
  items,
  onMarkerClick
}: UseMapMarkersProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map) {
      console.log('🗺️ MapMarkers: No map available');
      return;
    }

    if (!items || items.length === 0) {
      console.log('🗺️ MapMarkers: No items to display');
      // Clear any existing markers when no items
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.warn('Error removing marker:', error);
        }
      });
      markersRef.current = [];
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

    // Create new markers
    const newMarkers: mapboxgl.Marker[] = [];
    let validMarkersCount = 0;
    let invalidCoordinatesCount = 0;
    
    items.forEach((item) => {
      try {
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);

        // Validate coordinates
        if (!item.latitude || !item.longitude || isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
          console.warn(`Invalid coordinates for item ${item.id} "${item.title}":`, {
            rawLat: item.latitude,
            rawLng: item.longitude,
            convertedLat: lat,
            convertedLng: lng
          });
          invalidCoordinatesCount++;
          return;
        }

        // Additional validation for reasonable coordinate ranges
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(`Coordinates out of range for item ${item.id} "${item.title}":`, { lat, lng });
          invalidCoordinatesCount++;
          return;
        }

        // Determine marker color based on type
        const getMarkerColor = (type: string): string => {
          switch (type) {
            case 'event': return '#ef4444'; // red
            case 'news': return '#3b82f6'; // blue
            case 'business': return '#2563eb'; // blue for business
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

        // Create popup content with business-specific information
        const createPopupContent = (item: UnifiedItem): string => {
          if (item.type === 'business') {
            return `
              <div style="max-width: 300px; font-family: system-ui; padding: 12px;">
                <h3 style="margin: 0 0 8px 0; color: #2563eb; font-size: 18px; font-weight: 600; line-height: 1.2;">${item.title}</h3>
                <div style="background: #2563eb; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; text-transform: uppercase; display: inline-block; margin-bottom: 12px;">
                  Business
                </div>
                ${item.category ? `<p style="margin: 4px 0 8px 0; font-size: 13px; color: #666; font-weight: 500; background: #f3f4f6; padding: 4px 8px; border-radius: 6px; display: inline-block;">${item.category}</p>` : ''}
                <p style="margin: 8px 0; font-size: 14px; color: #333; line-height: 1.4;">${item.description || 'No description available'}</p>
                ${item.address ? `<p style="margin: 8px 0 4px 0; font-size: 13px; color: #666;"><strong>📍</strong> ${item.address}</p>` : ''}
                ${item.neighborhoods ? `<p style="margin: 4px 0; font-size: 12px; color: #888;">Neighborhood: ${item.neighborhoods}</p>` : ''}
              </div>
            `;
          }
          
          // Default popup for other types
          return `
            <div style="max-width: 300px; font-family: system-ui; padding: 8px;">
              <h3 style="margin: 0 0 8px 0; color: ${getMarkerColor(item.type)}; font-size: 16px; font-weight: 600; line-height: 1.2;">${item.title}</h3>
              <div style="background: ${getMarkerColor(item.type)}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; text-transform: uppercase; display: inline-block; margin-bottom: 8px;">
                ${item.type.replace('-', ' ')}
              </div>
              ${item.category ? `<p style="margin: 4px 0; font-size: 12px; color: #666; font-weight: 500;">${item.category}</p>` : ''}
              <p style="margin: 8px 0; font-size: 14px; color: #333; line-height: 1.4;">${item.description || 'No description available'}</p>
              ${item.address ? `<p style="margin: 4px 0; font-size: 13px; color: #666;"><strong>📍</strong> ${item.address}</p>` : ''}
              ${item.neighborhoods ? `<p style="margin: 4px 0; font-size: 12px; color: #888;">Neighborhood: ${item.neighborhoods}</p>` : ''}
            </div>
          `;
        };

        // Create popup instance
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '320px'
        })
          .setHTML(createPopupContent(item));

        // Add popup to marker
        marker.setPopup(popup);

        // Add click handler for additional functionality
        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('📍 Marker clicked:', item.title);
          
          if (onMarkerClick) {
            onMarkerClick(item);
          }
        });

        newMarkers.push(marker);
        validMarkersCount++;
        console.log(`✅ Created marker ${validMarkersCount}: "${item.title}" (${item.type})`);

      } catch (error) {
        console.error(`❌ Error creating marker for ${item.type} "${item.title}":`, error);
        invalidCoordinatesCount++;
      }
    });

    markersRef.current = newMarkers;
    
    console.log(`🎯 Marker creation summary:`, {
      totalItems: items.length,
      validMarkers: validMarkersCount,
      invalidCoordinates: invalidCoordinatesCount,
      successRate: `${((validMarkersCount / items.length) * 100).toFixed(1)}%`
    });

    // Fit map bounds if we have valid markers
    if (newMarkers.length > 0) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        let boundsCount = 0;
        
        items.forEach(item => {
          const lat = Number(item.latitude);
          const lng = Number(item.longitude);
          if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            bounds.extend([lng, lat]);
            boundsCount++;
          }
        });
        
        if (boundsCount > 0) {
          map.fitBounds(bounds, { 
            padding: { top: 60, bottom: 60, left: 60, right: 60 },
            maxZoom: 14
          });
          console.log(`🗺️ Map bounds fitted to ${boundsCount} valid coordinates`);
        }
      } catch (error) {
        console.warn('Error fitting map bounds:', error);
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
  }, [map, items, onMarkerClick]);

  return markersRef.current;
};
