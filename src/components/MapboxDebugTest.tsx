import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMapboxToken } from '@/contexts/MapboxContext';
import mapboxgl from 'mapbox-gl';

export const MapboxDebugTest = () => {
  const [directFetchResult, setDirectFetchResult] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const { mapboxToken, isLoadingApiKey, error } = useMapboxToken();

  // Test direct edge function call
  useEffect(() => {
    const testDirectFetch = async () => {
      try {
        console.log('🧪 Testing direct edge function call...');
        const { data, error } = await supabase.functions.invoke('get-mapbox-key');
        
        console.log('🧪 Direct fetch result:', { data, error });
        setDirectFetchResult({ data, error, timestamp: new Date().toISOString() });
      } catch (err) {
        console.error('🧪 Direct fetch error:', err);
        setDirectFetchResult({ error: err, timestamp: new Date().toISOString() });
      }
    };

    testDirectFetch();
  }, []);

  // Test map creation when token is available
  useEffect(() => {
    if (mapboxToken && !mapInstance) {
      try {
        console.log('🧪 Testing Mapbox map creation with token:', mapboxToken.substring(0, 20) + '...');
        
        mapboxgl.accessToken = mapboxToken;
        
        // Create a temporary div for testing
        const testDiv = document.createElement('div');
        testDiv.style.width = '100px';
        testDiv.style.height = '100px';
        document.body.appendChild(testDiv);

        const map = new mapboxgl.Map({
          container: testDiv,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-71.0589, 42.3601],
          zoom: 10
        });

        map.on('load', () => {
          console.log('🧪 ✅ Test map loaded successfully!');
          setMapInstance(map);
        });

        map.on('error', (e) => {
          console.error('🧪 ❌ Test map error:', e);
        });

        // Cleanup function
        return () => {
          if (map) {
            map.remove();
            document.body.removeChild(testDiv);
          }
        };
      } catch (err) {
        console.error('🧪 ❌ Test map creation error:', err);
      }
    }
  }, [mapboxToken, mapInstance]);

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-red-500 rounded-lg p-4 max-w-md z-50 shadow-lg">
      <h3 className="font-bold text-red-600 mb-3">🧪 Mapbox Debug Test</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Context State:</strong>
          <div>• Loading: {isLoadingApiKey ? 'Yes' : 'No'}</div>
          <div>• Token: {mapboxToken ? `${mapboxToken.substring(0, 15)}...` : 'Missing'}</div>
          <div>• Error: {error || 'None'}</div>
        </div>

        <div>
          <strong>Direct Fetch Test:</strong>
          {directFetchResult ? (
            <div>
              <div>• Data: {directFetchResult.data ? 'Yes' : 'No'}</div>
              <div>• Error: {directFetchResult.error ? 'Yes' : 'No'}</div>
              <div>• Time: {directFetchResult.timestamp}</div>
            </div>
          ) : (
            <div>• Running...</div>
          )}
        </div>

        <div>
          <strong>Map Test:</strong>
          <div>• Instance: {mapInstance ? 'Created' : 'None'}</div>
        </div>

        <div className="mt-3 text-xs text-gray-600">
          Check console for detailed logs
        </div>
      </div>
    </div>
  );
};