import { describe, it, expect, beforeEach } from 'vitest';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  onboardingTranslationsEn,
  onboardingTranslationsEs,
  onboardingTranslationsFr,
  onboardingTranslationsPt,
  onboardingTranslationsVi
} from '@/i18n/onboardingTranslations';

// Initialize i18n for testing
const initTestI18n = async (lng: string) => {
  await i18n.use(initReactI18next).init({
    lng,
    fallbackLng: 'en',
    resources: {
      en: { translation: { onboarding: onboardingTranslationsEn } },
      es: { translation: { onboarding: onboardingTranslationsEs } },
      fr: { translation: { onboarding: onboardingTranslationsFr } },
      pt: { translation: { onboarding: onboardingTranslationsPt } },
      vi: { translation: { onboarding: onboardingTranslationsVi } },
    },
    interpolation: { escapeValue: false },
  });
};

describe('Onboarding Modal Language Selection Translations', () => {
  const languages = ['en', 'es', 'fr', 'pt', 'vi'];

  describe('Language Selection Step', () => {
    it.each(languages)('should have all language selection translations for %s', async (lang) => {
      await initTestI18n(lang);
      
      const title = i18n.t('onboarding.languageSelection.title');
      const subtitle = i18n.t('onboarding.languageSelection.subtitle');
      const continueBtn = i18n.t('onboarding.languageSelection.continue');

      expect(title).toBeTruthy();
      expect(title).not.toBe('onboarding.languageSelection.title');
      expect(subtitle).toBeTruthy();
      expect(subtitle).not.toBe('onboarding.languageSelection.subtitle');
      expect(continueBtn).toBeTruthy();
      expect(continueBtn).not.toBe('onboarding.languageSelection.continue');
    });
  });

  describe('Tour Selection Modal', () => {
    it.each(languages)('should have all modal translations for %s', async (lang) => {
      await initTestI18n(lang);

      const keys = [
        'onboarding.modal.title',
        'onboarding.modal.subtitle',
        'onboarding.modal.generalTitle',
        'onboarding.modal.generalDesc',
        'onboarding.modal.eventsTitle',
        'onboarding.modal.eventsDesc',
        'onboarding.modal.businessTitle',
        'onboarding.modal.businessDesc',
        'onboarding.modal.servicesTitle',
        'onboarding.modal.servicesDesc',
        'onboarding.modal.orChoose',
        'onboarding.modal.skip',
      ];

      keys.forEach((key) => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
      });
    });
  });

  describe('Navigation Translations', () => {
    it.each(languages)('should have all navigation translations for %s', async (lang) => {
      await initTestI18n(lang);

      const keys = [
        'onboarding.navigation.back',
        'onboarding.navigation.close',
        'onboarding.navigation.finish',
        'onboarding.navigation.next',
        'onboarding.navigation.skip',
      ];

      keys.forEach((key) => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
      });
    });
  });
});

describe('Onboarding Translation Content Validation', () => {
  it('English language selection content is correct', () => {
    expect(onboardingTranslationsEn.languageSelection.title).toBe('Choose Your Language');
    expect(onboardingTranslationsEn.languageSelection.continue).toBe('Continue');
  });

  it('Spanish language selection content is correct', () => {
    expect(onboardingTranslationsEs.languageSelection.title).toBe('Elige Tu Idioma');
    expect(onboardingTranslationsEs.languageSelection.continue).toBe('Continuar');
  });

  it('French language selection content is correct', () => {
    expect(onboardingTranslationsFr.languageSelection.title).toBe('Choisissez Votre Langue');
    expect(onboardingTranslationsFr.languageSelection.continue).toBe('Continuer');
  });

  it('Portuguese language selection content is correct', () => {
    expect(onboardingTranslationsPt.languageSelection.title).toBe('Escolha Seu Idioma');
    expect(onboardingTranslationsPt.languageSelection.continue).toBe('Continuar');
  });

  it('Vietnamese language selection content is correct', () => {
    expect(onboardingTranslationsVi.languageSelection.title).toBe('Chọn Ngôn Ngữ Của Bạn');
    expect(onboardingTranslationsVi.languageSelection.continue).toBe('Tiếp tục');
  });
});

describe('All Languages Have Complete Structure', () => {
  const translations = {
    en: onboardingTranslationsEn,
    es: onboardingTranslationsEs,
    fr: onboardingTranslationsFr,
    pt: onboardingTranslationsPt,
    vi: onboardingTranslationsVi,
  };

  it('all languages have languageSelection section', () => {
    Object.entries(translations).forEach(([lang, trans]) => {
      expect(trans.languageSelection).toBeDefined();
      expect(trans.languageSelection.title).toBeDefined();
      expect(trans.languageSelection.subtitle).toBeDefined();
      expect(trans.languageSelection.continue).toBeDefined();
    });
  });

  it('all languages have modal section', () => {
    Object.entries(translations).forEach(([lang, trans]) => {
      expect(trans.modal).toBeDefined();
      expect(trans.modal.title).toBeDefined();
      expect(trans.modal.subtitle).toBeDefined();
      expect(trans.modal.generalTitle).toBeDefined();
      expect(trans.modal.generalDesc).toBeDefined();
      expect(trans.modal.eventsTitle).toBeDefined();
      expect(trans.modal.businessTitle).toBeDefined();
      expect(trans.modal.servicesTitle).toBeDefined();
      expect(trans.modal.skip).toBeDefined();
    });
  });

  it('all languages have navigation section', () => {
    Object.entries(translations).forEach(([lang, trans]) => {
      expect(trans.navigation).toBeDefined();
      expect(trans.navigation.back).toBeDefined();
      expect(trans.navigation.close).toBeDefined();
      expect(trans.navigation.finish).toBeDefined();
      expect(trans.navigation.next).toBeDefined();
      expect(trans.navigation.skip).toBeDefined();
    });
  });

  it('all languages have general tour steps', () => {
    Object.entries(translations).forEach(([lang, trans]) => {
      expect(trans.general).toBeDefined();
      expect(trans.general.welcome).toBeDefined();
      expect(trans.general.viewToggle).toBeDefined();
      expect(trans.general.search).toBeDefined();
      expect(trans.general.filters).toBeDefined();
    });
  });
});
