import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type TranslationsObject = Record<string, string>;

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
      if (!originalText) return '';
      
      const currentLang = i18n.language;
      
      // If English or no translations object, return original
      if (currentLang === 'en' || !translations) {
        return originalText;
      }
      
      // Try to get translation for current language
      const translation = translations[currentLang];
      
      if (translation && typeof translation === 'string' && translation.trim() !== '') {
        return translation;
      }
      
      // Fallback to original text
      return originalText;
    };
  }, [i18n.language]);

  return { getTranslatedText, currentLanguage: i18n.language };
};
