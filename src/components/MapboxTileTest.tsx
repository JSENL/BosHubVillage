import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapboxToken } from '@/contexts/MapboxContext';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapboxTileTest = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { mapboxToken, isLoadingApiKey, error } = useMapboxToken();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isLoadingApiKey) {
      addDebug(`Waiting for requirements: container=${!!mapContainer.current}, token=${!!mapboxToken}, loading=${isLoadingApiKey}`);
      return;
    }

    addDebug('🚀 Starting Mapbox initialization with tiles focus');
    
    try {
      // Set the access token FIRST
      mapboxgl.accessToken = mapboxToken;
      addDebug(`✅ Mapbox access token set: ${mapboxToken.substring(0, 10)}...`);

      // Clear any existing map
      if (map.current) {
        map.current.remove();
        map.current = null;
        addDebug('🧹 Cleared existing map');
      }

      // Create the most basic map possible focused on tiles
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11', // Basic street style
        center: [-71.0589, 42.3601], // Boston
        zoom: 11,
        preserveDrawingBuffer: true,
        antialias: true
      });

      addDebug('🗺️ Map instance created, waiting for style load...');

      // Listen for style load (when tiles should start appearing)
      map.current.on('styledata', () => {
        addDebug('🎨 Style data loaded - tiles should be requesting now');
      });

      map.current.on('sourcedata', (e) => {
        if (e.sourceId) {
          addDebug(`📡 Source data loaded: ${e.sourceId}`);
        }
      });

      map.current.on('load', () => {
        addDebug('✅ Map fully loaded - tiles should be visible!');
        // Force a resize to ensure proper rendering
        if (map.current) {
          map.current.resize();
          addDebug('🔄 Map resized after load');
        }
      });

      map.current.on('error', (e) => {
        addDebug(`❌ Map error: ${e.error?.message || JSON.stringify(e)}`);
      });

      map.current.on('idle', () => {
        addDebug('💤 Map is idle - all tiles should be loaded');
      });

      // Monitor general data loading
      map.current.on('dataloading', () => {
        addDebug(`🔄 Loading map data...`);
      });

      map.current.on('data', () => {
        addDebug(`✅ Map data loaded`);
      });

    } catch (err) {
      addDebug(`💥 Critical error during map creation: ${err}`);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        addDebug('🧹 Cleanup complete');
      }
    };
  }, [mapboxToken, isLoadingApiKey]);

  if (isLoadingApiKey) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h3 className="font-bold text-yellow-800">Loading Mapbox Token...</h3>
      </div>
    );
  }

  if (error || !mapboxToken) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h3 className="font-bold text-red-800">Mapbox Token Error</h3>
        <p className="text-red-700">{error || 'No token available'}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-blue-100 border border-blue-400 rounded p-4">
        <h3 className="font-bold text-blue-800 mb-2">🗺️ MAPBOX TILE PRIORITY TEST</h3>
        <p className="text-blue-700 text-sm">Token: {mapboxToken.substring(0, 10)}...</p>
      </div>
      
      {/* Map container with explicit styling for tile visibility */}
      <div 
        ref={mapContainer} 
        className="w-full h-96 border-4 border-green-500 rounded-lg overflow-hidden"
        style={{
          position: 'relative',
          backgroundColor: '#f0f0f0' // Light gray background to contrast with tiles
        }}
      />
      
      {/* Debug info */}
      <div className="bg-gray-100 border border-gray-400 rounded p-3 max-h-40 overflow-y-auto">
        <h4 className="font-bold text-gray-800 mb-2">🔍 Debug Log:</h4>
        <div className="text-xs text-gray-700 space-y-1">
          {debugInfo.slice(-10).map((info, idx) => (
            <div key={idx} className="break-words">{info}</div>
          ))}
        </div>
      </div>
    </div>
  );
};