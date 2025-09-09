import { SimpleMapbox } from '@/components/SimpleMapbox';
import { UnifiedItem } from '@/types/unifiedItem';

interface MapViewProps {
  items: UnifiedItem[];
  selectedTypes: string[];
  height?: string;
}

export const MapView = ({ items, selectedTypes, height = "540px" }: MapViewProps) => {
  return (
    <div className="relative w-full" style={{ height }}>
      <SimpleMapbox items={items} height={height} />
    </div>
  );
};