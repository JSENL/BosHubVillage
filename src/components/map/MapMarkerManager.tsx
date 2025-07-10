
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

        // Enhanced marker colors and icons for all four table types
        const getMarkerConfig = (type: string) => {
          switch (type) {
            case 'event':
              return { 
                color: '#ef4444', // red
                icon: 'E',
                bgGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              };
            case 'news':
              return { 
                color: '#3b82f6', // blue
                icon: 'N',
                bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              };
            case 'business':
              return { 
                color: '#22c55e', // green
                icon: 'B',
                bgGradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              };
            case 'local-service':
              return { 
                color: '#eab308', // yellow
                icon: 'L',
                bgGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
              };
            default:
              return { 
                color: '#6b7280', // gray
                icon: '?',
                bgGradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
              };
          }
        };

        const markerConfig = getMarkerConfig(item.type);

        // Create enhanced marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker-custom';
        markerElement.style.cssText = `
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${markerConfig.bgGradient};
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 14px;
          z-index: 1;
          position: relative;
        `;

        // Add type indicator with enhanced styling
        markerElement.textContent = markerConfig.icon;

        // Add hover effect with enhanced animation
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.3)';
          markerElement.style.zIndex = '1000';
          markerElement.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });
        
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.zIndex = '1';
          markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        });

        // Create comprehensive popup content for all table types
        const createPopupContent = (item: UnifiedItem) => {
          const typeLabel = item.type.replace('-', ' ').toUpperCase();
          
          return `
            <div style="padding: 16px; max-width: 320px; font-family: system-ui; line-height: 1.5;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <div style="
                  width: 24px; 
                  height: 24px; 
                  border-radius: 50%; 
                  background: ${markerConfig.bgGradient}; 
                  color: white; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  font-weight: bold; 
                  font-size: 12px;
                  margin-right: 8px;
                ">${markerConfig.icon}</div>
                <span style="font-size: 12px; font-weight: 600; color: ${markerConfig.color}; text-transform: uppercase;">${typeLabel}</span>
              </div>
              
              <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #1f2937; line-height: 1.3;">${item.title}</h3>
              
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">${item.description || 'No description available'}</p>
              
              <div style="font-size: 13px; color: #374151; margin-bottom: 16px;">
                ${item.address ? `
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 6px;">📍</span>
                    <strong>Address:</strong> <span style="margin-left: 4px;">${item.address}</span>
                  </div>
                ` : ''}
                
                ${item.location && item.location !== item.address ? `
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 6px;">📍</span>
                    <strong>Location:</strong> <span style="margin-left: 4px;">${item.location}</span>
                  </div>
                ` : ''}
                
                ${item.category ? `
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 6px;">🏷️</span>
                    <strong>Category:</strong> <span style="margin-left: 4px;">${item.category}</span>
                  </div>
                ` : ''}
                
                ${item.date ? `
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 6px;">📅</span>
                    <strong>Date:</strong> <span style="margin-left: 4px;">${item.date}</span>
                  </div>
                ` : ''}
                
                ${item.start_time ? `
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 6px;">⏰</span>
                    <strong>Time:</strong> <span style="margin-left: 4px;">${item.start_time}${item.end_time ? ` - ${item.end_time}` : ''}</span>
                  </div>
                ` : ''}
                
                ${item.price && item.price > 0 ? `
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 6px;">💰</span>
                    <strong>Price:</strong> <span style="margin-left: 4px;">$${item.price}</span>
                  </div>
                ` : ''}
                
                <div style="margin: 6px 0; font-size: 11px; color: #9ca3af;">
                  <strong>📍 Coordinates:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}
                </div>
              </div>
              
              <div style="margin-top: 16px;">
                <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-service' : item.type}/${item.id}'" style="
                  background: ${markerConfig.bgGradient};
                  color: white;
                  border: none;
                  padding: 12px 20px;
                  border-radius: 8px;
                  font-size: 13px;
                  cursor: pointer;
                  font-weight: 600;
                  width: 100%;
                  transition: all 0.2s ease;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                  View Details →
                </button>
              </div>
            </div>
          `;
        };

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 40,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '360px',
          className: 'custom-popup'
        }).setHTML(createPopupContent(item));

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
    
    // Enhanced summary logging
    console.log(`🎯 Marker creation summary:`, {
      totalItems: items.length,
      validMarkers: validMarkersCount,
      invalidCoordinates: invalidCoordinatesCount,
      successRate: `${((validMarkersCount / items.length) * 100).toFixed(1)}%`,
      markersByType: items.reduce((acc, item) => {
        if (item.latitude && item.longitude && !isNaN(Number(item.latitude)) && !isNaN(Number(item.longitude))) {
          acc[item.type] = (acc[item.type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
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
            padding: { top: 80, bottom: 80, left: 80, right: 80 },
            maxZoom: 13
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
