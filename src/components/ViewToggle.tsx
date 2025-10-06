
import { useTranslation } from 'react-i18next';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Grid3X3, 
  List, 
  MapPin, 
  Calendar as CalendarIcon,
} from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list' | 'map' | 'calendar';
  onViewModeChange: (mode: 'grid' | 'list' | 'map' | 'calendar') => void;
}

export const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center sm:justify-end" data-tour="view-toggle">
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => value && onViewModeChange(value as any)}
        className="bg-gray-100 p-1 rounded-lg"
      >
        <ToggleGroupItem 
          value="grid" 
          aria-label="Grid view" 
          className="data-[state=on]:bg-white data-[state=on]:yelp-shadow h-8 w-8 sm:h-10 sm:w-10"
        >
          <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="list" 
          aria-label="List view" 
          className="data-[state=on]:bg-white data-[state=on]:yelp-shadow h-8 w-8 sm:h-10 sm:w-10"
        >
          <List className="h-3 w-3 sm:h-4 sm:w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="map" 
          aria-label="Map view" 
          className="data-[state=on]:bg-white data-[state=on]:yelp-shadow h-8 w-8 sm:h-10 sm:w-10"
        >
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="calendar" 
          aria-label="Calendar view" 
          className="data-[state=on]:bg-white data-[state=on]:yelp-shadow h-8 w-8 sm:h-10 sm:w-10"
        >
          <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
