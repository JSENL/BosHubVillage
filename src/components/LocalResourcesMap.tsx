import { UnifiedItem } from '@/types/unifiedItem';
import { LocalResource } from '@/types/localresources';
import { EnhancedUniversalMap } from '@/components/EnhancedUniversalMap';

interface LocalResourcesMapProps {
  localresources: LocalResource[];
}

export const LocalResourcesMap = ({ localresources }: LocalResourcesMapProps) => {
  console.log('🏪 LocalResourcesMap: Starting with', localresources.length, 'local resources');
  
  // Convert local resources to unified items for map display
  const unifiedItems: UnifiedItem[] = localresources.map(service => {
    const item: UnifiedItem = {
      id: service.id,
      title: service.name,
      description: service.description || '',
      latitude: service.latitude ? Number(service.latitude) : null,
      longitude: service.longitude ? Number(service.longitude) : null,
      type: 'local-service' as const,
      address: service.address,
      category: service.category,
      name: service.name,
      neighborhoods: service.neighborhood,
      villages: service.village,
      originalData: service
    };
    
    console.log(`🏪 Converting local resource "${service.name}" to unified item:`, {
      id: service.id,
      rawLat: service.latitude,
      rawLng: service.longitude,
      convertedLat: item.latitude,
      convertedLng: item.longitude,
      hasCoords: item.latitude !== null && item.longitude !== null
    });
    
    return item;
  });

  console.log('🏪 LocalResourcesMap: Created', unifiedItems.length, 'unified items');
  console.log('🏪 LocalResourcesMap: Items with coordinates:', 
    unifiedItems.filter(item => item.latitude !== null && item.longitude !== null).length
  );

  return (
    <EnhancedUniversalMap 
      items={unifiedItems}
      selectedTypes={['local-service']}
      height="500px"
    />
  );
};