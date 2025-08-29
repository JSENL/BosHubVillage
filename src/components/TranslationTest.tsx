import React from 'react';
import { useTranslation } from 'react-i18next';
import { useContentTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const TranslationTest = () => {
  const { t, i18n } = useTranslation();
  const { translateContent, currentLanguage } = useContentTranslation();

  const testTranslation = async () => {
    if (currentLanguage === 'en') {
      toast.info('Change language to test translations');
      return;
    }

    try {
      const testData = {
        table: 'events' as const,
        id: 'test-event-123',
        field: 'title',
        originalText: 'Annual Beach Cleanup Event - Help protect our beautiful coastline!'
      };

      const result = await translateContent(testData);
      
      toast.success(`Translation test successful! Original: "${testData.originalText.substring(0, 50)}..." → Translated: "${result.substring(0, 50)}..."`);
    } catch (error) {
      toast.error('Translation test failed');
      console.error('Translation test error:', error);
    }
  };

  const getCurrentLanguageInfo = () => {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'fr': 'French',
      'es': 'Spanish',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'it': 'Italian',
      'pt': 'Portuguese',
      
      'vi': 'Vietnamese'
    };
    return languageNames[currentLanguage] || currentLanguage;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Translation System Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Language:</span>
            <Badge variant="secondary">{getCurrentLanguageInfo()}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">UI Translation:</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {t('common.loading')}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This tests that both UI components and database content can be translated.
          </p>
          
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• UI elements use i18n translations</li>
            <li>• Cards show translated content from database</li>
            <li>• Map popups display translated information</li>
            <li>• Content is cached for performance</li>
          </ul>
        </div>

        <Button 
          onClick={testTranslation} 
          className="w-full"
          disabled={currentLanguage === 'en'}
        >
          {currentLanguage === 'en' 
            ? 'Switch language to test' 
            : `Test Content Translation (${getCurrentLanguageInfo()})`
          }
        </Button>

        {currentLanguage !== 'en' && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Change cards or click map markers to see translated content. 
              Content is automatically translated and cached in the database.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};