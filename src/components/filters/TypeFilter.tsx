
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export const TypeFilter = ({ 
  selectedType, 
  onTypeChange 
}: TypeFilterProps) => {
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'event', label: 'Events' },
    { value: 'business', label: 'Business' },
    { value: 'news', label: 'News' },
    { value: 'local-service', label: 'Local Resources' },
    { value: 'past-event', label: 'Past Events' }
  ];

  return (
    <Select value={selectedType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
        <SelectValue placeholder="Type" />
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
