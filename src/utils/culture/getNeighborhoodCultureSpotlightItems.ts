import type { UnifiedItem } from '@/types/unifiedItem';
import { CULTURE_SPOTLIGHT_MAX_ITEMS } from '@/constants/cultureSpotlight';

/**
 * Newest-first published culture (news) rows for the home spotlight.
 * Same ordering as elsewhere; length capped at {@link CULTURE_SPOTLIGHT_MAX_ITEMS}.
 * Underlying `items` should match admin published list when fed from the shared `['news']` query.
 */
export function getNeighborhoodCultureSpotlightItems(
  items: UnifiedItem[],
  max: number = CULTURE_SPOTLIGHT_MAX_ITEMS,
): UnifiedItem[] {
  return items
    .filter((i): i is UnifiedItem & { type: 'news' } => i.type === 'news')
    .sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return tb - ta;
    })
    .slice(0, max);
}
