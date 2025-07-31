
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, X, CalendarDays, CalendarRange } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface DateTimeFilterProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  timeFilter: string;
  onTimeFilterChange: (time: string) => void;
  selectedDates?: Date[];
  onSelectedDatesChange?: (dates: Date[]) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export const DateTimeFilter = ({ 
  dateFilter, 
  onDateFilterChange, 
  timeFilter, 
  onTimeFilterChange,
  selectedDates = [],
  onSelectedDatesChange,
  dateRange,
  onDateRangeChange
}: DateTimeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'range'>('individual');
  
  const useMultipleMode = onSelectedDatesChange !== undefined;
  const useRangeMode = onDateRangeChange !== undefined;
  const hasAdvancedMode = useMultipleMode || useRangeMode;
  const timeFilters = [
    { value: 'all', label: 'Any Time' },
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-12AM)' },
  ];

  // Handle both single date (legacy) and multiple dates
  const selectedDate = dateFilter ? new Date(dateFilter) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      onDateFilterChange(formattedDate);
    } else {
      onDateFilterChange('');
    }
  };

  const handleMultipleDateSelect = (date: Date | undefined) => {
    if (!date || !onSelectedDatesChange) return;
    
    const dateStr = date.toDateString();
    const isSelected = selectedDates.some(d => d.toDateString() === dateStr);
    
    if (isSelected) {
      // Remove date if already selected
      const newDates = selectedDates.filter(d => d.toDateString() !== dateStr);
      onSelectedDatesChange(newDates);
    } else {
      // Add date if not selected
      onSelectedDatesChange([...selectedDates, date]);
    }
  };

  const removeDate = (dateToRemove: Date) => {
    if (!onSelectedDatesChange) return;
    const newDates = selectedDates.filter(d => d.toDateString() !== dateToRemove.toDateString());
    onSelectedDatesChange(newDates);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  const clearAllDates = () => {
    if (useMultipleMode && onSelectedDatesChange) {
      onSelectedDatesChange([]);
    } else if (useRangeMode && onDateRangeChange) {
      onDateRangeChange(undefined);
    } else {
      handleDateSelect(undefined);
    }
  };

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd');
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Pick date range";
    if (!range.to) return format(range.from, "MMM dd, yyyy");
    return `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd, yyyy")}`;
  };

  const getButtonText = () => {
    if (hasAdvancedMode) {
      if (activeTab === 'range' && useRangeMode) {
        return formatDateRange(dateRange);
      } else if (activeTab === 'individual' && useMultipleMode) {
        if (selectedDates.length === 0) return 'Pick dates';
        if (selectedDates.length === 1) return formatDateLabel(selectedDates[0]);
        return `${selectedDates.length} dates selected`;
      }
      return 'Pick dates';
    } else if (useMultipleMode) {
      if (selectedDates.length === 0) return 'Pick dates';
      if (selectedDates.length === 1) return formatDateLabel(selectedDates[0]);
      return `${selectedDates.length} dates selected`;
    } else {
      return selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Pick a date";
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
              className={cn(
                "w-48 sm:w-56 h-8 sm:h-10 text-xs sm:text-sm justify-start text-left font-normal",
                (!selectedDate && selectedDates.length === 0 && !dateRange?.from) && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getButtonText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3">
                {hasAdvancedMode ? (
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'individual' | 'range')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-3">
                      <TabsTrigger value="individual" className="flex items-center gap-2 text-xs">
                        <CalendarDays className="h-3 w-3" />
                        Individual Dates
                      </TabsTrigger>
                      <TabsTrigger value="range" className="flex items-center gap-2 text-xs">
                        <CalendarRange className="h-3 w-3" />
                        Date Range
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="individual" className="space-y-3">
                      {selectedDates.length > 0 && (
                        <div className="p-2 bg-muted rounded-md">
                          <div className="text-xs font-medium text-muted-foreground mb-2">
                            Selected Dates ({selectedDates.length}):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedDates
                              .sort((a, b) => a.getTime() - b.getTime())
                              .map((date) => (
                              <Badge
                                key={date.toDateString()}
                                variant="secondary"
                                className="text-xs px-2 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeDate(date)}
                              >
                                {formatDateLabel(date)}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Calendar
                        mode="single"
                        selected={undefined}
                        onSelect={handleMultipleDateSelect}
                        initialFocus
                        className="pointer-events-auto"
                        modifiers={{
                          selected: selectedDates,
                        }}
                        modifiersStyles={{
                          selected: {
                            backgroundColor: 'hsl(var(--primary))',
                            color: 'hsl(var(--primary-foreground))',
                            fontWeight: 'bold'
                          }
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="range" className="space-y-3">
                      {dateRange?.from && (
                        <div className="p-2 bg-muted rounded-md">
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Selected Range:
                          </div>
                          <div className="text-sm font-medium">
                            {formatDateRange(dateRange)}
                          </div>
                        </div>
                      )}
                      
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={handleDateRangeSelect}
                        initialFocus
                        className="pointer-events-auto"
                        numberOfMonths={2}
                      />
                    </TabsContent>

                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllDates}
                        className="flex-1 text-xs"
                      >
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-xs"
                      >
                        Done
                      </Button>
                    </div>
                  </Tabs>
                ) : useMultipleMode ? (
                  <>
                    {selectedDates.length > 0 && (
                      <div className="mb-3 p-2 bg-muted rounded-md">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Selected Dates ({selectedDates.length}):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedDates
                            .sort((a, b) => a.getTime() - b.getTime())
                            .map((date) => (
                            <Badge
                              key={date.toDateString()}
                              variant="secondary"
                              className="text-xs px-2 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeDate(date)}
                            >
                              {formatDateLabel(date)}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Calendar
                      mode="single"
                      selected={undefined}
                      onSelect={handleMultipleDateSelect}
                      initialFocus
                      className="pointer-events-auto"
                      modifiers={{
                        selected: selectedDates,
                      }}
                      modifiersStyles={{
                        selected: {
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                    
                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllDates}
                        className="flex-1 text-xs"
                      >
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-xs"
                      >
                        Done
                      </Button>
                    </div>
                  </>
                ) : (
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {(selectedDate || selectedDates.length > 0 || dateRange?.from) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllDates}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
        )}
        
        {(useRangeMode && dateRange?.from && !useMultipleMode) && (
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="outline" className="text-xs px-2 py-1">
              {formatDateRange(dateRange)}
            </Badge>
          </div>
        )}
        </div>
        
        {(useMultipleMode && selectedDates.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedDates
              .sort((a, b) => a.getTime() - b.getTime())
              .slice(0, 3)
              .map((date) => (
              <Badge
                key={date.toDateString()}
                variant="outline"
                className="text-xs px-2 py-1 cursor-pointer hover:bg-muted"
                onClick={() => removeDate(date)}
              >
                {formatDateLabel(date)}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedDates.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{selectedDates.length - 3} more
              </Badge>
            )}
          </div>
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
