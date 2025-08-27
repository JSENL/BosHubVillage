import { useState, useEffect } from 'react';
import { useTranslation as useI18n } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface TranslateContentParams {
  table: 'events' | 'business' | 'local_resources' | 'news';
  id: string;
  field: string;
  originalText: string;
}

export const useContentTranslation = () => {
  const { i18n } = useI18n();
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const translateContent = async ({ table, id, field, originalText }: TranslateContentParams): Promise<string> => {
    const currentLanguage = i18n.language;
    
    // Return original text for English or if no translation needed
    if (currentLanguage === 'en' || !originalText) {
      return originalText;
    }

    // Check cache first
    const cacheKey = `${table}-${id}-${field}-${currentLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      setLoading(true);
      
      // Call the translation edge function
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: {
          table,
          id,
          field,
          targetLanguage: currentLanguage
        }
      });

      if (error) {
        console.error('Translation error:', error);
        return originalText; // Fallback to original text
      }

      if (data?.success && data?.translation) {
        // Cache the translation
        setTranslationCache(prev => ({
          ...prev,
          [cacheKey]: data.translation
        }));
        return data.translation;
      }

      return originalText;
    } catch (error) {
      console.error('Translation failed:', error);
      return originalText; // Fallback to original text
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedField = (
    item: any,
    fieldName: string,
    table: 'events' | 'business' | 'local_resources' | 'news'
  ): string => {
    const currentLanguage = i18n.language;
    
    // Return original for English
    if (currentLanguage === 'en') {
      return item[fieldName] || '';
    }

    // Check if translations exist in the database record
    const translationsField = `${fieldName}_translations`;
    const translations = item[translationsField];
    
    if (translations && translations[currentLanguage]) {
      const translation = translations[currentLanguage];
      
      // Check if translation is just the same as English (fallback case)
      // or if it contains placeholder text
      const originalText = item[fieldName] || '';
      const isPlaceholderText = translation.includes(' - ') && (
        translation.includes('وصف باللغة العربية') ||
        translation.includes('descrizione in italiano') ||
        translation.includes('deskrison na kriolu') ||
        translation.includes('descrição em português') ||
        translation.includes('(Mô tả bằng tiếng Việt)') ||
        translation.includes('(Sự kiện)')
      );
      
      // If it's placeholder text or exactly the same as English, fall back to original
      if (isPlaceholderText || (translation === originalText && currentLanguage !== 'en')) {
        return originalText;
      }
      
      return translation;
    }

    // Return original text as fallback
    return item[fieldName] || '';
  };

  // Clear cache when language changes
  useEffect(() => {
    setTranslationCache({});
  }, [i18n.language]);

  return {
    translateContent,
    getTranslatedField,
    translationLoading: loading,
    currentLanguage: i18n.language
  };
};