
import React from 'react';
import { MapboxDebug } from '@/components/MapboxDebug';
import { UniversalMap } from '@/components/UniversalMap';

const MapboxTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Mapbox Integration Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <MapboxDebug />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Universal Map Test</h2>
            <div className="h-96 border border-gray-300 rounded-lg overflow-hidden">
              <UniversalMap height="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxTestPage;
