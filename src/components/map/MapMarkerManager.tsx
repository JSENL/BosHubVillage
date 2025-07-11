
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

        // Create popup content
        const popupContent = `
          <div style="padding: 16px; max-width: 320px; font-family: system-ui; line-height: 1.4;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${item.title}</h3>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">${item.description || 'No description available'}</p>
            <div style="font-size: 12px; color: #374151;">
              ${item.address ? `<p style="margin: 4px 0;"><strong>📍 Address:</strong> ${item.address}</p>` : ''}
              ${item.location && item.location !== item.address ? `<p style="margin: 4px 0;"><strong>📍 Location:</strong> ${item.location}</p>` : ''}
              ${item.category ? `<p style="margin: 4px 0;"><strong>🏷️ Category:</strong> ${item.category}</p>` : ''}
              <p style="margin: 4px 0;"><strong>🏷️ Type:</strong> <span style="color: ${getMarkerColor(item.type)}; font-weight: bold;">${item.type.replace('-', ' ')}</span></p>
              ${item.date ? `<p style="margin: 4px 0;"><strong>📅 Date:</strong> ${item.date}</p>` : ''}
              ${item.business_type ? `<p style="margin: 4px 0;"><strong>🏢 Business Type:</strong> ${item.business_type}</p>` : ''}
              ${item.neighborhoods ? `<p style="margin: 4px 0;"><strong>🏘️ Neighborhood:</strong> ${item.neighborhoods}</p>` : ''}
              ${item.villages ? `<p style="margin: 4px 0;"><strong>🏘️ Village:</strong> ${Array.isArray(item.villages) ? item.villages.join(', ') : item.villages}</p>` : ''}
            </div>
            <div style="margin-top: 16px;">
              <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-service' : item.type}/${item.id}'" style="
                background: linear-gradient(135deg, ${getMarkerColor(item.type)}cc 0%, ${getMarkerColor(item.type)} 100%);
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 12px;
                cursor: pointer;
                font-weight: 600;
                width: 100%;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                View Details →
              </button>
            </div>
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '340px'
        }).setHTML(popupContent);

        // Create marker using the standard Mapbox approach
        const marker = new mapboxgl.Marker({
          color: getMarkerColor(item.type)
        })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        // Add click handlers
        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('📍 Marker clicked:', item.title);
          
          if (onMarkerClick) {
            onMarkerClick(item);
          }
        });

        marker.getElement().addEventListener('dblclick', (e) => {
          e.stopPropagation();
          console.log('🖱️ Marker double-clicked:', item.title);
          
          if (onMarkerDoubleClick) {
            onMarkerDoubleClick(item);
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
