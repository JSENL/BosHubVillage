
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
    let validMarkersCount = 0;
    let invalidCoordinatesCount = 0;
    
    items.forEach((item, index) => {
      try {
        // Enhanced coordinate validation
        const rawLat = item.latitude;
        const rawLng = item.longitude;
        
        // Log coordinate analysis for debugging
        console.log(`📍 Processing item "${item.title}" (${item.type}):`, {
          rawLat,
          rawLng,
          id: item.id,
          address: item.address
        });

        // Check if coordinates exist
        if (rawLat === null || rawLat === undefined || rawLng === null || rawLng === undefined) {
          console.warn(`❌ Missing coordinates for ${item.type} "${item.title}":`, {
            id: item.id,
            address: item.address,
            rawLat,
            rawLng
          });
          invalidCoordinatesCount++;
          return;
        }

        const lat = Number(rawLat);
        const lng = Number(rawLng);

        // Validate coordinates are valid numbers
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`❌ Invalid coordinates (NaN) for ${item.type} "${item.title}":`, {
            id: item.id,
            address: item.address,
            rawLat,
            rawLng,
            convertedLat: lat,
            convertedLng: lng
          });
          invalidCoordinatesCount++;
          return;
        }

        // Check for zero coordinates (often indicates failed geocoding)
        if (lat === 0 && lng === 0) {
          console.warn(`⚠️ Zero coordinates detected for ${item.type} "${item.title}":`, {
            id: item.id,
            address: item.address,
            message: 'This may indicate failed geocoding or default values'
          });
          invalidCoordinatesCount++;
          return;
        }

        // Validate coordinate ranges
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(`❌ Coordinates out of valid range for ${item.type} "${item.title}":`, {
            id: item.id,
            address: item.address,
            lat,
            lng,
            message: 'Latitude must be between -90 and 90, longitude between -180 and 180'
          });
          invalidCoordinatesCount++;
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
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: ${getMarkerColor(item.type)};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 12px;
          z-index: 1;
        `;

        // Add type indicator
        const typeIndicator = item.type.charAt(0).toUpperCase();
        markerElement.textContent = typeIndicator;

        // Add hover effect
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.2)';
          markerElement.style.zIndex = '1000';
          markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        });
        
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.zIndex = '1';
          markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        });

        // Create enhanced popup content
        const popupContent = `
          <div style="padding: 16px; max-width: 300px; font-family: system-ui; line-height: 1.4;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${item.title}</h3>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">${item.description || 'No description available'}</p>
            <div style="font-size: 12px; color: #374151;">
              ${item.address ? `<p style="margin: 4px 0;"><strong>📍 Address:</strong> ${item.address}</p>` : ''}
              ${item.location && item.location !== item.address ? `<p style="margin: 4px 0;"><strong>📍 Location:</strong> ${item.location}</p>` : ''}
              ${item.category ? `<p style="margin: 4px 0;"><strong>🏷️ Category:</strong> ${item.category}</p>` : ''}
              <p style="margin: 4px 0;"><strong>🏷️ Type:</strong> <span style="color: ${getMarkerColor(item.type)}; font-weight: bold;">${item.type.replace('-', ' ')}</span></p>
              ${item.date ? `<p style="margin: 4px 0;"><strong>📅 Date:</strong> ${item.date}</p>` : ''}
              <p style="margin: 4px 0; font-size: 11px; color: #9ca3af;"><strong>🗺️ Coordinates:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
            </div>
            <div style="margin-top: 16px;">
              <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-service' : item.type}/${item.id}'" style="
                background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 12px;
                cursor: pointer;
                font-weight: 600;
                width: 100%;
                transition: all 0.2s ease;
              " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                View Details →
              </button>
            </div>
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 35,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '320px',
          className: 'custom-popup'
        }).setHTML(popupContent);

        // Create marker
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        // Add click handlers
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log(`📍 Marker clicked: ${item.title} (${item.type})`);
          
          // Toggle popup visibility
          if (popup.isOpen()) {
            popup.remove();
          } else {
            popup.addTo(map);
          }
          
          if (onMarkerClick) {
            onMarkerClick(item);
          }
        });

        markerElement.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          console.log(`🖱️ Marker double-clicked: ${item.title} (${item.type})`);
          
          if (onMarkerDoubleClick) {
            onMarkerDoubleClick(item);
          }
        });

        newMarkers.push(marker);
        validMarkersCount++;
        
        console.log(`✅ Created marker ${validMarkersCount}: "${item.title}" (${item.type}) at [${lng}, ${lat}]`);

      } catch (error) {
        console.error(`❌ Error creating marker for ${item.type} "${item.title}":`, {
          id: item.id,
          error: error.message,
          stack: error.stack
        });
        invalidCoordinatesCount++;
      }
    });

    markersRef.current = newMarkers;
    
    // Summary logging
    console.log(`🎯 Marker creation summary:`, {
      totalItems: items.length,
      validMarkers: validMarkersCount,
      invalidCoordinates: invalidCoordinatesCount,
      successRate: `${((validMarkersCount / items.length) * 100).toFixed(1)}%`
    });

    // Enhanced map bounds fitting
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
    } else {
      console.warn('⚠️ No valid markers created - map bounds not adjusted');
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
