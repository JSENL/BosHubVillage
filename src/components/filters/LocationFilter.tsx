
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationFilterProps {
  selectedNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  availableNeighborhoods: string[];
  availableVillages: string[];
}

export const LocationFilter = ({ 
  selectedNeighborhood,
  onNeighborhoodChange,
  selectedVillage,
  onVillageChange,
  availableNeighborhoods,
  availableVillages
}: LocationFilterProps) => {
  const neighborhoodOptions = [
    { value: 'all', label: 'All Neighborhoods' },
    ...availableNeighborhoods.map(neighborhood => ({
      value: neighborhood.toLowerCase().replace(/\s+/g, '-'),
      label: neighborhood
    }))
  ];

  const villageOptions = [
    { value: 'all', label: 'All Villages' },
    ...availableVillages.map(village => ({
      value: village.toLowerCase().replace(/\s+/g, '-'),
      label: village
    }))
  ];

  return (
    <>
      <Select value={selectedNeighborhood} onValueChange={onNeighborhoodChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Neighborhood" />
        </SelectTrigger>
        <SelectContent>
          {neighborhoodOptions.map((neighborhood) => (
            <SelectItem key={neighborhood.value} value={neighborhood.value}>
              {neighborhood.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedVillage} onValueChange={onVillageChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Village" />
        </SelectTrigger>
        <SelectContent>
          {villageOptions.map((village) => (
            <SelectItem key={village.value} value={village.value}>
              {village.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
