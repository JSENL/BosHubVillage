import { Event } from '@/hooks/useEvents';

/**
 * Escapes HTML to prevent XSS attacks in popup content
 */
export const escapeHtml = (unsafe: string | null | undefined): string => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatTo12Hour = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
  if (!startTime && !endTime) return 'Time TBD';
  if (startTime && endTime) {
    return `${escapeHtml(formatTo12Hour(startTime))} - ${escapeHtml(formatTo12Hour(endTime))}`;
  }
  return escapeHtml(formatTo12Hour(startTime || endTime));
};

export const createEventPopupContent = (event: Event): string => {
  const safeTitle = escapeHtml(event.title);
  const safeDescription = escapeHtml(event.description?.substring(0, 100));
  const safeLocation = escapeHtml(event.location);
  
  return `
    <div style="padding: 10px; max-width: 200px;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #374151;">${safeTitle}</h3>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7280;">${safeDescription}...</p>
      <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
        <strong>📅 ${new Date(event.date).toLocaleDateString()}</strong>
      </div>
      <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
        <strong>🕒 ${formatTimeRange(event.start_time, event.end_time)}</strong>
      </div>
      <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
        <strong>📍 ${safeLocation}</strong>
      </div>
      <div style="margin: 8px 0 0 0;">
        <button onclick="window.location.href='/event/${escapeHtml(event.id)}'" style="
          background: linear-gradient(to right, #8b5cf6, #3b82f6);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
        ">View Details</button>
      </div>
    </div>
  `;
};
