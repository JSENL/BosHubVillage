import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

const SimpleMapTest = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTest = async () => {
      console.log('🧪 SimpleMapTest: Starting comprehensive test...');
      
      setDebugInfo(prev => ({
        ...prev,
        step: 'Starting test',
        mapRefCurrent: !!mapRef.current,
        mapboxGLVersion: mapboxgl.version
      }));

      if (!mapRef.current) {
        const err = 'Map container ref is null';
        console.error('❌', err);
        setError(err);
        return;
      }

      try {
        // Step 1: Fetch token from edge function
        console.log('🔑 Fetching token from edge function...');
        setDebugInfo(prev => ({ ...prev, step: 'Fetching token' }));
        
        const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-key');
        
        if (tokenError) {
          throw new Error(`Token fetch error: ${tokenError.message}`);
        }

        if (!data?.mapboxKey) {
          throw new Error('No mapbox key in response');
        }

        const token = data.mapboxKey;
        console.log('✅ Token received:', token.substring(0, 20) + '...');
        
        setDebugInfo(prev => ({
          ...prev,
          tokenReceived: true,
          tokenPreview: token.substring(0, 20) + '...',
          tokenLength: token.length
        }));

        // Step 2: Set access token
        mapboxgl.accessToken = token;
        console.log('🔑 Token set on mapboxgl.accessToken');

        // Step 3: Create map
        console.log('🗺️ Creating map...');
        setDebugInfo(prev => ({ ...prev, step: 'Creating map' }));
        
        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-71.0589, 42.3601], // Boston
          zoom: 12,
          preserveDrawingBuffer: true
        });

        // Step 4: Set up event listeners
        map.on('load', () => {
          console.log('✅ Map loaded successfully!');
          setDebugInfo(prev => ({ ...prev, mapLoaded: true, step: 'Map loaded' }));
        });

        map.on('error', (e) => {
          console.error('❌ Map error:', e);
          setError(`Map error: ${e.error?.message || 'Unknown error'}`);
          setDebugInfo(prev => ({ ...prev, mapError: e.error?.message }));
        });

        map.on('style.load', () => {
          console.log('✅ Map style loaded');
          setDebugInfo(prev => ({ ...prev, styleLoaded: true }));
        });

        mapInstanceRef.current = map;
        setDebugInfo(prev => ({ ...prev, mapCreated: true }));

      } catch (error: any) {
        console.error('❌ SimpleMapTest error:', error);
        setError(error.message);
        setDebugInfo(prev => ({ ...prev, error: error.message }));
      }
    };

    runTest();

    return () => {
      if (mapInstanceRef.current) {
        console.log('🧹 Cleaning up test map...');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full bg-gray-200 border-2 border-red-500 p-4">
      <h3 className="text-center p-2 bg-yellow-200 mb-4 font-bold">🧪 Simple Mapbox Test</h3>
      
      {/* Debug Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded text-xs">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
          <h4 className="font-semibold text-red-700">Error:</h4>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-80 bg-gray-300 border border-gray-500"
        style={{
          width: '100%',
          height: '320px'
        }}
      />
      
      {/* Manual Tests */}
      <div className="mt-4 text-sm">
        <p><strong>Expected:</strong> Map should show Boston streets</p>
        <p><strong>Mapbox GL Version:</strong> {mapboxgl.version}</p>
        <p><strong>Container:</strong> {mapRef.current ? '✅ Ready' : '❌ Not ready'}</p>
      </div>
    </div>
  );
};

export default SimpleMapTest;