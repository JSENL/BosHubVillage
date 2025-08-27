import { useEffect, useRef } from 'react';
import { useContentTranslation } from '@/hooks/useTranslation';

interface UseAutoTranslateParams {
  item: any;
  table: 'events' | 'business' | 'local_resources' | 'news';
  fields: string[];
}

// Triggers background translations for missing fields and caches them via useContentTranslation
export const useAutoTranslate = ({ item, table, fields }: UseAutoTranslateParams) => {
  const { translateContent, currentLanguage } = useContentTranslation();
  const inFlightRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    // Exit early if no item or if English language
    if (!item?.id || currentLanguage === 'en') return;

    const run = async () => {
      for (const field of fields) {
        const translationsField = `${field}_translations` as const;
        const originalText: string = item[field] || '';
        const existing = item[translationsField]?.[currentLanguage];

        // Skip if no original text
        if (!originalText) continue;

        // Detect placeholder or ineffective translations
        const isPlaceholder = typeof existing === 'string' && (
          existing.includes(' - ') && (
            existing.includes('وصف باللغة العربية') ||
            existing.includes('descrizione in italiano') ||
            existing.includes('deskrison na kriolu') ||
            existing.includes('descrição em português') ||
            existing.includes('(Mô tả bằng tiếng Việt)') ||
            existing.includes('(Sự kiện)')
          ) ||
          // Also detect if the translation is exactly the same as the original English text
          existing === originalText ||
          // Or if it contains the original English text as a prefix with placeholder suffix
          (originalText && existing.startsWith(originalText + ' - '))
        );

        const needsTranslation = !existing || isPlaceholder;
        const cacheKey = `${table}-${item.id}-${field}-${currentLanguage}`;
        if (!needsTranslation || inFlightRef.current[cacheKey]) continue;

        try {
          inFlightRef.current[cacheKey] = true;
          await translateContent({ table, id: item.id, field, originalText });
          // Translation is cached in-memory; UI will re-render and pick it up via getTranslatedField
        } catch (e) {
          console.error('Auto-translate failed', { table, id: item.id, field, e });
        } finally {
          inFlightRef.current[cacheKey] = false;
        }
      }
    };

    run();
  }, [item?.id, currentLanguage, table, JSON.stringify(fields)]);
};
