
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { useMapLoader } from '@/hooks/useMapLoader';
import { UnifiedItem } from '@/types/unifiedItem';

interface EnhancedUniversalMapProps {
  items: UnifiedItem[];
  height?: string;
  selectedTypes: string[];
  onItemClick?: (item: UnifiedItem) => void;
}

export const EnhancedUniversalMap = ({ 
  items, 
  height = "400px", 
  selectedTypes,
  onItemClick
}: EnhancedUniversalMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const navigate = useNavigate();
  const { apiKey: mapboxToken, isLoadingApiKey, error } = useMapLoader();

  // Filter items to only show mappable ones (with coordinates) and selected types
  const filteredMappableItems = items.filter(item => 
    item.latitude !== null && 
    item.longitude !== null && 
    !isNaN(Number(item.latitude)) &&
    !isNaN(Number(item.longitude)) &&
    selectedTypes.includes(item.type)
  );

  console.log('EnhancedUniversalMap: Filtered mappable items count:', filteredMappableItems.length);
  console.log('EnhancedUniversalMap: Selected types:', selectedTypes);
  console.log('EnhancedUniversalMap: Total items received:', items.length);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isLoadingApiKey) return;

    console.log('Initializing Mapbox map...');
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-71.0589, 42.3601], // Boston center
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapInstanceRef.current = map;

    return () => {
      console.log('Cleaning up Mapbox map...');
      map.remove();
    };
  }, [mapboxToken, isLoadingApiKey]);

  // Create marker color based on type with specified colors
  const getMarkerColor = (type: string): string => {
    const colors = {
      event: '#dc2626',      // Red
      news: '#2563eb',       // Blue
      business: '#16a34a',   // Green
      'local-service': '#eab308'  // Yellow
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  // Create enhanced popup content
  const createPopupContent = (item: UnifiedItem): string => {
    const typeLabel = {
      event: 'Event',
      news: 'News',
      business: 'Business',
      'local-service': 'Local Service'
    }[item.type];

    const displayLocation = item.location || item.address || '';
    const displayDescription = item.description || item.content || '';

    return `
      <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="background: ${getMarkerColor(item.type)}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 10px; font-weight: 600;">
          ${typeLabel}
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937; line-height: 1.4;">${item.title}</h3>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">${displayDescription.substring(0, 120)}${displayDescription.length > 120 ? '...' : ''}</p>
        
        <div style="space-y: 4px;">
          ${displayLocation ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">📍</span> ${displayLocation}</p>` : ''}
          ${item.category ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">🏷️</span> ${item.category}</p>` : ''}
          ${item.date ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">📅</span> ${new Date(item.date).toLocaleDateString()}</p>` : ''}
          ${item.price !== undefined ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">💰</span> ${item.price === 0 ? 'FREE' : `$${item.price}`}</p>` : ''}
        </div>
        
        <div style="margin-top: 12px; display: flex; gap: 8px;">
          <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-service' : item.type}/${item.id}'" style="
            background: linear-gradient(to right, #8b5cf6, #3b82f6);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 500;
            flex: 1;
          ">View Details</button>
        </div>
        
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af; font-style: italic; text-align: center;">💡 Click marker to highlight • Double-click to view details</p>
        </div>
      </div>
    `;
  };

  // Handle marker click to highlight corresponding item
  const handleMarkerClick = (item: UnifiedItem) => {
    console.log('Marker clicked for item:', item.title, 'ID:', item.id);
    
    // Call the onItemClick callback if provided
    if (onItemClick) {
      onItemClick(item);
    }

    // Scroll to the corresponding item in the list
    setTimeout(() => {
      const itemElement = document.getElementById(`item-${item.id}`) || 
                         document.getElementById(`event-${item.id}`) ||
                         document.getElementById(`news-${item.id}`) ||
                         document.getElementById(`business-${item.id}`) ||
                         document.getElementById(`service-${item.id}`);
      
      if (itemElement) {
        console.log('Scrolling to item element:', item.id);
        itemElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add highlight effect
        itemElement.classList.add('ring-2', 'ring-purple-500', 'ring-opacity-75');
        setTimeout(() => {
          itemElement.classList.remove('ring-2', 'ring-purple-500', 'ring-opacity-75');
        }, 3000);
      } else {
        console.warn('Item element not found for ID:', item.id);
      }
    }, 100);
  };

  // Handle marker double-click to navigate to detail page
  const handleMarkerDoubleClick = (item: UnifiedItem) => {
    console.log('Marker double-clicked for item:', item.title);
    const routePath = item.type === 'local-service' ? 'local-service' : item.type;
    navigate(`/${routePath}/${item.id}`);
  };

  // Add markers to map - This effect will run whenever filteredMappableItems changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    console.log('Updating map markers. Filtered mappable items:', filteredMappableItems.length);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for filtered items
    filteredMappableItems.forEach((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid coordinates for item:', item.id, lat, lng);
        return;
      }

      const marker = new mapboxgl.Marker({
        color: getMarkerColor(item.type),
        scale: 0.8
      })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false
          }).setHTML(createPopupContent(item))
        )
        .addTo(mapInstanceRef.current!);

      // Add single-click event listener for highlighting
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        handleMarkerClick(item);
      });

      // Add double-click event listener for navigation
      marker.getElement().addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleMarkerDoubleClick(item);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (filteredMappableItems.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredMappableItems.forEach(item => {
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lng, lat]);
        }
      });
      
      // Only fit bounds if we have more than one marker
      if (filteredMappableItems.length > 1) {
        mapInstanceRef.current.fitBounds(bounds, { 
          padding: 50,
          maxZoom: 15
        });
      } else if (filteredMappableItems.length === 1) {
        // For single marker, center on it
        const item = filteredMappableItems[0];
        mapInstanceRef.current.setCenter([Number(item.longitude), Number(item.latitude)]);
        mapInstanceRef.current.setZoom(14);
      }
    }
  }, [filteredMappableItems, onItemClick, navigate]);

  if (isLoadingApiKey) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center flex-col p-8" style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  if (error || !mapboxToken) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center flex-col p-8" style={{ height }}>
        <p className="text-red-500 mb-4">{error || 'Failed to load Mapbox API key'}</p>
        <p className="text-sm text-gray-400">Please check your Mapbox configuration</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden relative" style={{ height }}>
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm">
          Showing {filteredMappableItems.length} markers
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-500 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>News</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Services</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-500 shadow-sm">
          💡 Click markers to highlight items | Double-click to view details
        </div>
        {filteredMappableItems.length === 0 && !isLoadingApiKey && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
            <div className="text-center p-6">
              <div className="text-gray-400 mb-2">🗺️</div>
              <p className="text-gray-600 text-sm">No mappable items match your current filters</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
