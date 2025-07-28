
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates, createPopupContent } from '@/utils/mapMarkerUtils';

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
    if (!map || !items || items.length === 0) {
      console.log('🗺️ MapMarkers: No map or items available');
      return;
    }

    console.log('🎯 Creating DOM markers for items:', items.length);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create markers for each item
    items.forEach(item => {
      const coords = validateCoordinates(item);
      if (!coords) return;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png)';
      el.style.backgroundSize = 'cover';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';

      // Add click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onMarkerClick) {
          onMarkerClick(item);
        }
      });

      // Add double-click handler
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (onMarkerDoubleClick) {
          onMarkerDoubleClick(item);
        }
      });

      // Create popup content with database information
      const popupHTML = `
        <div style="padding: 10px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #374151;">${item.title}</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7280;">${item.description || 'No description available'}</p>
          ${item.type ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>Type:</strong> ${item.type}</div>` : ''}
          ${item.category ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>Category:</strong> ${item.category}</div>` : ''}
          ${item.address ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>📍 Address:</strong> ${item.address}</div>` : ''}
          ${item.location ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>📍 Location:</strong> ${item.location}</div>` : ''}
          ${item.date ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>📅 Date:</strong> ${new Date(item.date).toLocaleDateString()}</div>` : ''}
          ${item.start_time ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>🕒 Time:</strong> ${item.start_time}${item.end_time ? ` - ${item.end_time}` : ''}</div>` : ''}
          ${item.price && item.price > 0 ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>💰 Price:</strong> $${item.price}</div>` : ''}
          ${item.villages ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>🏘️ Villages:</strong> ${Array.isArray(item.villages) ? item.villages.join(', ') : item.villages}</div>` : ''}
          ${item.neighborhoods ? `<div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>🏠 Neighborhoods:</strong> ${item.neighborhoods}</div>` : ''}
          <div style="margin: 8px 0 0 0;">
            <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-service' : item.type}/${item.id}'" style="
              background: linear-gradient(to right, #8b5cf6, #3b82f6);
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              cursor: pointer;
              font-weight: 500;
            ">View Details</button>
          </div>
        </div>
      `;

      // Create marker with popup
      const marker = new mapboxgl.Marker(el)
        .setLngLat([coords.lng, coords.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(popupHTML)
        )
        .addTo(map);

      markersRef.current.push(marker);
    });

    console.log(`✅ Created ${markersRef.current.length} DOM markers`);

    // Fit map bounds if we have valid markers
    if (markersRef.current.length > 0) {
      try {
        const coordinates = items
          .map(item => {
            const coords = validateCoordinates(item);
            return coords ? [coords.lng, coords.lat] : null;
          })
          .filter(coord => coord !== null) as [number, number][];
        
        if (coordinates.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          coordinates.forEach(coord => bounds.extend(coord));
          
          map.fitBounds(bounds, {
            padding: { top: 60, bottom: 60, left: 60, right: 60 },
            maxZoom: 14
          });
          console.log(`🗺️ Map bounds fitted to ${coordinates.length} valid coordinates`);
        }
      } catch (error) {
        console.warn('Error fitting map bounds:', error);
      }
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);
};
