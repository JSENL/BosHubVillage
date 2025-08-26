
import { UnifiedItem } from '@/types/unifiedItem';

interface TranslationData {
  [key: string]: string;
}

export const createPopupContent = (item: UnifiedItem, translations?: TranslationData): string => {
  // Use translated content if available, fallback to original
  const getTranslated = (field: string) => {
    return translations?.[field] || (item as any)[field] || '';
  };

  const typeLabel = translations ? {
    event: translations['itemTypes.events'] || 'Event',
    news: translations['itemTypes.news'] || 'News', 
    business: translations['itemTypes.businesses'] || 'Business',
    'local-service': translations['itemTypes.localServices'] || 'Local Resource'
  }[item.type] : {
    event: 'Event',
    news: 'News',
    business: 'Business',
    'local-service': 'Local Resource'
  }[item.type];

  const getMarkerColor = (type: string): string => {
    const colors = {
      event: 'hsl(5, 75%, 55%)',          // Warm red from logo
      news: 'hsl(135, 65%, 45%)',         // Forest green from logo
      business: 'hsl(210, 75%, 45%)',     // Vibrant blue from logo
      'local-service': 'hsl(15, 85%, 65%)' // Coral orange from logo
    };
    return colors[type as keyof typeof colors] || 'hsl(220, 15%, 45%)';
  };

  const displayLocation = getTranslated('location') || getTranslated('address') || '';
  const displayDescription = getTranslated('description') || getTranslated('content') || '';
  const displayTitle = getTranslated('title') || getTranslated('name') || '';
  const displayCategory = getTranslated('category') || '';

  return `
    <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="background: ${getMarkerColor(item.type)}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 10px; font-weight: 600;">
        ${typeLabel}
      </div>
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937; line-height: 1.4;">${displayTitle}</h3>
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">${displayDescription.substring(0, 120)}${displayDescription.length > 120 ? '...' : ''}</p>
      
      <div style="space-y: 4px;">
        ${displayLocation ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">📍</span> ${displayLocation}</p>` : ''}
        ${displayCategory ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">🏷️</span> ${displayCategory}</p>` : ''}
        ${item.date ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">📅</span> ${new Date(item.date).toLocaleDateString()}</p>` : ''}
        ${item.price !== undefined ? `<p style="margin: 4px 0; font-size: 12px; color: #8b5cf6; display: flex; align-items: center;"><span style="margin-right: 4px;">💰</span> ${item.price === 0 ? (translations?.['cards.free'] || 'FREE') : `$${item.price}`}</p>` : ''}
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
        ">${translations?.['cards.viewDetails'] || 'View Details'}</button>
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
        ">📍 ${translations?.['common.directions'] || 'Directions'}</button>
        ` : ''}
      </div>
      
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 11px; color: #9ca3af; font-style: italic; text-align: center;">${translations?.['common.clickMarkerHint'] || '💡 Click marker to highlight • Double-click to view details'}</p>
      </div>
    </div>
  `;
};
