
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

        // Create detailed submission card popup content
        const popupContent = `
          <div style="padding: 0; max-width: 380px; font-family: system-ui; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
            <!-- Header with type badge -->
            <div style="background: linear-gradient(135deg, ${getMarkerColor(item.type)}15 0%, ${getMarkerColor(item.type)}25 100%); padding: 16px; border-bottom: 1px solid #f3f4f6;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="background: ${getMarkerColor(item.type)}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${item.type.replace('-', ' ')}
                </span>
                ${item.date ? `<span style="font-size: 12px; color: #6b7280; font-weight: 500;">📅 ${item.date}</span>` : ''}
              </div>
              <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #111827; line-height: 1.3;">${item.title}</h3>
            </div>
            
            <!-- Content -->
            <div style="padding: 16px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563; line-height: 1.5;">${item.description || 'No description available'}</p>
              
              <!-- Info grid -->
              <div style="display: grid; gap: 8px; margin-bottom: 16px;">
                ${item.address ? `
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${getMarkerColor(item.type)}; font-size: 14px;">📍</span>
                    <span style="font-size: 13px; color: #374151;"><strong>Address:</strong> ${item.address}</span>
                  </div>
                ` : ''}
                ${item.location && item.location !== item.address ? `
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${getMarkerColor(item.type)}; font-size: 14px;">📍</span>
                    <span style="font-size: 13px; color: #374151;"><strong>Location:</strong> ${item.location}</span>
                  </div>
                ` : ''}
                ${item.category ? `
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${getMarkerColor(item.type)}; font-size: 14px;">🏷️</span>
                    <span style="font-size: 13px; color: #374151;"><strong>Category:</strong> ${item.category}</span>
                  </div>
                ` : ''}
                ${item.business_type ? `
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${getMarkerColor(item.type)}; font-size: 14px;">🏢</span>
                    <span style="font-size: 13px; color: #374151;"><strong>Business Type:</strong> ${item.business_type}</span>
                  </div>
                ` : ''}
                ${item.neighborhoods ? `
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${getMarkerColor(item.type)}; font-size: 14px;">🏘️</span>
                    <span style="font-size: 13px; color: #374151;"><strong>Neighborhood:</strong> ${item.neighborhoods}</span>
                  </div>
                ` : ''}
                ${item.villages ? `
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${getMarkerColor(item.type)}; font-size: 14px;">🏘️</span>
                    <span style="font-size: 13px; color: #374151;"><strong>Village:</strong> ${Array.isArray(item.villages) ? item.villages.join(', ') : item.villages}</span>
                  </div>
                ` : ''}
                ${item.start_time || item.end_time ? `
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${getMarkerColor(item.type)}; font-size: 14px;">⏰</span>
                    <span style="font-size: 13px; color: #374151;"><strong>Time:</strong> ${item.start_time || ''} ${item.end_time ? `- ${item.end_time}` : ''}</span>
                  </div>
                ` : ''}
                ${item.price !== null && item.price !== undefined ? `
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${getMarkerColor(item.type)}; font-size: 14px;">💰</span>
                    <span style="font-size: 13px; color: #374151;"><strong>Price:</strong> ${item.price === 0 ? 'Free' : `$${item.price}`}</span>
                  </div>
                ` : ''}
              </div>
              
              <!-- Action button -->
              <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-service' : item.type}/${item.id}'" style="
                background: linear-gradient(135deg, ${getMarkerColor(item.type)} 0%, ${getMarkerColor(item.type)}dd 100%);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 13px;
                cursor: pointer;
                font-weight: 600;
                width: 100%;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px ${getMarkerColor(item.type)}25;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px ${getMarkerColor(item.type)}35'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px ${getMarkerColor(item.type)}25'">
                View Full Details →
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

        // Add single click handler only
        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('📍 Marker clicked:', item.title);
          
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
