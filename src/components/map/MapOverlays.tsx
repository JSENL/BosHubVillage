
import React from 'react';

interface MapOverlaysProps {
  itemCount: number;
  isEmpty: boolean;
}

export const MapOverlays = ({ itemCount, isEmpty }: MapOverlaysProps) => {
  return (
    <>
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 z-10">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Map Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">E</div>
            <span className="text-gray-600">Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">N</div>
            <span className="text-gray-600">News</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">B</div>
            <span className="text-gray-600">Businesses</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold">L</div>
            <span className="text-gray-600">Local Services</span>
          </div>
        </div>
      </div>

      {/* Item Counter */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {itemCount} {itemCount === 1 ? 'marker' : 'markers'}
          </span>
        </div>
      </div>

      {/* Empty State Overlay */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-20">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Items to Display</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters to see more content on the map.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
