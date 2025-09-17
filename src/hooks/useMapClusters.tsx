import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates, getMarkerColor } from '@/utils/mapMarkerUtils';
import { groupItemsByLocation } from '@/utils/mapLocationGrouping';
import { createMultiItemPopupContent } from '@/utils/mapMultiEventPopup';

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
      styleLoaded: map && map.isStyleLoaded && map.isStyleLoaded(),
      mapRemoved: map && map._removed
    });

    if (!map || !items || items.length === 0) {
      console.log('🗺️ MapClusters: Not ready - missing map or items');
      return;
    }

    // Additional check to ensure map is not removed
    if (map._removed) {
      console.log('🗺️ MapClusters: Map instance has been removed, skipping');
      return;
    }

    const addClusteringToMap = () => {
      console.log('🎯 Adding clustering to map...');
      
      // Group items by location to handle multiple items at same location
      const locationGroups = groupItemsByLocation(items);
      
      const geojsonData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: locationGroups.map((group) => {
          return {
            type: 'Feature',
            properties: {
              id: group.primaryItem.id,
              title: group.primaryItem.title,
              description: group.primaryItem.description || '',
              type: group.primaryItem.type,
              category: group.primaryItem.category || '',
              address: group.primaryItem.address || '',
              itemCount: group.items.length,
              allItemsData: JSON.stringify(group.items), // Store all items at this location
              primaryItemData: JSON.stringify(group.primaryItem)
            },
            geometry: {
              type: 'Point',
              coordinates: [group.location.lng, group.location.lat]
            }
          };
        })
      };

      console.log(`🗺️ Creating GeoJSON with ${geojsonData.features.length} features`);

      // Check if source already exists and remove it first
      const existingSource = map.getSource(sourceId);
      if (existingSource) {
        console.log('🧹 Removing existing source and layers...');
        // Remove layers first, then source
        if (map.getLayer(unclusteredLayer + '-labels')) map.removeLayer(unclusteredLayer + '-labels');
        if (map.getLayer(unclusteredLayer)) map.removeLayer(unclusteredLayer);
        if (map.getLayer(clusterCountLayer)) map.removeLayer(clusterCountLayer);
        if (map.getLayer(clusterLayer)) map.removeLayer(clusterLayer);
        map.removeSource(sourceId);
      }

      try {
        // Add clustered source
        map.addSource(sourceId, {
          type: 'geojson',
          data: geojsonData,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points
        });
        console.log('✅ Successfully added clustered source');

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

        // Add unclustered point labels (type letters with count for multi-item locations)
        map.addLayer({
          id: unclusteredLayer + '-labels',
          type: 'symbol',
          source: sourceId,
          filter: ['!', ['has', 'point_count']],
          layout: {
            'text-field': [
              'case',
              ['>', ['get', 'itemCount'], 1],
              ['concat', 
                [
                  'case',
                  ['==', ['get', 'type'], 'event'], 'E',
                  ['==', ['get', 'type'], 'business'], 'B',
                  ['==', ['get', 'type'], 'local-service'], 'L',
                  ['==', ['get', 'type'], 'news'], 'N',
                  '?'
                ],
                ['to-string', ['get', 'itemCount']]
              ],
              [
                'case',
                ['==', ['get', 'type'], 'event'], 'E',
                ['==', ['get', 'type'], 'business'], 'B',
                ['==', ['get', 'type'], 'local-service'], 'L',
                ['==', ['get', 'type'], 'news'], 'N',
                '?'
              ]
            ],
            'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            'text-size': [
              'case',
              ['>', ['get', 'itemCount'], 1], 10, // Smaller text for count
              11 // Normal size for single items
            ],
            'text-allow-overlap': true,
            'text-ignore-placement': true
          },
          paint: {
            'text-color': '#ffffff'
          }
        });

        console.log('✅ Successfully added all clustering layers');

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
            layers: [unclusteredLayer, unclusteredLayer + '-labels']
          });
          
          if (features.length > 0) {
            const feature = features[0];
            try {
              const allItemsData = JSON.parse(feature.properties?.allItemsData || '[]');
              const primaryItemData = JSON.parse(feature.properties?.primaryItemData || '{}');
              
              // Create and show custom popup for multiple items
              const popupContent = createMultiItemPopupContent(allItemsData);
              
              const popup = new mapboxgl.Popup({
                offset: 35,
                closeButton: true,
                closeOnClick: false,
                maxWidth: '400px',
                className: 'multi-item-popup'
              })
                .setLngLat((feature.geometry as GeoJSON.Point).coordinates as [number, number])
                .setHTML(popupContent)
                .addTo(map);
              
              // Also trigger the click handler for the primary item
              if (onMarkerClick) {
                onMarkerClick(primaryItemData as UnifiedItem);
              }
            } catch (error) {
              console.error('Error parsing item data:', error);
            }
          }
        };

        const handlePointDoubleClick = (e: mapboxgl.MapMouseEvent) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: [unclusteredLayer, unclusteredLayer + '-labels']
          });
          
          if (features.length > 0 && onMarkerDoubleClick) {
            const feature = features[0];
            try {
              const primaryItemData = JSON.parse(feature.properties?.primaryItemData || '{}');
              onMarkerDoubleClick(primaryItemData as UnifiedItem);
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
        map.on('mouseenter', unclusteredLayer + '-labels', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', unclusteredLayer + '-labels', () => {
          map.getCanvas().style.cursor = '';
        });

        // Store event handlers for cleanup
        const cleanupHandlers = () => {
          if (map && !map._removed) {
            map.off('click', clusterLayer, handleClusterClick);
            map.off('click', unclusteredLayer, handlePointClick);
            map.off('dblclick', unclusteredLayer, handlePointDoubleClick);
          }
        };

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

      } catch (error) {
        console.error('❌ Error adding clustering:', error);
        return;
      }
    };

    // Wait for map to be ready or add clustering immediately if ready
    const isMapReady = map.loaded() && map.isStyleLoaded() && !map._removed;
    
    if (isMapReady) {
      console.log('🎯 Map is ready, adding clustering immediately');
      addClusteringToMap();
    } else {
      console.log('🗺️ MapClusters: Waiting for map to load and style to be ready...');
      
      const handleStyleLoad = () => {
        console.log('🎨 Map style loaded, adding clustering...');
        if (map.loaded() && map.isStyleLoaded() && !map._removed) {
          addClusteringToMap();
        }
      };
      
      const handleLoad = () => {
        console.log('🗺️ Map loaded, checking style...');
        if (map.loaded() && map.isStyleLoaded() && !map._removed) {
          addClusteringToMap();
        }
      };

      // Force clustering after a short delay as a fallback
      const fallbackTimeout = setTimeout(() => {
        if (map && map.loaded() && map.isStyleLoaded() && !map._removed) {
          console.log('🔄 Fallback: Adding clustering after timeout');
          addClusteringToMap();
        }
      }, 500);

      map.on('styledata', handleStyleLoad);
      map.on('load', handleLoad);
      
      return () => {
        clearTimeout(fallbackTimeout);
        map.off('styledata', handleStyleLoad);
        map.off('load', handleLoad);
      };
    }

    // Cleanup function when component unmounts or dependencies change
    return () => {
      if (map && !map._removed) {
        try {
          // Remove layers first, then source
          if (map.getLayer(unclusteredLayer + '-labels')) map.removeLayer(unclusteredLayer + '-labels');
          if (map.getLayer(unclusteredLayer)) map.removeLayer(unclusteredLayer);
          if (map.getLayer(clusterCountLayer)) map.removeLayer(clusterCountLayer);
          if (map.getLayer(clusterLayer)) map.removeLayer(clusterLayer);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
          console.log('🧹 Cleaned up clustering layers and sources');
        } catch (error) {
          console.warn('⚠️ Error during clustering cleanup:', error);
        }
      }
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);
};