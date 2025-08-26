import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import vi from './locales/vi.json';
import kea from './locales/kea.json'; // Cape Verdean Creole
import zh from './locales/zh.json';
import ar from './locales/ar.json';
import it from './locales/it.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  vi: { translation: vi },
  kea: { translation: kea },
  zh: { translation: zh },
  ar: { translation: ar },
  it: { translation: it },
  pt: { translation: pt },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;