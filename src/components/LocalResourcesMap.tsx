import { UnifiedItem } from '@/types/unifiedItem';
import { LocalResource } from '@/types/localServices';
import { EnhancedUniversalMap } from '@/components/EnhancedUniversalMap';

interface LocalResourcesMapProps {
  localServices: LocalResource[];
}

export const LocalResourcesMap = ({ localServices }: LocalResourcesMapProps) => {
  // Convert local services to unified items for map display
  const unifiedItems: UnifiedItem[] = localServices.map(service => ({
    id: service.id,
    title: service.name,
    description: service.description || '',
    latitude: service.latitude ? Number(service.latitude) : null,
    longitude: service.longitude ? Number(service.longitude) : null,
    type: 'local-service',
    address: service.address,
    category: service.category,
    name: service.name,
    neighborhoods: service.neighborhood,
    villages: service.village,
    originalData: service
  }));

  return (
    <EnhancedUniversalMap 
      items={unifiedItems}
      selectedTypes={['local-service']}
      height="500px"
    />
  );
};