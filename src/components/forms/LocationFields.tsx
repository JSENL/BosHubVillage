
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationFieldsProps {
  formData: {
    location: string;
  };
  onInputChange: (field: string, value: string) => void;
  isGeocoding: boolean;
}

const LocationFields = ({ formData, onInputChange, isGeocoding }: LocationFieldsProps) => {
  return (
    <div>
      <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        Location * 
        {isGeocoding && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
      </Label>
      <Input
        id="location"
        placeholder="Enter full address (e.g., 123 Main St, Boston, MA)"
        value={formData.location}
        onChange={(e) => onInputChange('location', e.target.value)}
        className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        disabled={isGeocoding}
      />
      <p className="text-xs text-gray-500 mt-1">
        Address will be automatically converted to map coordinates
      </p>
    </div>
  );
};

export default LocationFields;
