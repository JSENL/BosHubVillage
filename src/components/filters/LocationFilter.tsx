
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  // Deduplicate and create unique options
  const uniqueNeighborhoods = [...new Set(availableNeighborhoods)].filter(Boolean);
  const uniqueVillages = [...new Set(availableVillages)].filter(Boolean);

  const neighborhoodOptions = [
    { value: 'all', label: t('location.allNeighborhoods'), uniqueKey: 'neighborhood-all' },
    ...uniqueNeighborhoods.map((neighborhood, index) => ({
      value: neighborhood.toLowerCase().replace(/\s+/g, '-'),
      label: neighborhood,
      uniqueKey: `neighborhood-${index}-${neighborhood.toLowerCase().replace(/\s+/g, '-')}`
    }))
  ];

  const villageOptions = [
    { value: 'all', label: t('location.allVillages'), uniqueKey: 'village-all' },
    ...uniqueVillages.map((village, index) => ({
      value: village.toLowerCase().replace(/\s+/g, '-'),
      label: village,
      uniqueKey: `village-${index}-${village.toLowerCase().replace(/\s+/g, '-')}`
    }))
  ];

  return (
    <>
      <Select value={selectedNeighborhood} onValueChange={onNeighborhoodChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder={t('location.neighborhood')} />
        </SelectTrigger>
        <SelectContent>
          {neighborhoodOptions.map((neighborhood) => (
            <SelectItem 
              key={neighborhood.uniqueKey} 
              value={neighborhood.value}
            >
              {neighborhood.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedVillage} onValueChange={onVillageChange}>
        <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder={t('location.village')} />
        </SelectTrigger>
        <SelectContent>
          {villageOptions.map((village) => (
            <SelectItem 
              key={village.uniqueKey} 
              value={village.value}
            >
              {village.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
