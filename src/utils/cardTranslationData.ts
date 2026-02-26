import type { UnifiedItem } from '@/types/unifiedItem';

/**
 * Merges the unified item's translation fields onto originalData so cards
 * always receive translation objects (from the normalized fetch), ensuring
 * title, description, and other content translate when the user changes language.
 * Prefers item-level translations (normalized in fetchUnifiedData), falls back to originalData.
 */
function mergeTranslations<T extends Record<string, unknown>>(
  original: T | undefined,
  item: UnifiedItem
): T {
  const base = (original ?? {}) as T;
  const o = original as Record<string, unknown> | undefined;
  const translations = {
    title_translations: item.title_translations ?? o?.title_translations,
    description_translations: item.description_translations ?? o?.description_translations,
    location_translations: item.location_translations ?? o?.location_translations,
    address_translations: item.address_translations ?? o?.address_translations,
    category_translations: item.category_translations ?? o?.category_translations,
    content_translations: item.content_translations ?? o?.content_translations,
    name_translations: item.name_translations ?? o?.name_translations,
    short_description_translations: item.short_description_translations ?? o?.short_description_translations,
  };
  const defined = Object.fromEntries(
    Object.entries(translations).filter(
      ([, v]) => v != null && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0
    )
  );
  return { ...base, ...defined } as T;
}

export function getEventCardData(item: UnifiedItem) {
  return mergeTranslations(item.originalData, item);
}

export function getNewsCardData(item: UnifiedItem) {
  return mergeTranslations(item.originalData, item);
}

export function getBusinessCardData(item: UnifiedItem) {
  return mergeTranslations(item.originalData, item);
}

export function getLocalServiceCardData(item: UnifiedItem) {
  return mergeTranslations(item.originalData, item);
}
