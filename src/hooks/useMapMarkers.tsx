
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
  const sourceIdRef = useRef('unified-items');
  const layerIdRef = useRef('unified-items-layer');

  useEffect(() => {
    if (!map || !items || items.length === 0) {
      console.log('🗺️ MapMarkers: No map or items available');
      return;
    }

    console.log('🎯 Creating GeoJSON markers for items:', items.length);

    const sourceId = sourceIdRef.current;
    const layerId = layerIdRef.current;

    // Remove existing layer and source if they exist
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Create GeoJSON features from items
    const features = items
      .map(item => {
        const coords = validateCoordinates(item);
        if (!coords) return null;

        return {
          type: 'Feature' as const,
          properties: {
            id: item.id,
            title: item.title,
            description: item.description,
            type: item.type,
            address: item.address || '',
            category: item.category || '',
            date: item.date || '',
            price: item.price || 0,
            originalData: JSON.stringify(item.originalData || {})
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [coords.lng, coords.lat]
          }
        };
      })
      .filter(feature => feature !== null);

    console.log(`✅ Created ${features.length} valid GeoJSON features`);

    // Add source
    map.addSource(sourceId, {
      type: 'geojson',
      generateId: true,
      data: {
        type: 'FeatureCollection',
        features: features
      }
    });

    // Add circle layer
    map.addLayer({
      id: layerId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': 10,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-color': [
          'case',
          ['==', ['get', 'type'], 'event'], '#8b5cf6',
          ['==', ['get', 'type'], 'news'], '#3b82f6',
          ['==', ['get', 'type'], 'business'], '#10b981',
          ['==', ['get', 'type'], 'local-service'], '#f59e0b',
          '#6b7280'
        ]
      }
    });

    // Click interaction for popups
    const clickHandler = (e: any) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      
      // Reconstruct item from properties
      const item: UnifiedItem = {
        id: properties.id,
        title: properties.title,
        description: properties.description,
        type: properties.type,
        latitude: coordinates[1],
        longitude: coordinates[0],
        address: properties.address,
        category: properties.category,
        date: properties.date,
        price: properties.price,
        originalData: properties.originalData ? JSON.parse(properties.originalData) : null
      };

      // Create popup
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(createPopupContent(item))
        .addTo(map);

      // Call click handler if provided
      if (onMarkerClick) {
        onMarkerClick(item);
      }
    };

    // Double-click interaction for toasts
    const doubleClickHandler = (e: any) => {
      e.preventDefault();
      const properties = e.features[0].properties;
      const coordinates = e.features[0].geometry.coordinates;
      
      const item: UnifiedItem = {
        id: properties.id,
        title: properties.title,
        description: properties.description,
        type: properties.type,
        latitude: coordinates[1],
        longitude: coordinates[0],
        address: properties.address,
        category: properties.category,
        date: properties.date,
        price: properties.price,
        originalData: properties.originalData ? JSON.parse(properties.originalData) : null
      };

      if (onMarkerDoubleClick) {
        onMarkerDoubleClick(item);
      }
    };

    // Add event listeners
    map.on('click', layerId, clickHandler);
    map.on('dblclick', layerId, doubleClickHandler);

    // Cursor interactions
    const mouseEnterHandler = () => {
      map.getCanvas().style.cursor = 'pointer';
    };

    const mouseLeaveHandler = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('mouseenter', layerId, mouseEnterHandler);
    map.on('mouseleave', layerId, mouseLeaveHandler);

    // Fit map bounds if we have valid markers
    if (features.length > 0) {
      try {
        const coordinates = features.map(f => f.geometry.coordinates);
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach(coord => bounds.extend(coord as [number, number]));
        
        map.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          maxZoom: 14
        });
        console.log(`🗺️ Map bounds fitted to ${coordinates.length} valid coordinates`);
      } catch (error) {
        console.warn('Error fitting map bounds:', error);
      }
    }

    // Cleanup function
    return () => {
      map.off('click', layerId, clickHandler);
      map.off('dblclick', layerId, doubleClickHandler);
      map.off('mouseenter', layerId, mouseEnterHandler);
      map.off('mouseleave', layerId, mouseLeaveHandler);
      
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);
};
