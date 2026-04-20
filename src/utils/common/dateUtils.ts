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

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Extract `YYYY-MM-DD` from date-like values without timezone shifting.
 * Useful for DB DATE columns and ISO timestamps where the calendar day matters.
 */
export const extractDateOnly = (value: string): string | null => {
  const raw = value?.trim();
  if (!raw) return null;

  const direct = DATE_ONLY_RE.exec(raw);
  if (direct) return direct[0];

  const isoPrefix = raw.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoPrefix) return isoPrefix[1];

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

/**
 * Formats a date-like value as a calendar date (month/day/year) while keeping
 * the original calendar day stable across timezones.
 */
export const formatDateOnly = (
  value: string,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateOnly = extractDateOnly(value);
  if (!dateOnly) return value;

  const [y, m, d] = dateOnly.split("-").map(Number);
  const utcDate = new Date(Date.UTC(y, m - 1, d));
  return utcDate.toLocaleDateString(locale, {
    timeZone: "UTC",
    ...options,
  });
};

/**
 * Stable numeric key for sorting calendar-date values.
 */
export const dateOnlySortKey = (value: string): number => {
  const dateOnly = extractDateOnly(value);
  if (!dateOnly) return Number.NaN;
  const [y, m, d] = dateOnly.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
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