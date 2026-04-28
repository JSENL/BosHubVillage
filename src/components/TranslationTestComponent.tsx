import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

interface TranslationTestCardProps {
  title: string;
  type: 'event' | 'business' | 'news' | 'local-service';
  price?: number;
}

const TranslationTestCard: React.FC<TranslationTestCardProps> = ({ title, type, price }) => {
  const { t } = useTranslation();
  
  const getTypeLabel = () => {
    switch (type) {
      case 'event': return t('itemTypes.events');
      case 'business': return t('itemTypes.businesses'); 
      case 'news': return t('itemTypes.news');
      case 'local-service': return t('itemTypes.localresources');
      default: return type;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full min-h-[200px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs">
            {getTypeLabel()}
          </Badge>
          {price !== undefined && (
            <span className="text-sm font-bold">
              {price === 0 ? t('cards.free') : `$${price}`}
            </span>
          )}
        </div>
        <CardTitle className="text-base font-semibold line-clamp-2 break-words">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>{t('cards.location')}:</span>
            <span>123 Main St</span>
          </div>
          <div className="flex justify-between">
            <span>{t('cards.date')}:</span>
            <span>2024-01-15</span>
          </div>
          <div className="flex justify-between">
            <span>{t('cards.source')}:</span>
            <span>Test Source</span>
          </div>
          <div className="flex justify-between">
            <span>{t('cards.added')}:</span>
            <span>2024-01-01</span>
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" variant="outline" className="w-full">
            {t('cards.viewDetails')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const TranslationTestComponent = () => {
  const { i18n, t } = useTranslation();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  const testTranslations = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    
    // Test that translations are working by checking if they exist and are different from keys
    const testKeys = [
      'navigation.news',
      'navigation.submit', 
      'cards.viewDetails',
      'cards.free',
      'itemTypes.events',
      'itemTypes.businesses',
      'common.submit',
      'common.cancel',
      'common.save',
      'common.edit',
      'common.delete',
      'forms.searchPlaceholder',
      'forms.enterName',
      'forms.selectCategory',
      'messages.saveSuccess',
      'messages.deleteError'
    ];
    
    const passed = testKeys.every(key => {
      const translation = t(key);
      return translation && translation !== key; // Translation exists and is not the key itself
    });
    
    setTestResults(prev => ({ ...prev, [langCode]: passed }));
  };

  const runAllTests = async () => {
    for (const lang of languages) {
      await testTranslations(lang.code);
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Languages className="h-6 w-6" />
          Translation Test Dashboard
        </h2>
        <Button onClick={runAllTests} className="bg-blue-600 hover:bg-blue-700">
          Run All Tests
        </Button>
      </div>

      {/* Language Switcher */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Current Language: {i18n.language.toUpperCase()}</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                localStorage.setItem('language', lang.code);
              }}
              variant={i18n.language === lang.code ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {testResults[lang.code] !== undefined && (
                <span className={`ml-2 text-xs ${testResults[lang.code] ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults[lang.code] ? '✓' : '✗'}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Test Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Test Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div key={lang.code} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{lang.flag} {lang.name}</span>
                {testResults[lang.code] !== undefined && (
                  <span className={`text-sm font-bold ${testResults[lang.code] ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults[lang.code] ? 'PASS' : 'FAIL'}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => testTranslations(lang.code)}
                className="w-full"
              >
                Test {lang.name}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Cards */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Sample Translated Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TranslationTestCard
            title="Sample Event"
            type="event"
            price={0}
          />
          <TranslationTestCard
            title="Sample Business"
            type="business"
            price={50}
          />
          <TranslationTestCard
            title="Sample Culture"
            type="news"
          />
          <TranslationTestCard
            title="Sample Local Resource"
            type="local-service"
            price={25}
          />
        </div>
      </div>

      {/* Navigation Test */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Navigation Translations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div><strong>Culture:</strong> {t('navigation.news')}</div>
          <div><strong>Submit:</strong> {t('navigation.submit')}</div>
          <div><strong>Sign In:</strong> {t('navigation.signIn')}</div>
          <div><strong>Sign Out:</strong> {t('navigation.signOut')}</div>
          <div><strong>Back to Home:</strong> {t('navigation.backToHome')}</div>
          <div><strong>Submit Event:</strong> {t('navigation.submitEvent')}</div>
          <div><strong>Submit Business:</strong> {t('navigation.submitBusiness')}</div>
          <div><strong>Submit Culture:</strong> {t('navigation.submitNews')}</div>
        </div>
      </div>
    </div>
  );
};