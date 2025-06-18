
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Repeat } from 'lucide-react';

interface RecurringEventFieldsProps {
  formData: {
    is_recurring: boolean;
    recurring_pattern: string;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

const RecurringEventFields = ({ formData, onInputChange }: RecurringEventFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="recurring"
          checked={formData.is_recurring}
          onCheckedChange={(checked) => onInputChange('is_recurring', checked)}
        />
        <Label htmlFor="recurring" className="flex items-center text-sm font-medium text-gray-700">
          <Repeat className="h-4 w-4 mr-1" />
          Recurring Event
        </Label>
      </div>

      {formData.is_recurring && (
        <Select value={formData.recurring_pattern} onValueChange={(value) => onInputChange('recurring_pattern', value)}>
          <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
            <SelectValue placeholder="Select recurring pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default RecurringEventFields;
