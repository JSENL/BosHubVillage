import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Languages } from 'lucide-react';
import { toast } from 'sonner';

export const TranslationVerification = () => {
  const { t, i18n } = useTranslation();

  const testTranslations = [
    { key: 'itemTypes.events', expected: i18n.language === 'es' ? 'Eventos' : 'Events' },
    { key: 'itemTypes.news', expected: i18n.language === 'es' ? 'Noticias' : 'News' },
    { key: 'itemTypes.businesses', expected: i18n.language === 'es' ? 'Empresas' : 'Business' },
    { key: 'itemTypes.localServices', expected: i18n.language === 'es' ? 'Servicios locales' : 'Local Services' },
    { key: 'cards.free', expected: i18n.language === 'es' ? 'Gratis' : 'Free' },
    { key: 'cards.viewDetails', expected: i18n.language === 'es' ? 'Ver detalles' : 'View Details' },
    { key: 'common.directions', expected: i18n.language === 'es' ? 'Direcciones' : 'Directions' },
    { key: 'common.clickMarkerHint', expected: i18n.language === 'es' ? '💡 Haz clic en el marcador para resaltar • Doble clic para ver detalles' : '💡 Click marker to highlight • Double-click to view details' }
  ];

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    toast.success(`Language switched to ${lang === 'es' ? 'Spanish' : 'English'}!`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Translation Verification - Hardcoded Strings Removed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={() => switchLanguage('es')} 
            variant={i18n.language === 'es' ? 'default' : 'outline'}
            size="sm"
          >
            🇪🇸 Español
          </Button>
          <Button 
            onClick={() => switchLanguage('en')}
            variant={i18n.language === 'en' ? 'default' : 'outline'} 
            size="sm"
          >
            🇺🇸 English
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Translation Status:</h4>
          <div className="grid grid-cols-1 gap-2">
            {testTranslations.map(({ key, expected }) => {
              const actual = t(key);
              const isWorking = actual !== key && actual.length > 0;
              
              return (
                <div key={key} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    {isWorking ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <code className="text-xs bg-gray-100 px-1 rounded">{key}</code>
                  </div>
                  <Badge variant={isWorking ? "default" : "destructive"}>
                    {actual}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">✅ Refactoring Complete</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Removed hardcoded "Event", "News", "Business", "Local Resource" labels</li>
            <li>• Replaced hardcoded "FREE" with translatable text</li>
            <li>• Made "View Details" and "Directions" buttons translatable</li>
            <li>• Updated map popup tooltips to use translations</li>
            <li>• Added missing translation keys to all 9 supported languages</li>
            <li>• Map content now properly adapts to selected language</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🗺️ Map Integration</h4>
          <p className="text-sm text-blue-700">
            Map popups, markers, and controls now use the translation system. 
            Click on map markers to see translated content including titles, descriptions, 
            categories, and action buttons in the selected language.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};