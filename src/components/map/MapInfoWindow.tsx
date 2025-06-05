
import { Event } from '@/hooks/useEvents';

interface MapInfoWindowProps {
  event: Event;
}

export const createInfoWindowContent = (event: Event): string => {
  return `
    <div style="padding: 10px; max-width: 200px;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #374151;">${event.title}</h3>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7280;">${event.description.substring(0, 100)}...</p>
      <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
        <strong>📅 ${new Date(event.date).toLocaleDateString()}</strong>
      </div>
      <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
        <strong>🕒 ${event.time}</strong>
      </div>
      <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
        <strong>📍 ${event.location}</strong>
      </div>
      <div style="margin: 8px 0 0 0;">
        <button onclick="window.location.href='/event/${event.id}'" style="
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
