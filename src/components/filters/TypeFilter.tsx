
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export const TypeFilter = ({ 
  selectedType, 
  onTypeChange 
}: TypeFilterProps) => {
  const { t } = useTranslation();
  const typeOptions = [
    { value: 'all', label: t('types.all') },
    { value: 'event', label: t('types.event') },
    { value: 'business', label: t('types.business') },
    { value: 'news', label: t('types.news') },
    { value: 'local-service', label: t('types.localService') }
  ];

  return (
    <Select value={selectedType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
        <SelectValue placeholder={t('filters.type')} />
      </SelectTrigger>
      <SelectContent>
        {typeOptions.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
