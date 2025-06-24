
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface DateTimeFilterProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  timeFilter: string;
  onTimeFilterChange: (time: string) => void;
}

export const DateTimeFilter = ({ 
  dateFilter, 
  onDateFilterChange, 
  timeFilter, 
  onTimeFilterChange 
}: DateTimeFilterProps) => {
  const timeFilters = [
    { value: 'all', label: 'Any Time' },
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-12AM)' },
  ];

  return (
    <>
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-yelp-gray" />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="w-36 sm:w-40 h-8 sm:h-10 text-xs sm:text-sm"
          placeholder="Select date"
        />
      </div>

      <Select value={timeFilter} onValueChange={onTimeFilterChange}>
        <SelectTrigger className="w-32 sm:w-44 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          {timeFilters.map((time) => (
            <SelectItem key={time.value} value={time.value}>
              {time.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
