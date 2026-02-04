import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import React from 'react';
import { useTranslatedField } from '@/hooks/useTranslatedField';

// Initialize i18n for testing
const initI18n = async (language: string) => {
  await i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: 'en',
    resources: {
      en: { translation: {} },
      es: { translation: {} },
      fr: { translation: {} },
      pt: { translation: {} },
      vi: { translation: {} },
    },
    interpolation: { escapeValue: false },
  });
};

// Wrapper component for hooks
const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  );
};

describe('Card Translations - Language Matching', () => {
  const mockTranslations = {
    es: 'Título en Español',
    fr: 'Titre en Français',
    pt: 'Título em Português',
    vi: 'Tiêu đề bằng Tiếng Việt',
  };

  const originalText = 'Original English Title';

  beforeEach(async () => {
    await initI18n('en');
  });

  describe('useTranslatedField hook', () => {
    it('returns original text when language is English', async () => {
      await act(async () => {
        await i18n.changeLanguage('en');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedText = result.current.getTranslatedText(originalText, mockTranslations);
      
      expect(result.current.currentLanguage).toBe('en');
      expect(translatedText).toBe(originalText);
    });

    it('returns Spanish translation when language is Spanish', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedText = result.current.getTranslatedText(originalText, mockTranslations);
      
      expect(result.current.currentLanguage).toBe('es');
      expect(translatedText).toBe('Título en Español');
    });

    it('returns French translation when language is French', async () => {
      await act(async () => {
        await i18n.changeLanguage('fr');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedText = result.current.getTranslatedText(originalText, mockTranslations);
      
      expect(result.current.currentLanguage).toBe('fr');
      expect(translatedText).toBe('Titre en Français');
    });

    it('returns Portuguese translation when language is Portuguese', async () => {
      await act(async () => {
        await i18n.changeLanguage('pt');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedText = result.current.getTranslatedText(originalText, mockTranslations);
      
      expect(result.current.currentLanguage).toBe('pt');
      expect(translatedText).toBe('Título em Português');
    });

    it('returns Vietnamese translation when language is Vietnamese', async () => {
      await act(async () => {
        await i18n.changeLanguage('vi');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedText = result.current.getTranslatedText(originalText, mockTranslations);
      
      expect(result.current.currentLanguage).toBe('vi');
      expect(translatedText).toBe('Tiêu đề bằng Tiếng Việt');
    });

    it('falls back to original text when translation is missing', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      // No Spanish translation available
      const incompleteTranslations = { fr: 'Titre en Français' };
      const translatedText = result.current.getTranslatedText(originalText, incompleteTranslations);
      
      expect(translatedText).toBe(originalText);
    });

    it('falls back to original text when translations object is null', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedText = result.current.getTranslatedText(originalText, null);
      
      expect(translatedText).toBe(originalText);
    });

    it('returns empty string when original text is null', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translatedText = result.current.getTranslatedText(null, mockTranslations);
      
      expect(translatedText).toBe('');
    });

    it('falls back when translation is empty string', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const translationsWithEmpty = { es: '', fr: 'Titre en Français' };
      const translatedText = result.current.getTranslatedText(originalText, translationsWithEmpty);
      
      expect(translatedText).toBe(originalText);
    });

    it('updates translation when language changes dynamically', async () => {
      await act(async () => {
        await i18n.changeLanguage('en');
      });

      const { result, rerender } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      // Initially English
      expect(result.current.getTranslatedText(originalText, mockTranslations)).toBe(originalText);

      // Change to Spanish
      await act(async () => {
        await i18n.changeLanguage('es');
      });
      rerender();

      expect(result.current.currentLanguage).toBe('es');
      expect(result.current.getTranslatedText(originalText, mockTranslations)).toBe('Título en Español');

      // Change to French
      await act(async () => {
        await i18n.changeLanguage('fr');
      });
      rerender();

      expect(result.current.currentLanguage).toBe('fr');
      expect(result.current.getTranslatedText(originalText, mockTranslations)).toBe('Titre en Français');
    });
  });

  describe('All supported languages match correctly', () => {
    const supportedLanguages = [
      { code: 'en', expectedText: originalText },
      { code: 'es', expectedText: 'Título en Español' },
      { code: 'fr', expectedText: 'Titre en Français' },
      { code: 'pt', expectedText: 'Título em Português' },
      { code: 'vi', expectedText: 'Tiêu đề bằng Tiếng Việt' },
    ];

    supportedLanguages.forEach(({ code, expectedText }) => {
      it(`displays correct text for language: ${code}`, async () => {
        await act(async () => {
          await i18n.changeLanguage(code);
        });

        const { result } = renderHook(() => useTranslatedField(), {
          wrapper: createWrapper(),
        });

        const translatedText = result.current.getTranslatedText(originalText, mockTranslations);
        
        expect(result.current.currentLanguage).toBe(code);
        expect(translatedText).toBe(expectedText);
      });
    });
  });

  describe('Multiple fields translation consistency', () => {
    const mockTitleTranslations = {
      es: 'Evento de Prueba',
      fr: 'Événement de Test',
      pt: 'Evento de Teste',
      vi: 'Sự kiện Thử nghiệm',
    };

    const mockDescriptionTranslations = {
      es: 'Esta es una descripción en español',
      fr: 'Ceci est une description en français',
      pt: 'Esta é uma descrição em português',
      vi: 'Đây là mô tả bằng tiếng Việt',
    };

    const mockLocationTranslations = {
      es: 'Centro de la Ciudad',
      fr: 'Centre-ville',
      pt: 'Centro da Cidade',
      vi: 'Trung tâm Thành phố',
    };

    it('translates all card fields consistently for same language', async () => {
      await act(async () => {
        await i18n.changeLanguage('es');
      });

      const { result } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const title = result.current.getTranslatedText('Test Event', mockTitleTranslations);
      const description = result.current.getTranslatedText('This is a test description', mockDescriptionTranslations);
      const location = result.current.getTranslatedText('Downtown', mockLocationTranslations);

      expect(title).toBe('Evento de Prueba');
      expect(description).toBe('Esta es una descripción en español');
      expect(location).toBe('Centro de la Ciudad');
    });

    it('maintains consistency when switching between all languages', async () => {
      const { result, rerender } = renderHook(() => useTranslatedField(), {
        wrapper: createWrapper(),
      });

      const languages = ['en', 'es', 'fr', 'pt', 'vi'];

      for (const lang of languages) {
        await act(async () => {
          await i18n.changeLanguage(lang);
        });
        rerender();

        expect(result.current.currentLanguage).toBe(lang);
        
        // All fields should be translated to the same language
        const title = result.current.getTranslatedText('Test Event', mockTitleTranslations);
        const description = result.current.getTranslatedText('This is a test description', mockDescriptionTranslations);
        
        if (lang === 'en') {
          expect(title).toBe('Test Event');
          expect(description).toBe('This is a test description');
        } else {
          expect(title).toBe(mockTitleTranslations[lang as keyof typeof mockTitleTranslations]);
          expect(description).toBe(mockDescriptionTranslations[lang as keyof typeof mockDescriptionTranslations]);
        }
      }
    });
  });
});
