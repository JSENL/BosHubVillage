import { useState, useEffect } from 'react';
import { useTranslateContent } from '@/hooks/useTranslateContent';

interface TranslatedTextProps {
  text: string;
  className?: string;
  fallback?: string;
}

export const TranslatedText = ({ text, className, fallback }: TranslatedTextProps) => {
  const { translateText, currentLanguage } = useTranslateContent();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('TranslatedText: Language changed to:', currentLanguage, 'for text:', text);
    
    const handleTranslation = async () => {
      if (currentLanguage === 'en' || !text) {
        console.log('TranslatedText: Using original text (English or empty)');
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateText(text);
        console.log('TranslatedText: Translated from', text, 'to', translated);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(fallback || text);
      } finally {
        setIsLoading(false);
      }
    };

    handleTranslation();
  }, [text, currentLanguage, translateText]); // Add translateText back since it's now memoized

  if (isLoading && currentLanguage !== 'en') {
    return (
      <span className={className}>
        {text}
      </span>
    );
  }

  return (
    <span className={className}>
      {translatedText}
    </span>
  );
};