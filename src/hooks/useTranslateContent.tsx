import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface TranslationCache {
  [key: string]: string;
}

export const useTranslateContent = () => {
  const { i18n } = useTranslation();
  const [cache, setCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (text: string): Promise<string> => {
    // If the current language is English, return the original text
    if (i18n.language === 'en' || !text) {
      return text;
    }

    // Create a cache key
    const cacheKey = `${text}-${i18n.language}`;
    
    // Check if translation is already cached
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    try {
      setIsTranslating(true);
      
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: {
          text,
          targetLanguage: i18n.language,
          sourceLanguage: 'en'
        }
      });

      if (error) {
        console.error('Translation error:', error);
        return text; // Return original text on error
      }

      const translatedText = data?.translatedText || text;
      
      // Cache the translation
      setCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));

      return translatedText;
    } catch (error) {
      console.error('Translation service error:', error);
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translateText,
    isTranslating,
    currentLanguage: i18n.language
  };
};