import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, X, CalendarDays, CalendarRange } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { useEventDates } from '@/hooks/useEventDates';

interface EventDateFilterProps {
  eventDateRange?: DateRange;
  onEventDateRangeChange?: (dateRange: DateRange | undefined) => void;
  selectedEventDates?: Date[];
  onSelectedEventDatesChange?: (dates: Date[]) => void;
}

export const EventDateFilter = ({ 
  eventDateRange,
  onEventDateRangeChange,
  selectedEventDates = [],
  onSelectedEventDatesChange
}: EventDateFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'range'>('individual');
  const { eventDates, isLoading } = useEventDates();

  const handleMultipleDateSelect = (date: Date | undefined) => {
    if (!date || !onSelectedEventDatesChange) return;
    
    const dateStr = date.toDateString();
    const isSelected = selectedEventDates.some(d => d.toDateString() === dateStr);
    
    if (isSelected) {
      // Remove date if already selected
      const newDates = selectedEventDates.filter(d => d.toDateString() !== dateStr);
      onSelectedEventDatesChange(newDates);
    } else {
      // Add date if not selected
      onSelectedEventDatesChange([...selectedEventDates, date]);
    }
  };

  const removeDate = (dateToRemove: Date) => {
    if (!onSelectedEventDatesChange) return;
    const newDates = selectedEventDates.filter(d => d.toDateString() !== dateToRemove.toDateString());
    onSelectedEventDatesChange(newDates);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (onEventDateRangeChange) {
      onEventDateRangeChange(range);
    }
  };

  const clearAllDates = () => {
    if (activeTab === 'range' && onEventDateRangeChange) {
      onEventDateRangeChange(undefined);
    } else if (activeTab === 'individual' && onSelectedEventDatesChange) {
      onSelectedEventDatesChange([]);
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
    if (activeTab === 'range') {
      return formatDateRange(eventDateRange);
    } else {
      if (selectedEventDates.length === 0) return 'Pick event dates';
      if (selectedEventDates.length === 1) return formatDateLabel(selectedEventDates[0]);
      return `${selectedEventDates.length} dates selected`;
    }
  };

  // Create modifiers for highlighting event dates
  const eventDateModifiers = {
    hasEvent: eventDates,
    selected: activeTab === 'individual' ? selectedEventDates : undefined,
  };

  const eventDateModifiersStyles = {
    hasEvent: {
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      color: 'hsl(var(--primary))',
      fontWeight: 'bold' as const,
      border: '2px solid hsl(var(--primary) / 0.3)',
    },
    selected: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      fontWeight: 'bold' as const,
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-48 sm:w-56 h-8 sm:h-10 text-xs sm:text-sm justify-start text-left font-normal",
                (selectedEventDates.length === 0 && !eventDateRange?.from) && "text-muted-foreground"
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {isLoading ? 'Loading...' : getButtonText()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'individual' | 'range')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="individual" className="flex items-center gap-2 text-xs">
                    <CalendarDays className="h-3 w-3" />
                    Event Dates
                  </TabsTrigger>
                  <TabsTrigger value="range" className="flex items-center gap-2 text-xs">
                    <CalendarRange className="h-3 w-3" />
                    Date Range
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="individual" className="space-y-3">
                  {selectedEventDates.length > 0 && (
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Selected Event Dates ({selectedEventDates.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedEventDates
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
                  
                  <div className="text-xs text-muted-foreground mb-2">
                    Highlighted dates have events. Click to select.
                  </div>
                  
                  <Calendar
                    mode="single"
                    selected={undefined}
                    onSelect={handleMultipleDateSelect}
                    initialFocus
                    className="pointer-events-auto"
                    modifiers={eventDateModifiers}
                    modifiersStyles={eventDateModifiersStyles}
                    disabled={(date) => !eventDates.some(eventDate => 
                      eventDate.toDateString() === date.toDateString()
                    )}
                  />
                </TabsContent>

                <TabsContent value="range" className="space-y-3">
                  {eventDateRange?.from && (
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Selected Range:
                      </div>
                      <div className="text-sm font-medium">
                        {formatDateRange(eventDateRange)}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mb-2">
                    Select any date range. Events within the range will be shown.
                  </div>
                  
                  <Calendar
                    mode="range"
                    selected={eventDateRange}
                    onSelect={handleDateRangeSelect}
                    initialFocus
                    className="pointer-events-auto"
                    numberOfMonths={2}
                    modifiers={{ hasEvent: eventDates }}
                    modifiersStyles={{
                      hasEvent: {
                        backgroundColor: 'hsl(var(--primary) / 0.1)',
                        color: 'hsl(var(--primary))',
                        fontWeight: 'bold',
                        border: '2px solid hsl(var(--primary) / 0.3)',
                      }
                    }}
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
            </div>
          </PopoverContent>
        </Popover>
        
        {(selectedEventDates.length > 0 || eventDateRange?.from) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllDates}
            className="h-8 px-2 text-xs"
          >
            Clear
          </Button>
        )}
      </div>
      
      {selectedEventDates.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedEventDates
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
          {selectedEventDates.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{selectedEventDates.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {eventDateRange?.from && (
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="outline" className="text-xs px-2 py-1">
            {formatDateRange(eventDateRange)}
          </Badge>
        </div>
      )}
    </div>
  );
};