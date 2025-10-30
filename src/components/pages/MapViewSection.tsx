import { useState, useEffect } from 'react';
import { Map, List } from 'lucide-react';
import { EnhancedUniversalMap } from "@/components/EnhancedUniversalMap";
import { useFilterContext } from './FilterProvider';

export const MapViewSection = () => {
  const { filteredItems, selectedType, viewMode, setViewMode } = useFilterContext();
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [isRefreshingMap, setIsRefreshingMap] = useState(false);

  // Auto-refresh map when switching from list to map view
  useEffect(() => {
    if (viewMode === 'map') {
      console.log('🔄 Switching to map view, initiating auto-refresh...');
      setIsRefreshingMap(true);
      
      // Small delay to ensure DOM cleanup, then refresh map
      const refreshTimeout = setTimeout(() => {
        setMapRefreshKey(prev => prev + 1);
        console.log(`🗺️ Map refresh triggered with key: ${mapRefreshKey + 1}`);
        
        // Reset refresh state after a short delay
        setTimeout(() => {
          setIsRefreshingMap(false);
          console.log('✅ Map refresh completed');
        }, 500);
      }, 100);

      return () => clearTimeout(refreshTimeout);
    }
  }, [viewMode]);

  // Handler for view mode changes with refresh logic
  const handleViewModeChange = (newViewMode: 'map' | 'list') => {
    console.log(`🔄 View mode changing from ${viewMode} to ${newViewMode}`);
    setViewMode(newViewMode);
  };

  // Determine selected types for the map (excluding news)
  const selectedTypesForMap = selectedType === 'all' 
    ? ['event', 'business', 'local-service'] 
    : [selectedType];

  // Create filtered items for map (including all item types)
  const mapItems = filteredItems;

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Tab system for Map/List view */}
      <div className="flex border-b bg-gray-50">
        <button
          onClick={() => handleViewModeChange('map')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-white text-caribbean-teal border-b-2 border-caribbean-teal"
        >
          <Map className="h-4 w-4" />
          Map View {isRefreshingMap && <span className="text-xs">(Refreshing...)</span>}
        </button>
        <button
          onClick={() => handleViewModeChange('list')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <List className="h-4 w-4" />
          List View
        </button>
      </div>
      
      {/* Map view content */}
      <div className="h-[35vh] min-h-[250px] sm:h-[40vh] md:h-[45vh] lg:h-[50vh] xl:h-[55vh] max-h-[630px] w-full relative">
        {isRefreshingMap && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-caribbean-teal"></div>
              <span className="text-sm text-gray-600">Refreshing map...</span>
            </div>
          </div>
        )}
        <EnhancedUniversalMap 
          key={`main-map-${mapRefreshKey}`} // Dynamic key for forced refresh
          items={mapItems}
          height="100%"
          selectedTypes={selectedTypesForMap}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};