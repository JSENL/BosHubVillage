import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { useMapLoader } from './useMapLoader';
import { useGeocoding } from './useGeocoding';
import { toast } from 'sonner';

interface DirectionsState {
  isLoading: boolean;
  route: any | null;
  directions: any[] | null;
  error: string | null;
}

export const useDirections = (mapInstance: mapboxgl.Map | null) => {
  const [directionsState, setDirectionsState] = useState<DirectionsState>({
    isLoading: false,
    route: null,
    directions: null,
    error: null
  });

  const { apiKey: mapboxToken } = useMapLoader();
  const { geocode } = useGeocoding();

  const getDirections = useCallback(async (
    startLocation: string, 
    item: UnifiedItem, 
    transportMode: string = 'driving'
  ) => {
    if (!mapboxToken || !mapInstance || !item.latitude || !item.longitude) {
      toast.error('Map or location data not available');
      return;
    }

    setDirectionsState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Geocode the starting location
      const startCoords = await geocode(startLocation);
      if (!startCoords) {
        throw new Error('Could not find starting location');
      }

      // Map transport modes to Mapbox profiles
      const profileMap: Record<string, string> = {
        driving: 'driving',
        walking: 'walking',
        cycling: 'cycling',
        transit: 'driving' // Mapbox doesn't have public transit, fallback to driving
      };

      const profile = profileMap[transportMode] || 'driving';
      
      // Call Mapbox Directions API
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startCoords.longitude},${startCoords.latitude};${item.longitude},${item.latitude}?geometries=geojson&steps=true&access_token=${mapboxToken}`;
      
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Add route to map
        if (mapInstance.getSource('route')) {
          mapInstance.removeLayer('route');
          mapInstance.removeSource('route');
        }

        mapInstance.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });

        mapInstance.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 6,
            'line-opacity': 0.8
          }
        });

        // Add start marker
        const startMarker = new mapboxgl.Marker({ color: '#10b981' })
          .setLngLat([startCoords.longitude, startCoords.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<div style="padding: 8px;"><strong>Start:</strong> ${startLocation}</div>`))
          .addTo(mapInstance);

        // Fit map to show entire route
        const coordinates = route.geometry.coordinates;
        const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        mapInstance.fitBounds(bounds, {
          padding: 50
        });

        setDirectionsState({
          isLoading: false,
          route,
          directions: route.legs[0]?.steps || [],
          error: null
        });

        const duration = Math.round(route.duration / 60);
        const distance = (route.distance / 1000).toFixed(1);
        toast.success(`Route found: ${distance} km, ${duration} minutes`);

      } else {
        throw new Error('No route found');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get directions';
      setDirectionsState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      toast.error(errorMessage);
    }
  }, [mapboxToken, mapInstance, geocode]);

  const clearDirections = useCallback(() => {
    if (mapInstance) {
      // Remove route layer and source
      if (mapInstance.getSource('route')) {
        mapInstance.removeLayer('route');
        mapInstance.removeSource('route');
      }
    }
    
    setDirectionsState({
      isLoading: false,
      route: null,
      directions: null,
      error: null
    });
  }, [mapInstance]);

  return {
    ...directionsState,
    getDirections,
    clearDirections
  };
};