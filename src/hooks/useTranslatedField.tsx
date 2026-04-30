import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type TranslationsObject = Record<string, string>;

function translationLookupKeys(language: string | undefined): string[] {
  if (!language || language.trim() === '') return ['en'];
  const norm = language.trim();
  const base = norm.split('-')[0];
  const lower = norm.toLowerCase();
  const baseLower = base.toLowerCase();
  return Array.from(new Set([norm, lower, base, baseLower].filter(Boolean)));
}

function pickTranslation(
  translations: TranslationsObject,
  language: string | undefined,
): string | undefined {
  for (const key of translationLookupKeys(language)) {
    const hit = translations[key];
    if (typeof hit === 'string' && hit.trim() !== '') return hit;
  }
  return undefined;
}

/**
 * Hook to get translated content from database translation fields
 * Falls back to original text if translation is not available
 */
export const useTranslatedField = () => {
  const { i18n } = useTranslation();
  
  const getTranslatedText = useMemo(() => {
    return (
      originalText: string | null | undefined,
      translations: TranslationsObject | null | undefined
    ): string => {
      if (originalText == null || originalText === '') return '';

      const map =
        translations && typeof translations === 'object' && !Array.isArray(translations)
          ? (translations as TranslationsObject)
          : undefined;

      const base = (i18n.language || 'en').split('-')[0].toLowerCase();
      if (base === 'en' || !map || Object.keys(map).length === 0) {
        return String(originalText);
      }

      const translated = pickTranslation(map, i18n.language);
      return translated ?? String(originalText);
    };
  }, [i18n.language]);

  return { getTranslatedText, currentLanguage: i18n.language };
};
