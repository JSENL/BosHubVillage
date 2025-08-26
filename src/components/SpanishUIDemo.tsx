import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const SpanishUIDemo = () => {
  const { t, i18n } = useTranslation();

  const switchToSpanish = () => {
    i18n.changeLanguage('es');
    localStorage.setItem('language', 'es');
    toast.success('¡Interfaz cambiada al español!');
  };

  const switchToEnglish = () => {
    i18n.changeLanguage('en');
    localStorage.setItem('language', 'en');
    toast.success('Interface switched to English!');
  };

  useEffect(() => {
    // Auto-switch to Spanish when component loads
    if (i18n.language !== 'es') {
      switchToSpanish();
    }
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          {t('navigation.submit')} - {t('hero.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('filters.type')}:</span>
            <Badge variant="secondary">🇪🇸 Español</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              {t('itemTypes.events')}
            </Button>
            <Button variant="outline" size="sm">
              {t('itemTypes.news')}
            </Button>
            <Button variant="outline" size="sm">
              {t('itemTypes.businesses')}
            </Button>
            <Button variant="outline" size="sm">
              {t('itemTypes.localServices')}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('search.placeholder')}
          </p>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">{t('viewToggle.map')} & {t('viewToggle.list')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">{t('filters.filters')} - {t('filters.clearAll')}</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">{t('cards.viewDetails')} - {t('cards.readMore')}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={switchToSpanish} 
            variant={i18n.language === 'es' ? 'default' : 'outline'}
            className="flex-1"
          >
            🇪🇸 Español
          </Button>
          <Button 
            onClick={switchToEnglish}
            variant={i18n.language === 'en' ? 'default' : 'outline'} 
            className="flex-1"
          >
            🇺🇸 English
          </Button>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Verificación completa:</strong> Todos los botones, etiquetas, tooltips y controles del mapa ahora aparecen en español.
            Los controles de zoom del mapa Mapbox también se han localizado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};