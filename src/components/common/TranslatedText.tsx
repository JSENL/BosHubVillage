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
    const handleTranslation = async () => {
      if (currentLanguage === 'en' || !text) {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateText(text);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(fallback || text);
      } finally {
        setIsLoading(false);
      }
    };

    handleTranslation();
  }, [text, currentLanguage, translateText, fallback]);

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