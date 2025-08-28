
import React from 'react';
import { useMapboxToken } from '@/contexts/MapboxContext';
import { MapboxTest } from '@/components/MapboxTest';

export const MapboxDebug = () => {
  const { mapboxToken, isLoadingApiKey, error } = useMapboxToken();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Mapbox Debug Information</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Token Status</h3>
        <p><strong>Loading:</strong> {isLoadingApiKey ? 'Yes' : 'No'}</p>
        <p><strong>Has Token:</strong> {mapboxToken ? 'Yes' : 'No'}</p>
        <p><strong>Token Preview:</strong> {mapboxToken ? `${mapboxToken.substring(0, 20)}...` : 'None'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
      </div>

      {mapboxToken && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Mapbox Test Component</h3>
          <MapboxTest />
        </div>
      )}
    </div>
  );
};
