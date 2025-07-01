
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapOverlaysProps {
  itemCount: number;
  isEmpty: boolean;
}

export const MapOverlays: React.FC<MapOverlaysProps> = ({ itemCount, isEmpty }) => {
  return (
    <>
      {/* Item count overlay */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md text-sm font-medium">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-purple-600" />
          <span>{itemCount} locations</span>
        </div>
      </div>

      {/* Empty state overlay */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations to display</h3>
            <p className="text-gray-600">
              Select content types or adjust filters to see locations on the map
            </p>
          </div>
        </div>
      )}

      {/* Loading indicator for when map is initializing */}
      <div className="absolute bottom-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs">
        Map Ready
      </div>
    </>
  );
};
