import React from 'react';
import { Calendar, CalendarPlus, Download, Smartphone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CalendarShareProps {
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  location?: string;
}

export const CalendarShare: React.FC<CalendarShareProps> = ({
  title,
  description,
  startDate,
  endDate,
  startTime,
  endTime,
  location = ''
}) => {
  // Format dates for calendar URLs
  const formatDateForCalendar = (date: string, time?: string) => {
    const dateObj = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(':');
      dateObj.setHours(parseInt(hours), parseInt(minutes));
    }
    return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startDateTime = formatDateForCalendar(startDate, startTime);
  const endDateTime = endDate 
    ? formatDateForCalendar(endDate, endTime) 
    : formatDateForCalendar(startDate, endTime || (startTime ? addHours(startTime, 2) : '23:59'));

  // Helper function to add hours to time
  function addHours(time: string, hours: number): string {
    const [h, m] = time.split(':').map(Number);
    const newHours = (h + hours) % 24;
    return `${newHours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  // Encode text for URLs
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedLocation = encodeURIComponent(location);

  // Calendar URLs
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startDateTime}/${endDateTime}&details=${encodedDescription}&location=${encodedLocation}`;
  
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodedTitle}&startdt=${startDateTime}&enddt=${endDateTime}&body=${encodedDescription}&location=${encodedLocation}`;
  
  const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodedTitle}&st=${startDateTime}&et=${endDateTime}&desc=${encodedDescription}&in_loc=${encodedLocation}`;

  // Generate ICS file content
  const generateICSContent = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Event Calendar//Event//EN',
      'BEGIN:VEVENT',
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `UID:${Date.now()}@eventcalendar.com`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  };

  const downloadICS = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openCalendar = (platform: string) => {
    switch (platform) {
      case 'google':
        window.open(googleCalendarUrl, '_blank');
        break;
      case 'outlook':
        window.open(outlookUrl, '_blank');
        break;
      case 'yahoo':
        window.open(yahooUrl, '_blank');
        break;
      case 'apple':
        downloadICS(); // Apple Calendar uses ICS files
        break;
      case 'download':
        downloadICS();
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="border-caribbean-teal text-caribbean-teal hover:bg-caribbean-teal/10">
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => openCalendar('google')}>
          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openCalendar('apple')}>
          <Smartphone className="h-4 w-4 mr-2 text-gray-800" />
          iPhone/Apple Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openCalendar('outlook')}>
          <Mail className="h-4 w-4 mr-2 text-blue-700" />
          Outlook Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openCalendar('yahoo')}>
          <Calendar className="h-4 w-4 mr-2 text-caribbean-teal" />
          Yahoo Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openCalendar('download')}>
          <Download className="h-4 w-4 mr-2 text-green-600" />
          Download (.ics file)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};