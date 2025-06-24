
import { useEffect, useRef, useState } from 'react';
import { useMapLoader } from '@/hooks/useMapLoader';

interface SectionMapProps {
  height?: string;
}

export const SectionMap = ({ height = "300px" }: SectionMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const { apiKey, mapLoaded, isLoadingApiKey, loadMap } = useMapLoader();

  useEffect(() => {
    const initializeMap = async () => {
      if (!apiKey) return;
      
      const map = await loadMap(mapRef);
      if (map) {
        mapInstanceRef.current = map;
      }
    };

    initializeMap();
  }, [apiKey, loadMap]);

  if (isLoadingApiKey) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <p className="text-gray-500">Google Maps not configured</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden" style={{ height }}>
      <div 
        ref={mapRef} 
        className="w-full h-full" 
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};
