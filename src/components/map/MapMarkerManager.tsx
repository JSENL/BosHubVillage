
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

        // Create marker element with fixed positioning
        const markerElement = document.createElement('div');
        markerElement.className = 'marker-custom';
        markerElement.style.cssText = `
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: ${getMarkerColor(item.type)};
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 10px;
          position: relative;
          transform-origin: center center;
        `;

        // Add type indicator
        const typeIndicator = item.type.charAt(0).toUpperCase();
        markerElement.textContent = typeIndicator;

        // Add hover effect that doesn't move the marker
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.2)';
          markerElement.style.zIndex = '1000';
          markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
        });
        
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.zIndex = 'auto';
          markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
        });

        // Create popup content
        const popupContent = `
          <div style="padding: 12px; max-width: 280px; font-family: system-ui;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #374151;">${item.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7280; line-height: 1.4;">${item.description || 'No description available'}</p>
            <div style="space-y: 4px; font-size: 12px;">
              ${item.address ? `<p style="margin: 2px 0;"><strong>Address:</strong> ${item.address}</p>` : ''}
              ${item.location ? `<p style="margin: 2px 0;"><strong>Location:</strong> ${item.location}</p>` : ''}
              ${item.category ? `<p style="margin: 2px 0;"><strong>Category:</strong> ${item.category}</p>` : ''}
              <p style="margin: 2px 0;"><strong>Type:</strong> <span style="color: ${getMarkerColor(item.type)}; font-weight: bold;">${item.type.replace('-', ' ')}</span></p>
              ${item.date ? `<p style="margin: 2px 0;"><strong>Date:</strong> ${item.date}</p>` : ''}
            </div>
            <div style="margin-top: 12px;">
              <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-service' : item.type}/${item.id}'" style="
                background: linear-gradient(to right, #8b5cf6, #3b82f6);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                font-weight: 500;
                width: 100%;
              ">View Details</button>
            </div>
          </div>
        `;

        // Create popup with proper anchor
        const popup = new mapboxgl.Popup({
          offset: 30,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px',
          anchor: 'bottom'
        }).setHTML(popupContent);

        // Create marker with center anchor to prevent movement
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center'
        })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        let clickTimeout: NodeJS.Timeout | null = null;

        // Add click handlers with proper timing
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          
          if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
            return;
          }

          clickTimeout = setTimeout(() => {
            console.log('📍 Marker clicked:', item.title);
            
            // Toggle popup visibility
            if (popup.isOpen()) {
              popup.remove();
            } else {
              popup.addTo(map);
            }
            
            if (onMarkerClick) {
              const simpleItem = {
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
              onMarkerClick(simpleItem as UnifiedItem);
            }
            
            clickTimeout = null;
          }, 200);
        });

        markerElement.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          
          if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
          }
          
          console.log('🖱️ Marker double-clicked:', item.title);
          
          // Ensure popup stays visible on double-click
          if (!popup.isOpen()) {
            popup.addTo(map);
          }
          
          if (onMarkerDoubleClick) {
            const simpleItem = {
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
            onMarkerDoubleClick(simpleItem as UnifiedItem);
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
