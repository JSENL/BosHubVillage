import { UnifiedItem } from '@/types/unifiedItem';

/**
 * Selects up to 10 items for Quick Browse, prioritizing:
 * 1. Sponsored items
 * 2. Upcoming events (soonest first)
 * 3. Everything else
 */
export const getQuickBrowseItems = (items: UnifiedItem[], maxItems = 10): UnifiedItem[] => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const scored = items.map(item => {
    let priority = 2; // default

    if (item.is_sponsored) {
      priority = 0; // highest
    } else if (item.type === 'event' && item.date) {
      const eventDate = new Date(item.date);
      if (eventDate >= now) {
        priority = 1; // upcoming events
      }
    }

    // For upcoming events, use date as tiebreaker (sooner = better)
    const dateSortValue = item.date ? new Date(item.date).getTime() : Infinity;

    return { item, priority, dateSortValue };
  });

  scored.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    // Within same priority, upcoming events sorted soonest first
    if (a.priority === 1) return a.dateSortValue - b.dateSortValue;
    return 0;
  });

  return scored.slice(0, maxItems).map(s => s.item);
};
