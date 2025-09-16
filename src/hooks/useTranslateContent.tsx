import { useState, useCallback } from 'react';
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
    'Limited seating': 'Asientos limitados',
    'Join us for an evening of local literature and discussion. Our featured author will be reading from their latest work.': 'Únete a nosotros para una noche de literatura local y discusión. Nuestro autor destacado estará leyendo de su última obra.',
    'Annual community meeting to discuss neighborhood improvements and upcoming projects.': 'Reunión comunitaria anual para discutir mejoras del vecindario y próximos proyectos.',
    'Monthly book discussion group. This month we are reading "The Great Gatsby".': 'Grupo mensual de discusión de libros. Este mes estamos leyendo "El Gran Gatsby".'
  },
  fr: {
    'Local Author talk and Q&A at the Hyde Park BPL Branch': 'Discussion d\'auteur local et questions-réponses à la succursale Hyde Park BPL',
    'Community Meeting': 'Réunion Communautaire',
    'Book Club': 'Club de Lecture',
    'Workshop': 'Atelier',
    'Free': 'Gratuit',
    'Open to all': 'Ouvert à tous',
    'Limited seating': 'Places limitées',
    'Join us for an evening of local literature and discussion. Our featured author will be reading from their latest work.': 'Rejoignez-nous pour une soirée de littérature locale et de discussion. Notre auteur vedette lira son dernier ouvrage.',
    'Annual community meeting to discuss neighborhood improvements and upcoming projects.': 'Réunion communautaire annuelle pour discuter des améliorations du quartier et des projets à venir.',
    'Monthly book discussion group. This month we are reading "The Great Gatsby".': 'Groupe de discussion mensuel sur les livres. Ce mois-ci, nous lisons "Le Grand Gatsby".'
  },
  vi: {
    'Local Author talk and Q&A at the Hyde Park BPL Branch': 'Buổi nói chuyện của tác giả địa phương và hỏi đáp tại chi nhánh Hyde Park BPL',
    'Community Meeting': 'Cuộc Họp Cộng Đồng',
    'Book Club': 'Câu Lạc Bộ Sách',
    'Workshop': 'Hội Thảo',
    'Free': 'Miễn Phí',
    'Open to all': 'Mở cho tất cả',
    'Limited seating': 'Chỗ ngồi có hạn',
    'Join us for an evening of local literature and discussion. Our featured author will be reading from their latest work.': 'Tham gia cùng chúng tôi cho một buổi tối văn học địa phương và thảo luận. Tác giả nổi bật của chúng tôi sẽ đọc từ tác phẩm mới nhất của họ.',
    'Annual community meeting to discuss neighborhood improvements and upcoming projects.': 'Cuộc họp cộng đồng hàng năm để thảo luận về các cải tiến khu phố và các dự án sắp tới.',
    'Monthly book discussion group. This month we are reading "The Great Gatsby".': 'Nhóm thảo luận sách hàng tháng. Tháng này chúng ta đang đọc "Gatsby Vĩ Đại".'
  },
  pt: {
    'Local Author talk and Q&A at the Hyde Park BPL Branch': 'Palestra de autor local e perguntas e respostas na filial Hyde Park BPL',
    'Community Meeting': 'Reunião Comunitária',
    'Book Club': 'Clube do Livro',
    'Workshop': 'Oficina',
    'Free': 'Grátis',
    'Open to all': 'Aberto para todos',
    'Limited seating': 'Assentos limitados',
    'Join us for an evening of local literature and discussion. Our featured author will be reading from their latest work.': 'Junte-se a nós para uma noite de literatura local e discussão. Nosso autor em destaque estará lendo de sua obra mais recente.',
    'Annual community meeting to discuss neighborhood improvements and upcoming projects.': 'Reunião comunitária anual para discutir melhorias do bairro e projetos futuros.',
    'Monthly book discussion group. This month we are reading "The Great Gatsby".': 'Grupo mensal de discussão de livros. Este mês estamos lendo "O Grande Gatsby".'
  }
};

export const useTranslateContent = () => {
  const { i18n } = useTranslation();
  const [cache, setCache] = useState<TranslationCache>({});

  const translateText = useCallback(async (text: string): Promise<string> => {
    console.log('useTranslateContent: Translating', text, 'to language', i18n.language);
    
    // If the current language is English, return the original text
    if (i18n.language === 'en' || !text) {
      console.log('useTranslateContent: Returning original text (English or empty)');
      return text;
    }

    // Check static translations first
    const staticTranslation = staticTranslations[i18n.language]?.[text];
    console.log('useTranslateContent: Looking for static translation:', staticTranslation);
    
    if (staticTranslation) {
      console.log('useTranslateContent: Found static translation:', staticTranslation);
      return staticTranslation;
    }

    // Create a cache key
    const cacheKey = `${text}-${i18n.language}`;
    
    // Check if translation is already cached
    if (cache[cacheKey]) {
      console.log('useTranslateContent: Found cached translation:', cache[cacheKey]);
      return cache[cacheKey];
    }

    console.log('useTranslateContent: No translation found, returning original text');
    // For now, return original text to prevent breaking the site
    // In a production environment, you could implement API-based translation here
    return text;
  }, [i18n.language, cache]);

  return {
    translateText,
    isTranslating: false,
    currentLanguage: i18n.language
  };
};