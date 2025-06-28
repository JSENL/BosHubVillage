
interface MapOverlaysProps {
  itemCount: number;
  isEmpty: boolean;
}

export const MapOverlays = ({ itemCount, isEmpty }: MapOverlaysProps) => {
  return (
    <>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm">
        Showing {itemCount} markers
      </div>
      
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-500 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>News</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Businesses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Services</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-500 shadow-sm">
        💡 Click markers to highlight items | Double-click to view details
      </div>
      
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
          <div className="text-center p-6">
            <div className="text-gray-400 mb-2">🗺️</div>
            <p className="text-gray-600 text-sm">No mappable items match your current filters</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your filter criteria</p>
          </div>
        </div>
      )}
    </>
  );
};
