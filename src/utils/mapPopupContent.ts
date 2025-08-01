
import { UnifiedItem } from '@/types/unifiedItem';

export const createPopupContent = (item: UnifiedItem): string => {
  const typeLabel = {
    event: 'Event',
    news: 'News',
    business: 'Business',
    'local-service': 'Local Resource'
  }[item.type];

  const getMarkerColor = (type: string): string => {
    const colors = {
      event: '#dc2626',      // Red
      news: '#2563eb',       // Blue
      business: '#16a34a',   // Green
      'local-service': '#eab308'  // Yellow
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const displayLocation = item.location || item.address || '';
  const displayDescription = item.description || item.content || '';

  return `
    <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="background: ${getMarkerColor(item.type)}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 10px; font-weight: 600;">
        ${typeLabel}
      </div>
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937; line-height: 1.4;">${item.title}</h3>
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">${displayDescription.substring(0, 120)}${displayDescription.length > 120 ? '...' : ''}</p>
      
      <div style="space-y: 4px;">
        ${displayLocation ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">📍</span> ${displayLocation}</p>` : ''}
        ${item.category ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">🏷️</span> ${item.category}</p>` : ''}
        ${item.date ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">📅</span> ${new Date(item.date).toLocaleDateString()}</p>` : ''}
        ${item.price !== undefined ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">💰</span> ${item.price === 0 ? 'FREE' : `$${item.price}`}</p>` : ''}
      </div>
      
      <div style="margin-top: 12px; display: flex; gap: 6px;">
        <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-resource' : item.type}/${item.id}'" style="
          background: linear-gradient(to right, #8b5cf6, #3b82f6);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
          flex: 1;
        ">View Details</button>
        ${item.latitude && item.longitude ? `
        <button onclick="window.dispatchEvent(new CustomEvent('openDirections', { detail: { item: ${JSON.stringify(item).replace(/"/g, '&quot;')} } }))" style="
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
          white-space: nowrap;
        ">📍 Directions</button>
        ` : ''}
      </div>
      
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 11px; color: #9ca3af; font-style: italic; text-align: center;">💡 Click marker to highlight • Double-click to view details</p>
      </div>
    </div>
  `;
};
