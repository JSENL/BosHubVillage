
import { UnifiedItem } from '@/types/unifiedItem';

export const validateCoordinates = (item: UnifiedItem) => {
  const rawLat = item.latitude;
  const rawLng = item.longitude;
  
  console.log(`📍 Processing item "${item.title}" (${item.type}):`, {
    rawLat,
    rawLng,
    id: item.id,
    address: item.address
  });

  if (rawLat === null || rawLat === undefined || rawLng === null || rawLng === undefined) {
    console.warn(`❌ Missing coordinates for ${item.type} "${item.title}"`);
    return null;
  }

  const lat = Number(rawLat);
  const lng = Number(rawLng);

  if (isNaN(lat) || isNaN(lng)) {
    console.warn(`❌ Invalid coordinates (NaN) for ${item.type} "${item.title}"`);
    return null;
  }

  if (lat === 0 && lng === 0) {
    console.warn(`⚠️ Zero coordinates detected for ${item.type} "${item.title}"`);
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    console.warn(`❌ Coordinates out of valid range for ${item.type} "${item.title}"`);
    return null;
  }

  return { lat, lng };
};

export const getMarkerColor = (type: string): string => {
  switch (type) {
    case 'event': return '#ef4444'; // red
    case 'business': return '#3b82f6'; // blue
    case 'local-service': return '#eab308'; // yellow
    default: return '#6b7280'; // gray
  }
};

export const createPopupContent = (item: UnifiedItem): string => {
  const markerColor = getMarkerColor(item.type);
  
  // Enhanced content based on item type
  let specificContent = '';
  
  if (item.type === 'event') {
    specificContent = `
      ${item.date ? `<p style="margin: 4px 0;"><strong>📅 Date:</strong> ${item.date}</p>` : ''}
      ${item.start_time ? `<p style="margin: 4px 0;"><strong>⏰ Time:</strong> ${item.start_time}${item.end_time ? ` - ${item.end_time}` : ''}</p>` : ''}
      ${item.price && item.price > 0 ? `<p style="margin: 4px 0;"><strong>💰 Price:</strong> $${item.price}</p>` : ''}
    `;
  } else if (item.type === 'business') {
    specificContent = `
      ${item.business_type ? `<p style="margin: 4px 0;"><strong>🏢 Business Type:</strong> ${item.business_type}</p>` : ''}
      ${item.neighborhoods ? `<p style="margin: 4px 0;"><strong>🏘️ Neighborhood:</strong> ${item.neighborhoods}</p>` : ''}
      ${item.villages ? `<p style="margin: 4px 0;"><strong>🏘️ Village:</strong> ${Array.isArray(item.villages) ? item.villages.join(', ') : item.villages}</p>` : ''}
    `;
  } else if (item.type === 'local-service') {
    specificContent = `
      ${item.neighborhoods ? `<p style="margin: 4px 0;"><strong>🏘️ Neighborhood:</strong> ${item.neighborhoods}</p>` : ''}
      ${item.villages ? `<p style="margin: 4px 0;"><strong>🏘️ Village:</strong> ${Array.isArray(item.villages) ? item.villages.join(', ') : item.villages}</p>` : ''}
    `;
  }
  
  return `
    <div style="padding: 16px; max-width: 320px; font-family: system-ui; line-height: 1.4;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${item.title}</h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">${item.description || 'No description available'}</p>
      <div style="font-size: 12px; color: #374151;">
        ${item.address ? `<p style="margin: 4px 0;"><strong>📍 Address:</strong> ${item.address}</p>` : ''}
        ${item.location && item.location !== item.address ? `<p style="margin: 4px 0;"><strong>📍 Location:</strong> ${item.location}</p>` : ''}
        ${item.category ? `<p style="margin: 4px 0;"><strong>🏷️ Category:</strong> ${item.category}</p>` : ''}
        <p style="margin: 4px 0;"><strong>🏷️ Type:</strong> <span style="color: ${markerColor}; font-weight: bold;">${item.type.replace('-', ' ')}</span></p>
        ${specificContent}
      </div>
      <div style="margin-top: 16px;">
        <button onclick="window.location.href='/${item.type === 'local-service' ? 'local-resource' : item.type}/${item.id}'" style="
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
