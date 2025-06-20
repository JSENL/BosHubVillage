
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Clock } from 'lucide-react';

interface DateTimeFieldsProps {
  formData: {
    date: string;
    time: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const DateTimeFields = ({ formData, onInputChange }: DateTimeFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Date *
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onInputChange('date', e.target.value)}
          className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
      </div>

      <div>
        <Label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Time
        </Label>
        <Input
          id="time"
          type="time"
          value={formData.time}
          onChange={(e) => onInputChange('time', e.target.value)}
          className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
      </div>
    </div>
  );
};

export default DateTimeFields;
