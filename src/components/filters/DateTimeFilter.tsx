
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface DateTimeFilterProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  timeFilter: string;
  onTimeFilterChange: (time: string) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export const DateTimeFilter = ({ 
  dateFilter, 
  onDateFilterChange, 
  timeFilter, 
  onTimeFilterChange,
  dateRange,
  onDateRangeChange
}: DateTimeFilterProps) => {
  const timeFilters = [
    { value: 'all', label: 'Any Time' },
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-12AM)' },
  ];

  // Handle both single date (legacy) and date range
  const selectedDate = dateFilter ? new Date(dateFilter) : undefined;
  const useRangeMode = onDateRangeChange !== undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      onDateFilterChange(formattedDate);
    } else {
      onDateFilterChange('');
    }
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Pick date range";
    if (!range.to) return format(range.from, "MMM dd, yyyy");
    return `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd, yyyy")}`;
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-44 sm:w-52 h-8 sm:h-10 text-xs sm:text-sm justify-start text-left font-normal",
                (!selectedDate && !dateRange?.from) && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {useRangeMode 
                ? formatDateRange(dateRange)
                : (selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Pick a date")
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {useRangeMode ? (
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                numberOfMonths={2}
              />
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            )}
          </PopoverContent>
        </Popover>
        
        {(selectedDate || dateRange?.from) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (useRangeMode) {
                handleDateRangeSelect(undefined);
              } else {
                handleDateSelect(undefined);
              }
            }}
            className="h-8 px-2 text-xs"
          >
            Clear
          </Button>
        )}
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
