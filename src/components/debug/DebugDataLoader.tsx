import { useDataLoader } from '@/hooks/data/useDataLoader';
import { useMapboxToken } from '@/contexts/MapboxContext';

export const DebugDataLoader = () => {
  const { allItems, isLoading, rawData } = useDataLoader();
  const { mapboxToken, isLoadingApiKey, error } = useMapboxToken();

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50 opacity-90">
      <h3 className="font-bold mb-2">Debug Info</h3>
      
      {/* Data Status */}
      <div className="mb-2">
        <strong>Data Status:</strong>
        <div>• Total Items: {allItems.length}</div>
        <div>• Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>• Events: {rawData.events.length}</div>
        <div>• News: {rawData.news.length}</div>
        <div>• Businesses: {rawData.businesses.length}</div>
        <div>• Local Services: {rawData.localServices.length}</div>
      </div>

      {/* Mapbox Status */}
      <div className="mb-2">
        <strong>Mapbox Status:</strong>
        <div>• Token: {mapboxToken ? 'Available' : 'Missing'}</div>
        <div>• Loading API Key: {isLoadingApiKey ? 'Yes' : 'No'}</div>
        <div>• Error: {error || 'None'}</div>
      </div>

      {/* Sample Items */}
      {allItems.length > 0 && (
        <div>
          <strong>Sample Items:</strong>
          {allItems.slice(0, 3).map((item, idx) => (
            <div key={idx}>• {item.type}: {item.title}</div>
          ))}
        </div>
      )}
    </div>
  );
};