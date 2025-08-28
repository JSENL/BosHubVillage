import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/contexts/MapboxContext';
import { Button } from '@/components/ui/button';

export const MapboxTest = () => {
  const { mapboxToken, isLoadingApiKey, error } = useMapboxToken();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [mapStatus, setMapStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) {
      addLog('❌ Cannot initialize map - missing container or token');
      return;
    }

    // Clean up existing map
    if (mapInstance.current) {
      addLog('🧹 Cleaning up existing map');
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    setMapStatus('loading');
    addLog('🚀 Starting Mapbox initialization...');
    addLog(`🗝️ Using token: ${mapboxToken.substring(0, 10)}...`);

    try {
      mapboxgl.accessToken = mapboxToken;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-71.0589, 42.3601], // Boston
        zoom: 12,
        attributionControl: true,
        interactive: true
      });

      map.on('load', () => {
        addLog('✅ Map loaded successfully!');
        setMapStatus('loaded');
        
        // Add a test marker
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([-71.0589, 42.3601])
          .setPopup(new mapboxgl.Popup().setHTML('<h3>Test Marker</h3><p>Mapbox is working!</p>'))
          .addTo(map);
        
        addLog('📍 Test marker added');
      });

      map.on('error', (e) => {
        addLog(`❌ Map error: ${e.error?.message || 'Unknown error'}`);
        setMapStatus('error');
      });

      map.on('style.load', () => {
        addLog('🎨 Map style loaded');
      });

      mapInstance.current = map;
      addLog('📦 Map instance created');

    } catch (err) {
      addLog(`❌ Map initialization failed: ${err}`);
      setMapStatus('error');
    }
  };

  useEffect(() => {
    if (mapboxToken && !isLoadingApiKey) {
      addLog('✅ Mapbox token available, auto-initializing map');
      initializeMap();
    }
  }, [mapboxToken, isLoadingApiKey]);

  if (isLoadingApiKey) {
    return <div className="p-4">Loading Mapbox API key...</div>;
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-red-800 font-semibold">Mapbox Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">Mapbox Test</h2>
        <Button onClick={initializeMap} variant="outline">
          Reinitialize Map
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            mapStatus === 'loaded' ? 'bg-green-100 text-green-800' :
            mapStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' :
            mapStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {mapStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Map Container</h3>
          <div 
            ref={mapContainer} 
            className="w-full h-96 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Debug Logs</h3>
          <div className="h-96 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-50 text-xs font-mono">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>Token status:</strong> {mapboxToken ? 'Available' : 'Missing'}</p>
        <p><strong>Token preview:</strong> {mapboxToken ? `${mapboxToken.substring(0, 20)}...` : 'N/A'}</p>
      </div>
    </div>
  );
};