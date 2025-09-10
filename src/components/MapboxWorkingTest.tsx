import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

export const MapboxWorkingTest = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [status, setStatus] = useState<string>('🔄 Initializing...');
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setStatus('🗝️ Fetching Mapbox token...');
        console.log('🧪 MapboxTest: Fetching token...');
        
        const { data, error } = await supabase.functions.invoke('get-mapbox-key');
        
        console.log('🧪 MapboxTest: Response received:', { data, error });
        
        if (error) {
          console.error('🧪 MapboxTest: Token Error:', error);
          setStatus(`❌ Token Error: ${error.message}`);
          return;
        }

        if (data?.mapboxKey) {
          console.log('🧪 MapboxTest: Token received:', data.mapboxKey.substring(0, 20) + '...');
          setStatus('✅ Token received successfully!');
          setMapboxToken(data.mapboxKey);
        } else {
          console.error('🧪 MapboxTest: No token in response:', data);
          setStatus('❌ No token in response');
        }
      } catch (err) {
        console.error('🧪 MapboxTest: Network Error:', err);
        setStatus(`❌ Network Error: ${err}`);
      }
    };

    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    try {
      setStatus('🗺️ Initializing map...');
      console.log('🧪 MapboxTest: Setting access token...');
      mapboxgl.accessToken = mapboxToken;
      
      console.log('🧪 MapboxTest: Creating map instance...');
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40], // New York area
        zoom: 9
      });

      console.log('🧪 MapboxTest: Adding test marker...');
      // Add test marker
      new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat([-74.5, 40])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>🎉 Mapbox is Working!</h3>'))
        .addTo(map.current);

      map.current.on('load', () => {
        console.log('🧪 MapboxTest: Map loaded successfully!');
        setStatus('🎉 Mapbox Map Loaded Successfully!');
      });

      map.current.on('error', (e) => {
        console.error('🧪 MapboxTest: Map Error:', e);
        setStatus(`❌ Map Error: ${e.error?.message || 'Unknown error'}`);
      });

    } catch (err) {
      setStatus(`❌ Map Init Error: ${err}`);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  return (
    <div className="p-6 bg-background rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">🧪 Mapbox Test</h2>
      
      <div className="mb-4 p-3 bg-muted rounded">
        <strong>Status:</strong> <span className="ml-2">{status}</span>
      </div>

      {mapboxToken && (
        <div className="mb-4 p-3 bg-green-50 rounded text-sm">
          <strong>✅ Token Found:</strong> {mapboxToken.substring(0, 20)}...
        </div>
      )}

      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-lg border"
        style={{ minHeight: '400px' }}
      />
      
      <div className="mt-4 text-sm text-muted-foreground">
        If you see a map with a red marker and no errors, Mapbox is working perfectly! 🎉
      </div>
    </div>
  );
};