import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Languages } from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';

export const HeroTranslationTest = () => {
  const { t, i18n } = useTranslation();

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Hero Section Translation Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={() => switchLanguage('en')} 
            variant={i18n.language === 'en' ? 'default' : 'outline'}
            size="sm"
          >
            🇺🇸 English
          </Button>
          <Button 
            onClick={() => switchLanguage('es')}
            variant={i18n.language === 'es' ? 'default' : 'outline'} 
            size="sm"
          >
            🇪🇸 Español
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Current Translations:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Title:</span>
              <span className="text-blue-600">"{t('hero.title')}"</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Subtitle:</span>
              <span className="text-blue-600">"{t('hero.subtitle')}"</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">✅ Hero Section Fixed</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Removed hardcoded "Welcome to HubVillage" title</li>
            <li>• Removed hardcoded subtitle text</li>
            <li>• Hero section now uses translation keys: hero.title & hero.subtitle</li>
            <li>• Updated English and Spanish translations to match original text</li>
            <li>• Hero section dynamically changes language with dropdown</li>
          </ul>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 text-sm font-medium">Preview:</div>
          <HeroSection />
        </div>
      </CardContent>
    </Card>
  );
};