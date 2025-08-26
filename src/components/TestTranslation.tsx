import { useTranslation } from 'react-i18next';

interface TestTranslationProps {}

export const TestTranslation = () => {
  const { t, i18n } = useTranslation();

  const testLanguageSwitch = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Translation Test</h2>
      
      {/* Language Switcher */}
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => testLanguageSwitch('en')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          English 🇺🇸
        </button>
        <button 
          onClick={() => testLanguageSwitch('vi')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Tiếng Việt 🇻🇳
        </button>
        <button 
          onClick={() => testLanguageSwitch('fr')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Français 🇫🇷
        </button>
      </div>

      {/* Navigation Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{t('navigation.backToHome')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <span className="p-2 bg-gray-100 rounded">{t('navigation.news')}</span>
          <span className="p-2 bg-gray-100 rounded">{t('navigation.submit')}</span>
          <span className="p-2 bg-gray-100 rounded">{t('navigation.signIn')}</span>
          <span className="p-2 bg-gray-100 rounded">{t('navigation.signOut')}</span>
        </div>
      </div>

      {/* Hero Section Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Hero Section</h3>
        <div className="bg-logo-vibrant-blue text-white p-4 rounded">
          <h4 className="font-bold text-xl">{t('hero.title')}</h4>
          <p>{t('hero.subtitle')}</p>
        </div>
      </div>

      {/* Filters Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <span className="p-2 bg-purple-100 rounded">{t('filters.showFilters')}</span>
          <span className="p-2 bg-purple-100 rounded">{t('filters.clearAll')}</span>
          <span className="p-2 bg-purple-100 rounded">{t('filters.type')}</span>
          <span className="p-2 bg-purple-100 rounded">{t('filters.category')}</span>
        </div>
      </div>

      {/* Cards Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Cards</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <span className="p-2 bg-blue-100 rounded">{t('cards.viewDetails')}</span>
          <span className="p-2 bg-blue-100 rounded">{t('cards.free')}</span>
          <span className="p-2 bg-blue-100 rounded">{t('cards.location')}</span>
          <span className="p-2 bg-blue-100 rounded">{t('cards.date')}</span>
        </div>
      </div>

      {/* Forms Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Forms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <span className="p-2 bg-green-100 rounded">{t('forms.title')}</span>
          <span className="p-2 bg-green-100 rounded">{t('forms.submit')}</span>
          <span className="p-2 bg-green-100 rounded">{t('forms.cancel')}</span>
          <span className="p-2 bg-green-100 rounded">{t('forms.required')}</span>
        </div>
      </div>

      {/* Common Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Common</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <span className="p-2 bg-yellow-100 rounded">{t('common.loading')}</span>
          <span className="p-2 bg-yellow-100 rounded">{t('common.error')}</span>
          <span className="p-2 bg-yellow-100 rounded">{t('common.success')}</span>
          <span className="p-2 bg-yellow-100 rounded">{t('common.confirm')}</span>
        </div>
      </div>

      {/* Current Language */}
      <div className="text-center mt-8 p-4 bg-gray-50 rounded">
        <p className="text-lg">
          <strong>Current Language:</strong> {i18n.language} 
          <span className="ml-4 text-sm text-gray-600">
            ({i18n.language === 'en' ? 'English' : i18n.language === 'vi' ? 'Tiếng Việt' : 'Français'})
          </span>
        </p>
      </div>
    </div>
  );
};