import { useState } from 'react';
import { useLocalServices } from '@/hooks/useLocalServices';
import LocalServiceCard from '@/components/LocalServiceCard';
import { ViewToggle } from '@/components/ViewToggle';
import { LocalResourcesMap } from '@/components/LocalResourcesMap';

export const LocalServicesTab = () => {
  const { data: localServices, isLoading } = useLocalServices();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map' | 'calendar'>('grid');

  console.log('🏪 LocalServicesTab: Rendering with', localServices?.length || 0, 'services');
  console.log('🏪 LocalServicesTab: Services with coordinates:', 
    localServices?.filter(service => service.latitude && service.longitude).length || 0
  );

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading local resources...</p>
      </div>
    );
  }

  if (!localServices || localServices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No local resources found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Local Resources</h2>
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {viewMode === 'map' ? (
        <LocalResourcesMap localServices={localServices} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {localServices.map((service) => (
            <LocalServiceCard key={service.id} localService={service} />
          ))}
        </div>
      )}
    </div>
  );
};