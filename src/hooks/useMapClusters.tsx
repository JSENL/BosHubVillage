import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates, getMarkerColor } from '@/utils/mapMarkerUtils';

interface UseMapClustersProps {
  map: mapboxgl.Map | null;
  items: UnifiedItem[];
  onMarkerClick?: (item: UnifiedItem) => void;
  onMarkerDoubleClick?: (item: UnifiedItem) => void;
}

export const useMapClusters = ({
  map,
  items,
  onMarkerClick,
  onMarkerDoubleClick
}: UseMapClustersProps) => {
  const sourceId = 'unified-items';
  const clusterLayer = 'clusters';
  const clusterCountLayer = 'cluster-count';
  const unclusteredLayer = 'unclustered-point';
  const hasFitBoundsRef = useRef(false);

  useEffect(() => {
    console.log('🎯 useMapClusters called with:', {
      hasMap: !!map,
      itemsCount: items?.length || 0,
      mapReady: map && map.loaded && map.loaded(),
    });

    if (!map || !items || items.length === 0) {
      return;
    }

    // Convert items to GeoJSON
    const validItems = items.filter(item => validateCoordinates(item));
    
    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: validItems.map((item) => {
        const coords = validateCoordinates(item);
        if (!coords) return null;
        
        return {
          type: 'Feature',
          properties: {
            id: item.id,
            title: item.title,
            description: item.description || '',
            type: item.type,
            category: item.category || '',
            address: item.address || '',
            itemData: JSON.stringify(item) // Store full item data
          },
          geometry: {
            type: 'Point',
            coordinates: [coords.lng, coords.lat]
          }
        };
      }).filter(Boolean) as GeoJSON.Feature[]
    };

    console.log(`🗺️ Created GeoJSON with ${geojsonData.features.length} features`);

    // Remove existing source and layers if they exist
    if (map.getLayer(unclusteredLayer)) map.removeLayer(unclusteredLayer);
    if (map.getLayer(clusterCountLayer)) map.removeLayer(clusterCountLayer);
    if (map.getLayer(clusterLayer)) map.removeLayer(clusterLayer);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    // Add clustered source
    map.addSource(sourceId, {
      type: 'geojson',
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points
    });

    // Add cluster circles layer
    map.addLayer({
      id: clusterLayer,
      type: 'circle',
      source: sourceId,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          'hsl(210, 75%, 55%)', // Blue for small clusters
          10,
          'hsl(35, 85%, 65%)', // Orange for medium clusters  
          30,
          'hsl(5, 75%, 55%)' // Red for large clusters
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20, // Small clusters
          10,
          25, // Medium clusters
          30,
          30 // Large clusters
        ],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add cluster count labels
    map.addLayer({
      id: clusterCountLayer,
      type: 'symbol',
      source: sourceId,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14
      },
      paint: {
        'text-color': '#ffffff'
      }
    });

    // Add unclustered points layer
    map.addLayer({
      id: unclusteredLayer,
      type: 'circle',
      source: sourceId,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'case',
          ['==', ['get', 'type'], 'event'], getMarkerColor('event'),
          ['==', ['get', 'type'], 'business'], getMarkerColor('business'),
          ['==', ['get', 'type'], 'local-service'], getMarkerColor('local-service'),
          getMarkerColor('default')
        ],
        'circle-radius': 12,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add click handlers
    const handleClusterClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayer]
      });
      
      if (features.length > 0) {
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
        
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          
          map.easeTo({
            center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
            zoom: zoom
          });
        });
      }
    };

    const handlePointClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [unclusteredLayer]
      });
      
      if (features.length > 0 && onMarkerClick) {
        const feature = features[0];
        try {
          const itemData = JSON.parse(feature.properties?.itemData || '{}');
          onMarkerClick(itemData as UnifiedItem);
        } catch (error) {
          console.error('Error parsing item data:', error);
        }
      }
    };

    const handlePointDoubleClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [unclusteredLayer]
      });
      
      if (features.length > 0 && onMarkerDoubleClick) {
        const feature = features[0];
        try {
          const itemData = JSON.parse(feature.properties?.itemData || '{}');
          onMarkerDoubleClick(itemData as UnifiedItem);
        } catch (error) {
          console.error('Error parsing item data:', error);
        }
      }
    };

    // Add event listeners
    map.on('click', clusterLayer, handleClusterClick);
    map.on('click', unclusteredLayer, handlePointClick);
    map.on('dblclick', unclusteredLayer, handlePointDoubleClick);

    // Change cursor on hover
    map.on('mouseenter', clusterLayer, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', clusterLayer, () => {
      map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', unclusteredLayer, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', unclusteredLayer, () => {
      map.getCanvas().style.cursor = '';
    });

    // Fit bounds only on initial load
    if (geojsonData.features.length > 0 && !hasFitBoundsRef.current) {
      try {
        const coordinates = geojsonData.features.map(feature => 
          (feature.geometry as GeoJSON.Point).coordinates as [number, number]
        );
        
        if (coordinates.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          coordinates.forEach(coord => bounds.extend(coord));
          
          map.fitBounds(bounds, {
            padding: { top: 60, bottom: 60, left: 60, right: 60 },
            maxZoom: 14
          });
          
          hasFitBoundsRef.current = true;
          console.log(`🗺️ Map bounds fitted to ${coordinates.length} valid coordinates (clustered)`);
        }
      } catch (error) {
        console.warn('Error fitting map bounds:', error);
      }
    }

    // Cleanup function
    return () => {
      if (map.getLayer(unclusteredLayer)) {
        map.off('click', unclusteredLayer, handlePointClick);
        map.off('dblclick', unclusteredLayer, handlePointDoubleClick);
        map.off('mouseenter', unclusteredLayer, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.off('mouseleave', unclusteredLayer, () => {
          map.getCanvas().style.cursor = '';
        });
      }
      if (map.getLayer(clusterLayer)) {
        map.off('click', clusterLayer, handleClusterClick);
        map.off('mouseenter', clusterLayer, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.off('mouseleave', clusterLayer, () => {
          map.getCanvas().style.cursor = '';
        });
      }
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);
};