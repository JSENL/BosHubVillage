
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { useMapLoader } from '@/hooks/useMapLoader';
import { UnifiedItem } from '@/hooks/useUnifiedFiltering';

interface EnhancedUniversalMapProps {
  items: UnifiedItem[];
  height?: string;
  showFilters?: boolean;
  selectedTypes: string[];
  onTypeToggle?: (type: string) => void;
  onItemClick?: (item: UnifiedItem) => void;
}

export const EnhancedUniversalMap = ({ 
  items, 
  height = "400px", 
  showFilters = false,
  selectedTypes,
  onTypeToggle,
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
    selectedTypes.includes(item.type)
  );

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isLoadingApiKey) return;

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
      map.remove();
    };
  }, [mapboxToken, isLoadingApiKey]);

  // Create marker color based on type
  const getMarkerColor = (type: string): string => {
    const colors = {
      event: '#dc2626',
      news: '#2563eb',
      business: '#16a34a',
      'local-service': '#ca8a04'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  // Create popup content
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
      <div style="padding: 10px; max-width: 200px;">
        <div style="background: ${getMarkerColor(item.type)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px;">
          ${typeLabel}
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #374151;">${item.title}</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7280;">${displayDescription.substring(0, 100)}${displayDescription.length > 100 ? '...' : ''}</p>
        ${displayLocation ? `<p style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>📍 ${displayLocation}</strong></p>` : ''}
        ${item.category ? `<p style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>🏷️ ${item.category}</strong></p>` : ''}
        ${item.date ? `<p style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>📅 ${new Date(item.date).toLocaleDateString()}</strong></p>` : ''}
        ${item.price !== undefined ? `<p style="margin: 4px 0; font-size: 12px; color: #8B5CF6;"><strong>💰 ${item.price === 0 ? 'FREE' : `$${item.price}`}</strong></p>` : ''}
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
  };

  // Handle marker click
  const handleMarkerClick = (item: UnifiedItem) => {
    console.log('Marker clicked for item:', item.title);
    if (onItemClick) {
      onItemClick(item);
    }
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
      const marker = new mapboxgl.Marker({
        color: getMarkerColor(item.type)
      })
        .setLngLat([item.longitude!, item.latitude!])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(createPopupContent(item))
        )
        .addTo(mapInstanceRef.current!);

      marker.getElement().addEventListener('click', () => {
        handleMarkerClick(item);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (filteredMappableItems.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredMappableItems.forEach(item => {
        bounds.extend([item.longitude!, item.latitude!]);
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [filteredMappableItems, onItemClick]);

  // Handle type filter changes
  const toggleType = (type: string) => {
    console.log('Toggling type filter:', type);
    if (onTypeToggle) {
      onTypeToggle(type);
    }
  };

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

  // Count items by type from the filtered items
  const itemCounts = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {[
            { type: 'event', label: 'Events', color: 'bg-red-100 text-red-700' },
            { type: 'news', label: 'News', color: 'bg-blue-100 text-blue-700' },
            { type: 'business', label: 'Businesses', color: 'bg-green-100 text-green-700' },
            { type: 'local-service', label: 'Local Services', color: 'bg-yellow-100 text-yellow-700' }
          ].map(({ type, label, color }) => {
            const totalCount = itemCounts[type] || 0;
            const mappableCount = items.filter(item => 
              item.type === type && 
              item.latitude !== null && 
              item.longitude !== null
            ).length;
            
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedTypes.includes(type) 
                    ? color
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {label} ({totalCount}) - {mappableCount} on map
              </button>
            );
          })}
        </div>
      )}
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden relative" style={{ height }}>
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600">
          Showing {filteredMappableItems.length} markers
        </div>
      </div>
    </div>
  );
};
