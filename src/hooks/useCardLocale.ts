import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es',
  fr: 'fr-FR',
  vi: 'vi-VN',
  pt: 'pt-BR',
};

/**
 * Shared hook for card components: provides locale and date formatting
 * so all cards (EventCard, NewsCard, BusinessCard, LocalServiceCard)
 * translate dates according to the nav language selection.
 */
export function useCardLocale() {
  const { i18n } = useTranslation();
  const locale = LOCALE_MAP[i18n.language] || 'en-US';

  const formatDate = useMemo(() => {
    return (dateString: string) =>
      new Date(dateString).toLocaleDateString(locale, {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });
  }, [locale]);

  return { locale, formatDate };
}
