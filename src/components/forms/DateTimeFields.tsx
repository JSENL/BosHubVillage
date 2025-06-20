
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Clock } from 'lucide-react';

interface DateTimeFieldsProps {
  formData: {
    date: string;
    start_time: string;
    end_time: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const DateTimeFields = ({ formData, onInputChange }: DateTimeFieldsProps) => {
  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time" className="text-sm font-medium text-gray-700 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Start Time
          </Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => onInputChange('start_time', e.target.value)}
            className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>

        <div>
          <Label htmlFor="end_time" className="text-sm font-medium text-gray-700 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            End Time
          </Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => onInputChange('end_time', e.target.value)}
            className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimeFields;
