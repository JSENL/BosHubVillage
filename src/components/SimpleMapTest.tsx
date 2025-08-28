import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const SimpleMapTest = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    console.log('🧪 SimpleMapTest: Starting...');
    
    // Use the known working token directly for testing
    mapboxgl.accessToken = 'REMOVED_MAPBOX_TOKEN';
    
    try {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-71.0589, 42.3601], // Boston
        zoom: 12
      });

      map.on('load', () => {
        console.log('✅ SimpleMapTest: Map loaded successfully!');
      });

      map.on('error', (e) => {
        console.error('❌ SimpleMapTest: Map error:', e);
      });

      mapInstanceRef.current = map;
    } catch (error) {
      console.error('❌ SimpleMapTest: Failed to create map:', error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-96 bg-gray-200 border-2 border-red-500">
      <h3 className="text-center p-2 bg-yellow-200">Simple Mapbox Test</h3>
      <div 
        ref={mapRef} 
        className="w-full h-80"
        style={{
          width: '100%',
          height: '320px',
          backgroundColor: '#f0f0f0'
        }}
      />
    </div>
  );
};

export default SimpleMapTest;