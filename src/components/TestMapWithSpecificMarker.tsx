
import { useState } from 'react';
import { EnhancedUniversalMap } from './EnhancedUniversalMap';
import { SpecificMarkerSearch } from './map/SpecificMarkerSearch';
import { ManualMarkerAdder } from './map/ManualMarkerAdder';
import { UnifiedItem } from '@/types/unifiedItem';

export const TestMapWithSpecificMarker = () => {
  const [markers, setMarkers] = useState<UnifiedItem[]>([]);
  const searchId = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb';

  const handleMarkerFound = (item: UnifiedItem) => {
    setMarkers([item]);
  };

  const handleAddMarker = (item: UnifiedItem) => {
    setMarkers(prev => [...prev, item]);
  };

  const handleClearMarkers = () => {
    setMarkers([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpecificMarkerSearch 
          searchId={searchId}
          onMarkerFound={handleMarkerFound}
        />
        <ManualMarkerAdder 
          onAddMarker={handleAddMarker}
          defaultId={searchId}
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Map with Specific Markers ({markers.length} markers)
        </h2>
        {markers.length > 0 && (
          <button
            onClick={handleClearMarkers}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear All Markers
          </button>
        )}
      </div>

      <EnhancedUniversalMap
        items={markers}
        height="600px"
        selectedTypes={['event', 'news', 'business', 'local-service']}
        onItemClick={(item) => {
          console.log('Marker clicked:', item);
          alert(`Clicked marker: ${item.title}`);
        }}
      />

      {markers.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Current Markers:</h3>
          <div className="space-y-2">
            {markers.map((marker, index) => (
              <div key={marker.id} className="text-sm bg-white p-2 rounded border">
                <strong>{marker.title}</strong> - {marker.type} at [{marker.latitude}, {marker.longitude}]
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
