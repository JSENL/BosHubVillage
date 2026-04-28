import { useState } from 'react';
import { uselocalresources } from '@/hooks/uselocalresources';
import LocalServiceCard from '@/components/LocalServiceCard';
import { ViewToggle } from '@/components/ViewToggle';
import { LocalResourcesMap } from '@/components/LocalResourcesMap';

export const localresourcesTab = () => {
  const { data: localresources, isLoading } = uselocalresources();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map' | 'calendar'>('grid');

  console.log('🏪 localresourcesTab: Rendering with', localresources?.length || 0, 'services');
  console.log('🏪 localresourcesTab: Services with coordinates:', 
    localresources?.filter(service => service.latitude && service.longitude).length || 0
  );

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading local resources...</p>
      </div>
    );
  }

  if (!localresources || localresources.length === 0) {
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
        <LocalResourcesMap localresources={localresources} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {localresources.map((service) => (
            <LocalServiceCard key={service.id} localService={service} />
          ))}
        </div>
      )}
    </div>
  );
};