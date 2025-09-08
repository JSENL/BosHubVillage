import { UnifiedItem } from '@/types/unifiedItem';

/**
 * Type-specific utility functions
 */

export const getItemTypeIcon = (type: string) => {
  switch (type) {
    case 'event':
      return 'calendar';
    case 'business':
      return 'building';
    case 'local-service':
      return 'wrench';
    case 'news':
      return 'newspaper';
    default:
      return 'map-pin';
  }
};

export const getItemTypeColor = (type: string) => {
  switch (type) {
    case 'event':
      return '#3B82F6'; // blue
    case 'business':
      return '#10B981'; // emerald
    case 'local-service':
      return '#F59E0B'; // amber
    case 'news':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
};

export const getItemTypeBadgeVariant = (type: string) => {
  switch (type) {
    case 'event':
      return 'default';
    case 'business':
      return 'secondary';
    case 'local-service':
      return 'outline';
    case 'news':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const getItemDisplayTitle = (item: UnifiedItem) => {
  return item.title || item.name || 'Untitled';
};

export const getItemDisplayDescription = (item: UnifiedItem) => {
  if (item.type === 'news') {
    return item.content || item.description || '';
  }
  return item.description || '';
};

export const getItemDisplayLocation = (item: UnifiedItem) => {
  return item.address || item.location || '';
};