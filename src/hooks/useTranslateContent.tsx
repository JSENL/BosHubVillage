import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationCache {
  [key: string]: string;
}

// Simple translation mappings for common words/phrases
const staticTranslations: { [lang: string]: { [key: string]: string } } = {
  es: {
    'Local Author talk and Q&A at the Hyde Park BPL Branch': 'Charla de autor local y preguntas y respuestas en la sucursal de Hyde Park BPL',
    'Community Meeting': 'Reunión Comunitaria',
    'Book Club': 'Club de Lectura',
    'Workshop': 'Taller',
    'Free': 'Gratis',
    'Open to all': 'Abierto para todos',
    'Limited seating': 'Asientos limitados'
  },
  fr: {
    'Local Author talk and Q&A at the Hyde Park BPL Branch': 'Discussion d\'auteur local et questions-réponses à la succursale Hyde Park BPL',
    'Community Meeting': 'Réunion Communautaire',
    'Book Club': 'Club de Lecture',
    'Workshop': 'Atelier',
    'Free': 'Gratuit',
    'Open to all': 'Ouvert à tous',
    'Limited seating': 'Places limitées'
  },
  vi: {
    'Local Author talk and Q&A at the Hyde Park BPL Branch': 'Buổi nói chuyện của tác giả địa phương và hỏi đáp tại chi nhánh Hyde Park BPL',
    'Community Meeting': 'Cuộc Họp Cộng Đồng',
    'Book Club': 'Câu Lạc Bộ Sách',
    'Workshop': 'Hội Thảo',
    'Free': 'Miễn Phí',
    'Open to all': 'Mở cho tất cả',
    'Limited seating': 'Chỗ ngồi có hạn'
  },
  pt: {
    'Local Author talk and Q&A at the Hyde Park BPL Branch': 'Palestra de autor local e perguntas e respostas na filial Hyde Park BPL',
    'Community Meeting': 'Reunião Comunitária',
    'Book Club': 'Clube do Livro',
    'Workshop': 'Oficina',
    'Free': 'Grátis',
    'Open to all': 'Aberto para todos',
    'Limited seating': 'Assentos limitados'
  }
};

export const useTranslateContent = () => {
  const { i18n } = useTranslation();
  const [cache, setCache] = useState<TranslationCache>({});

  const translateText = async (text: string): Promise<string> => {
    // If the current language is English, return the original text
    if (i18n.language === 'en' || !text) {
      return text;
    }

    // Check static translations first
    const staticTranslation = staticTranslations[i18n.language]?.[text];
    if (staticTranslation) {
      return staticTranslation;
    }

    // Create a cache key
    const cacheKey = `${text}-${i18n.language}`;
    
    // Check if translation is already cached
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    // For now, return original text to prevent breaking the site
    // In a production environment, you could implement API-based translation here
    return text;
  };

  return {
    translateText,
    isTranslating: false,
    currentLanguage: i18n.language
  };
};