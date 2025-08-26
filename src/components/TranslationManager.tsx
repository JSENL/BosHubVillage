import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TranslationManagerProps {
  items: Array<{
    id: string;
    table: 'events' | 'business' | 'local_resources' | 'news';
    title?: string;
    name?: string;
  }>;
}

export const TranslationManager = ({ items }: TranslationManagerProps) => {
  const { i18n } = useTranslation();
  const [translating, setTranslating] = useState(false);
  const [translatedCount, setTranslatedCount] = useState(0);

  const translateAllContent = async () => {
    if (i18n.language === 'en' || items.length === 0) return;

    setTranslating(true);
    setTranslatedCount(0);

    const fieldsToTranslate: Record<string, string[]> = {
      events: ['title', 'description', 'location', 'category'],
      business: ['title', 'short_description', 'description', 'address'],
      local_resources: ['name', 'description', 'address'],
      news: ['title', 'content', 'location']
    };

    try {
      let completed = 0;
      const totalTranslations = items.reduce((acc, item) => 
        acc + fieldsToTranslate[item.table]?.length || 0, 0
      );

      for (const item of items) {
        const fields = fieldsToTranslate[item.table];
        if (!fields) continue;

        for (const field of fields) {
          try {
            const { data, error } = await supabase.functions.invoke('translate-content', {
              body: {
                table: item.table,
                id: item.id,
                field,
                targetLanguage: i18n.language
              }
            });

            if (error) {
              console.error(`Translation error for ${item.table}.${field}:`, error);
            } else if (data?.success) {
              completed++;
              setTranslatedCount(completed);
            }
          } catch (error) {
            console.error(`Translation failed for ${item.table}.${field}:`, error);
          }
        }
      }

      toast.success(`Translated ${completed}/${totalTranslations} fields to ${getLanguageName(i18n.language)}`);
      
      // Refresh the page to show updated translations
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      console.error('Translation process failed:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const getLanguageName = (code: string): string => {
    const names: Record<string, string> = {
      'fr': 'French',
      'es': 'Spanish', 
      'vi': 'Vietnamese',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'it': 'Italian',
      'pt': 'Portuguese',
      'kea': 'Cape Verdean Creole'
    };
    return names[code] || code;
  };

  if (i18n.language === 'en' || items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <Languages className="h-4 w-4 text-blue-600" />
      <span className="text-sm text-blue-800">
        Content available in {getLanguageName(i18n.language)}
      </span>
      <Button 
        onClick={translateAllContent}
        disabled={translating}
        size="sm"
        className="ml-auto"
      >
        {translating ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Translating {translatedCount}...
          </>
        ) : (
          'Translate All Content'
        )}
      </Button>
    </div>
  );
};