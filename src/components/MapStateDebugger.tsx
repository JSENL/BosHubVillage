import { useEffect, useState } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';

interface MapStateDebuggerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  mapInstance: any;
  mapboxToken: string | null;
  isLoadingApiKey: boolean;
  items: UnifiedItem[];
  viewMode: 'map' | 'list';
}

export const MapStateDebugger = ({ 
  mapRef, 
  mapInstance, 
  mapboxToken, 
  isLoadingApiKey, 
  items,
  viewMode 
}: MapStateDebuggerProps) => {
  const [debugInfo, setDebugInfo] = useState({
    mapRefExists: false,
    mapInstanceExists: false,
    mapLoaded: false,
    hasToken: false,
    isLoading: false,
    itemCount: 0,
    viewMode: 'list',
    timestamp: Date.now()
  });

  const [stateHistory, setStateHistory] = useState<any[]>([]);

  useEffect(() => {
    const updateDebugInfo = () => {
      const newInfo = {
        mapRefExists: !!mapRef.current,
        mapInstanceExists: !!mapInstance,
        mapLoaded: mapInstance ? mapInstance.loaded() : false,
        hasToken: !!mapboxToken,
        isLoading: isLoadingApiKey,
        itemCount: items.length,
        viewMode,
        timestamp: Date.now()
      };

      console.log('🔍 Map State Debug Update:', {
        ...newInfo,
        mapRefElement: mapRef.current ? 'DOM Element Present' : 'Missing',
        mapInstanceType: mapInstance ? typeof mapInstance : 'null',
        tokenLength: mapboxToken ? mapboxToken.length : 0
      });

      setDebugInfo(newInfo);
      
      // Keep history of last 10 state changes
      setStateHistory(prev => [...prev.slice(-9), {
        ...newInfo,
        time: new Date().toLocaleTimeString()
      }]);
    };

    updateDebugInfo();
  }, [mapRef, mapInstance, mapboxToken, isLoadingApiKey, items, viewMode]);

  // Log state changes when view mode changes
  useEffect(() => {
    console.log(`🔄 View mode changed to: ${viewMode}`);
    
    setTimeout(() => {
      console.log('🔍 Post view-change state check:', {
        mapRefExists: !!mapRef.current,
        mapInstanceExists: !!mapInstance,
        mapLoaded: mapInstance ? mapInstance.loaded() : false,
        viewMode
      });
    }, 100);

    setTimeout(() => {
      console.log('🔍 Delayed view-change state check (500ms):', {
        mapRefExists: !!mapRef.current,
        mapInstanceExists: !!mapInstance,
        mapLoaded: mapInstance ? mapInstance.loaded() : false,
        viewMode
      });
    }, 500);
  }, [viewMode]);

  if (viewMode !== 'map') {
    return null;
  }

  return (
    <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
      <h4 className="font-bold mb-2 text-yellow-300">Map State Debugger</h4>
      
      <div className="space-y-1">
        <div className={`flex justify-between ${debugInfo.mapRefExists ? 'text-green-300' : 'text-red-300'}`}>
          <span>MapRef:</span>
          <span>{debugInfo.mapRefExists ? '✅ EXISTS' : '❌ NULL'}</span>
        </div>
        
        <div className={`flex justify-between ${debugInfo.mapInstanceExists ? 'text-green-300' : 'text-red-300'}`}>
          <span>MapInstance:</span>
          <span>{debugInfo.mapInstanceExists ? '✅ EXISTS' : '❌ NULL'}</span>
        </div>
        
        <div className={`flex justify-between ${debugInfo.mapLoaded ? 'text-green-300' : 'text-red-300'}`}>
          <span>Map Loaded:</span>
          <span>{debugInfo.mapLoaded ? '✅ LOADED' : '❌ NOT LOADED'}</span>
        </div>
        
        <div className={`flex justify-between ${debugInfo.hasToken ? 'text-green-300' : 'text-red-300'}`}>
          <span>Token:</span>
          <span>{debugInfo.hasToken ? '✅ AVAILABLE' : '❌ MISSING'}</span>
        </div>
        
        <div className={`flex justify-between ${!debugInfo.isLoading ? 'text-green-300' : 'text-yellow-300'}`}>
          <span>Loading:</span>
          <span>{debugInfo.isLoading ? '⏳ YES' : '✅ NO'}</span>
        </div>
        
        <div className="flex justify-between text-blue-300">
          <span>Items:</span>
          <span>{debugInfo.itemCount}</span>
        </div>
        
        <div className="flex justify-between text-purple-300">
          <span>View:</span>
          <span>{debugInfo.viewMode.toUpperCase()}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-600">
        <h5 className="font-semibold text-yellow-300 mb-1">State History:</h5>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {stateHistory.slice(-5).map((state, index) => (
            <div key={index} className="text-xs">
              <div className="text-gray-400">{state.time}</div>
              <div className="ml-2">
                Ref: {state.mapRefExists ? '✅' : '❌'} | 
                Instance: {state.mapInstanceExists ? '✅' : '❌'} | 
                Loaded: {state.mapLoaded ? '✅' : '❌'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
