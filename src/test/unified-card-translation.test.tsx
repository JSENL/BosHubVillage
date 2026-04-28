import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, render } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTranslatedField } from '@/hooks/useTranslatedField';
import { UnifiedItemCard } from '@/components/UnifiedItemCard';
import { UnifiedItem } from '@/types/unifiedItem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';

// Initialize i18n for testing
const initI18n = async (language: string) => {
  if (i18n.isInitialized) {
    await i18n.changeLanguage(language);
    return;
  }
  
  await i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: 'en',
    resources: {
      en: { 
        translation: {
          itemTypes: { events: 'Events', news: 'Culture', businesses: 'Businesses', localresources: 'Local Services' }
        } 
      },
      es: { 
        translation: {
          itemTypes: { events: 'Eventos', news: 'Cultura', businesses: 'Negocios', localresources: 'Servicios Locales' }
        } 
      },
      fr: { 
        translation: {
          itemTypes: { events: 'Événements', news: 'Actualités', businesses: 'Entreprises', localresources: 'Services Locaux' }
        } 
      },
      pt: { 
        translation: {
          itemTypes: { events: 'Eventos', news: 'Cultura', businesses: 'Negócios', localresources: 'Serviços Locais' }
        } 
      },
      vi: { 
        translation: {
          itemTypes: { events: 'Sự kiện', news: 'Văn Hóa', businesses: 'Doanh nghiệp', localresources: 'Dịch vụ Địa phương' }
        } 
      },
    },
    interpolation: { escapeValue: false },
  });
};

// Wrapper component for hooks and components
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </I18nextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Mock unified item with translations
const createMockItem = (): UnifiedItem => ({
  id: 'test-event-123',
  title: 'Community Festival',
  description: 'A wonderful community gathering with food and music.',
  latitude: 42.3601,
  longitude: -71.0589,
  type: 'event',
  location: 'Boston Common',
  category: 'Festival',
  date: '2026-03-15',
  start_time: '10:00',
  end_time: '18:00',
  price: 0,
  title_translations: {
    es: 'Festival Comunitario',
    fr: 'Festival Communautaire',
    pt: 'Festival Comunitário',
    vi: 'Lễ hội Cộng đồng',
  },
  description_translations: {
    es: 'Una maravillosa reunión comunitaria con comida y música.',
    fr: 'Un merveilleux rassemblement communautaire avec nourriture et musique.',
    pt: 'Uma maravilhosa reunião comunitária com comida e música.',
    vi: 'Một buổi họp mặt cộng đồng tuyệt vời với thức ăn và âm nhạc.',
  },
  location_translations: {
    es: 'Boston Común',
    fr: 'Boston Common',
    pt: 'Boston Common',
    vi: 'Boston Common',
  },
  category_translations: {
    es: 'Festival',
    fr: 'Festival',
    pt: 'Festival',
    vi: 'Lễ hội',
  },
});

describe('UnifiedItemCard Translation Integration', () => {
  beforeEach(async () => {
    await initI18n('en');
  });

  describe('useTranslatedField hook with real translations', () => {
    it('returns English title when language is English', async () => {
      await act(async () => {
        await i18n.changeLanguage('en');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const item = createMockItem();
      const translatedTitle = result.current.getTranslatedText(item.title, item.title_translations);
      
      expect(result.current.currentLanguage).toBe('en');
      expect(translatedTitle).toBe('Community Festival');
    });

    it('returns Spanish translation when language is Spanish', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const item = createMockItem();
      const translatedTitle = result.current.getTranslatedText(item.title, item.title_translations);
      
      expect(result.current.currentLanguage).toBe('es');
      expect(translatedTitle).toBe('Festival Comunitario');
    });

    it('returns French translation when language is French', async () => {
      await act(async () => {
        await i18n.changeLanguage('fr');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const item = createMockItem();
      const translatedTitle = result.current.getTranslatedText(item.title, item.title_translations);
      
      expect(result.current.currentLanguage).toBe('fr');
      expect(translatedTitle).toBe('Festival Communautaire');
    });

    it('returns Portuguese translation when language is Portuguese', async () => {
      await act(async () => {
        await i18n.changeLanguage('pt');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const item = createMockItem();
      const translatedTitle = result.current.getTranslatedText(item.title, item.title_translations);
      
      expect(result.current.currentLanguage).toBe('pt');
      expect(translatedTitle).toBe('Festival Comunitário');
    });

    it('returns Vietnamese translation when language is Vietnamese', async () => {
      await act(async () => {
        await i18n.changeLanguage('vi');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const item = createMockItem();
      const translatedTitle = result.current.getTranslatedText(item.title, item.title_translations);
      
      expect(result.current.currentLanguage).toBe('vi');
      expect(translatedTitle).toBe('Lễ hội Cộng đồng');
    });
  });

  describe('UnifiedItemCard renders correct translations', () => {
    it('displays English content when English is selected', async () => {
      await act(async () => {
        await i18n.changeLanguage('en');
      });

      const item = createMockItem();
      
      const { getByText } = render(
        <UnifiedItemCard item={item} viewMode="grid" />,
        { wrapper: createWrapper() }
      );

      expect(getByText('Community Festival')).toBeInTheDocument();
    });

    it('displays Spanish content when Spanish is selected', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const item = createMockItem();
      
      const { getByText } = render(
        <UnifiedItemCard item={item} viewMode="grid" />,
        { wrapper: createWrapper() }
      );

      expect(getByText('Festival Comunitario')).toBeInTheDocument();
    });

    it('displays French content when French is selected', async () => {
      await act(async () => {
        await i18n.changeLanguage('fr');
      });

      const item = createMockItem();
      
      const { getByText } = render(
        <UnifiedItemCard item={item} viewMode="grid" />,
        { wrapper: createWrapper() }
      );

      expect(getByText('Festival Communautaire')).toBeInTheDocument();
    });

    it('displays Vietnamese content when Vietnamese is selected', async () => {
      await act(async () => {
        await i18n.changeLanguage('vi');
      });

      const item = createMockItem();
      
      const { getByText } = render(
        <UnifiedItemCard item={item} viewMode="grid" />,
        { wrapper: createWrapper() }
      );

      expect(getByText('Lễ hội Cộng đồng')).toBeInTheDocument();
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('falls back to English when translation is missing for selected language', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      // Item with no Spanish translation
      const partialTranslations = { fr: 'Festival Communautaire' };
      const translatedTitle = result.current.getTranslatedText('Community Festival', partialTranslations);
      
      expect(translatedTitle).toBe('Community Festival'); // Falls back to original
    });

    it('falls back to English when translations object is empty', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedTitle = result.current.getTranslatedText('Community Festival', {});
      
      expect(translatedTitle).toBe('Community Festival');
    });

    it('falls back to English when translations object is undefined', async () => {
      await act(async () => {
        await i18n.changeLanguage('fr');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedTitle = result.current.getTranslatedText('Community Festival', undefined);
      
      expect(translatedTitle).toBe('Community Festival');
    });

    it('returns empty string when original text is null or undefined', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      expect(result.current.getTranslatedText(null, { es: 'Spanish' })).toBe('');
      expect(result.current.getTranslatedText(undefined, { es: 'Spanish' })).toBe('');
    });
  });

  describe('Dynamic language switching', () => {
    it('correctly updates translation when language changes', async () => {
      const { result, rerender } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const item = createMockItem();

      // English
      await act(async () => {
        await i18n.changeLanguage('en');
      });
      rerender();
      expect(result.current.getTranslatedText(item.title, item.title_translations)).toBe('Community Festival');

      // Spanish
      await act(async () => {
        await i18n.changeLanguage('es');
      });
      rerender();
      expect(result.current.getTranslatedText(item.title, item.title_translations)).toBe('Festival Comunitario');

      // French
      await act(async () => {
        await i18n.changeLanguage('fr');
      });
      rerender();
      expect(result.current.getTranslatedText(item.title, item.title_translations)).toBe('Festival Communautaire');

      // Portuguese
      await act(async () => {
        await i18n.changeLanguage('pt');
      });
      rerender();
      expect(result.current.getTranslatedText(item.title, item.title_translations)).toBe('Festival Comunitário');

      // Vietnamese
      await act(async () => {
        await i18n.changeLanguage('vi');
      });
      rerender();
      expect(result.current.getTranslatedText(item.title, item.title_translations)).toBe('Lễ hội Cộng đồng');
    });
  });
});
