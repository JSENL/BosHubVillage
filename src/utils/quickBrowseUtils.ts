import { UnifiedItem } from '@/types/unifiedItem';

export type QuickBrowseId = { type: UnifiedItem['type']; id: string };

/**
 * If adminSelectedIds is provided, returns only those items (in order), max 10.
 * Otherwise falls back to priority-based selection (sponsored, upcoming events, etc.).
 */
export const getQuickBrowseItems = (
  items: UnifiedItem[],
  maxItems = 10,
  adminSelectedIds?: QuickBrowseId[]
): UnifiedItem[] => {
  if (adminSelectedIds && adminSelectedIds.length > 0) {
    const idSet = new Set(items.map(i => `${i.type}:${i.id}`));
    const result: UnifiedItem[] = [];
    for (const { type, id } of adminSelectedIds.slice(0, maxItems)) {
      const key = `${type}:${id}`;
      if (idSet.has(key)) {
        const item = items.find(i => i.type === type && i.id === id);
        if (item) result.push(item);
      }
    }
    return result;
  }

  // Fallback: priority-based selection
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const scored = items.map(item => {
    let priority = 2;
    if (item.is_sponsored) priority = 0;
    else if (item.type === 'event' && item.date) {
      const eventDate = new Date(item.date);
      if (eventDate >= now) priority = 1;
    }
    const dateSortValue = item.date ? new Date(item.date).getTime() : Infinity;
    return { item, priority, dateSortValue };
  });

  scored.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.priority === 1) return a.dateSortValue - b.dateSortValue;
    return 0;
  });

  return scored.slice(0, maxItems).map(s => s.item);
};
