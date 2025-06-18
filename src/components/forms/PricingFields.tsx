
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DollarSign, Users } from 'lucide-react';

interface PricingFieldsProps {
  formData: {
    price: string;
    max_attendees: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PricingFields = ({ formData, onInputChange }: PricingFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          Ticket Price
        </Label>
        <Input
          id="price"
          type="number"
          placeholder="0.00"
          value={formData.price}
          onChange={(e) => onInputChange('price', e.target.value)}
          className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
      </div>

      <div>
        <Label htmlFor="maxAttendees" className="text-sm font-medium text-gray-700 flex items-center">
          <Users className="h-4 w-4 mr-1" />
          Max Attendees
        </Label>
        <Input
          id="maxAttendees"
          type="number"
          placeholder="Unlimited"
          value={formData.max_attendees}
          onChange={(e) => onInputChange('max_attendees', e.target.value)}
          className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
      </div>
    </div>
  );
};

export default PricingFields;
