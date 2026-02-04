import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ContentTable = 'events' | 'business' | 'local_resources' | 'news';

export const useAutoTranslate = () => {
  const { toast } = useToast();

  const translateContent = useCallback(async (
    table: ContentTable,
    id: string,
    showToast = true
  ): Promise<boolean> => {
    try {
      console.log(`Auto-translating ${table} with id ${id}`);
      
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: { table, id, mode: 'batch' }
      });

      if (error) {
        console.error('Translation error:', error);
        if (showToast) {
          toast({
            title: 'Translation Warning',
            description: 'Content was approved but translations could not be generated.',
            variant: 'destructive'
          });
        }
        return false;
      }

      console.log('Translation result:', data);
      
      if (data.success && data.translationsAdded > 0 && showToast) {
        toast({
          title: 'Translations Added',
          description: `${data.translationsAdded} translations generated for this content.`
        });
      }

      return data.success;
    } catch (error) {
      console.error('Failed to trigger translation:', error);
      return false;
    }
  }, [toast]);

  return { translateContent };
};
