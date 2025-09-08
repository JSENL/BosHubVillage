/**
 * Utility functions for date handling
 */

export const formatEventDate = (date: string): string => {
  const eventDate = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

  if (eventDateOnly.getTime() === today.getTime()) {
    return 'Today';
  } else if (eventDateOnly.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return eventDate.toLocaleDateString();
  }
};

export const isEventToday = (date: string): boolean => {
  const eventDate = new Date(date);
  const today = new Date();
  return eventDate.toDateString() === today.toDateString();
};

export const isEventTomorrow = (date: string): boolean => {
  const eventDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return eventDate.toDateString() === tomorrow.toDateString();
};

export const isPastEvent = (date: string): boolean => {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};

export const formatTimeRange = (startTime?: string, endTime?: string): string => {
  if (!startTime) return '';
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  if (endTime) {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }
  
  return formatTime(startTime);
};