import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates } from '@/utils/mapMarkerUtils';

export const fitMapToItems = (map: mapboxgl.Map, items: UnifiedItem[]) => {
  const coordinates = items
    .map(item => validateCoordinates(item))
    .filter(coords => coords !== null)
    .map(coords => [coords!.lng, coords!.lat]);

  if (coordinates.length === 0) return;

  const bounds = new mapboxgl.LngLatBounds();
  coordinates.forEach(coord => bounds.extend(coord as [number, number]));
  
  map.fitBounds(bounds, {
    padding: { top: 60, bottom: 60, left: 60, right: 60 },
    maxZoom: 14
  });

  console.log(`🗺️ Map bounds fitted to ${coordinates.length} valid coordinates`);
};