import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { getMarkerColor } from '@/utils/mapMarkerUtils';

export const createPopupContent = (item: UnifiedItem): string => {
  return `
    <div style="padding: 12px; max-width: 250px; font-family: system-ui;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
        ${item.title}
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">
        ${item.description.substring(0, 120)}${item.description.length > 120 ? '...' : ''}
      </p>
      <div style="margin-bottom: 8px; font-size: 12px; color: ${getMarkerColor(item.type)};">
        <strong>${item.type.toUpperCase()}</strong>
      </div>
      ${item.address ? `
        <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">
          📍 ${item.address}
        </div>
      ` : ''}
      ${item.date ? `
        <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">
          📅 ${new Date(item.date).toLocaleDateString()}
        </div>
      ` : ''}
      <div style="margin-top: 12px;">
        <button 
          onclick="window.location.href='/${item.type}/${item.id}'" 
          style="
            background: ${getMarkerColor(item.type)};
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 500;
          "
        >
          View Details
        </button>
      </div>
    </div>
  `;
};

export const createPopup = (item: UnifiedItem): mapboxgl.Popup => {
  return new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false,
    maxWidth: '300px'
  })
  .setLngLat([item.longitude!, item.latitude!])
  .setHTML(createPopupContent(item));
};