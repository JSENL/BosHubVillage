import { UnifiedItem } from '@/types/unifiedItem';
import { getMarkerColor } from '@/utils/mapMarkerUtils';
import { escapeHtml } from '@/utils/mapPopupUtils';

/**
 * Creates popup content for multiple items at the same location
 */
export const createMultiItemPopupContent = (items: UnifiedItem[]): string => {
  if (items.length === 1) {
    // Use existing single item popup
    return createSingleItemPopupContent(items[0]);
  }

  const primaryItem = items[0];
  const location = escapeHtml(primaryItem.address || primaryItem.location || 'Location not specified');
  
  // Group items by type
  const itemsByType = items.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, UnifiedItem[]>);

  // Create sections for each type
  const typeSections = Object.entries(itemsByType).map(([type, typeItems]) => {
    const color = getMarkerColor(type);
    const typeLabel = type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const itemsList = typeItems.map(item => {
      let timeInfo = '';
      if (item.type === 'event') {
        const dateStr = item.date ? new Date(item.date).toLocaleDateString() : '';
        const timeStr = item.start_time ? `${item.start_time}${item.end_time ? ` - ${item.end_time}` : ''}` : '';
        timeInfo = `<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">
          ${dateStr ? `📅 ${dateStr}` : ''} ${timeStr ? `⏰ ${timeStr}` : ''}
        </div>`;
      }
      
      return `
        <div style="
          border-left: 3px solid ${color}; 
          padding: 8px 12px; 
          margin: 6px 0; 
          background: #f9fafb; 
          border-radius: 0 6px 6px 0;
          cursor: pointer;
          transition: background 0.2s ease;
        " onclick="window.location.href='/${item.type === 'local-service' ? 'local-resource' : item.type}/${escapeHtml(item.id)}'"
        onmouseover="this.style.background='#f3f4f6'" 
        onmouseout="this.style.background='#f9fafb'">
          <div style="font-weight: 600; color: #374151; font-size: 13px;">${escapeHtml(item.title)}</div>
          ${item.category ? `<div style="font-size: 11px; color: #6b7280;">🏷️ ${escapeHtml(item.category)}</div>` : ''}
          ${timeInfo}
          ${item.price && item.price > 0 ? `<div style="font-size: 11px; color: #059669; font-weight: 600;">💰 $${escapeHtml(String(item.price))}</div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div style="margin-bottom: 16px;">
        <h4 style="
          margin: 0 0 8px 0; 
          font-size: 14px; 
          font-weight: bold; 
          color: ${color};
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span style="
            width: 20px; 
            height: 20px; 
            border-radius: 50%; 
            background: ${color}; 
            color: white; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
          ">${type.charAt(0).toUpperCase()}</span>
          ${typeLabel}s (${typeItems.length})
        </h4>
        ${itemsList}
      </div>
    `;
  }).join('');

  return `
    <div style="padding: 16px; max-width: 360px; font-family: system-ui; line-height: 1.4;">
      <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb;">
        <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
          📍 Multiple Items at This Location
        </h3>
        <p style="margin: 0; font-size: 12px; color: #6b7280;">
          ${location} • ${items.length} items
        </p>
      </div>
      
      <div style="max-height: 300px; overflow-y: auto;">
        ${typeSections}
      </div>
      
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
          Click any item above to view details
        </p>
      </div>
    </div>
  `;
};

/**
 * Creates popup content for a single item (fallback)
 */
const createSingleItemPopupContent = (item: UnifiedItem): string => {
  const markerColor = getMarkerColor(item.type);
  
  let specificContent = '';
  
  if (item.type === 'event') {
    specificContent = `
      ${item.date ? `<p style="margin: 4px 0;"><strong>📅 Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>` : ''}
      ${item.start_time ? `<p style="margin: 4px 0;"><strong>⏰ Time:</strong> ${escapeHtml(item.start_time)}${item.end_time ? ` - ${escapeHtml(item.end_time)}` : ''}</p>` : ''}
      ${item.price && item.price > 0 ? `<p style="margin: 4px 0;"><strong>💰 Price:</strong> $${escapeHtml(String(item.price))}</p>` : ''}
    `;
  } else if (item.type === 'business') {
    specificContent = `
      ${item.business_type ? `<p style="margin: 4px 0;"><strong>🏢 Business Type:</strong> ${escapeHtml(item.business_type)}</p>` : ''}
      ${item.neighborhoods ? `<p style="margin: 4px 0;"><strong>🏘️ Neighborhood:</strong> ${escapeHtml(item.neighborhoods)}</p>` : ''}
    `;
  } else if (item.type === 'local-service') {
    specificContent = `
      ${item.neighborhoods ? `<p style="margin: 4px 0;"><strong>🏘️ Neighborhood:</strong> ${escapeHtml(item.neighborhoods)}</p>` : ''}
    `;
  }
  
  return `
    <div style="padding: 16px; max-width: 320px; font-family: system-ui; line-height: 1.4;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${escapeHtml(item.title)}</h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">${escapeHtml(item.description) || 'No description available'}</p>
      <div style="font-size: 12px; color: #374151;">
        ${item.address ? `<p style="margin: 4px 0;"><strong>📍 Address:</strong> ${escapeHtml(item.address)}</p>` : ''}
        ${item.category ? `<p style="margin: 4px 0;"><strong>🏷️ Category:</strong> ${escapeHtml(item.category)}</p>` : ''}
        <p style="margin: 4px 0;"><strong>🏷️ Type:</strong> <span style="color: ${markerColor}; font-weight: bold;">${item.type.replace('-', ' ')}</span></p>
        ${specificContent}
      </div>
      <div style="margin-top: 16px;">
        <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-resource' : item.type}/${escapeHtml(item.id)}'" style="
          background: linear-gradient(135deg, ${markerColor}cc 0%, ${markerColor} 100%);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
          View Details →
        </button>
      </div>
    </div>
  `;
};