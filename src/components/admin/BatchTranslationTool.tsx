import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Languages, Play, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type ContentTable = 'events' | 'business' | 'local_resources' | 'news';

interface TranslationStats {
  total: number;
  translated: number;
  failed: number;
  skipped: number;
}

export const BatchTranslationTool = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTable, setCurrentTable] = useState<ContentTable | null>(null);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<Record<ContentTable, TranslationStats>>({
    events: { total: 0, translated: 0, failed: 0, skipped: 0 },
    business: { total: 0, translated: 0, failed: 0, skipped: 0 },
    local_resources: { total: 0, translated: 0, failed: 0, skipped: 0 },
    news: { total: 0, translated: 0, failed: 0, skipped: 0 },
  });

  const tables: { key: ContentTable; label: string; translationFields: string[] }[] = [
    { key: 'events', label: 'Events', translationFields: ['title_translations', 'description_translations', 'location_translations', 'category_translations'] },
    { key: 'business', label: 'Businesses', translationFields: ['title_translations', 'description_translations', 'address_translations', 'short_description_translations'] },
    { key: 'local_resources', label: 'Local Resources', translationFields: ['name_translations', 'description_translations', 'address_translations'] },
    { key: 'news', label: 'News', translationFields: ['title_translations', 'content_translations', 'location_translations'] },
  ];

  const targetLanguages = ['es', 'fr', 'vi', 'pt'];

  const needsTranslation = (record: any, translationFields: string[]): boolean => {
    for (const field of translationFields) {
      const translations = record[field];
      if (!translations || typeof translations !== 'object') return true;
      
      for (const lang of targetLanguages) {
        if (!translations[lang] || translations[lang].trim() === '') {
          return true;
        }
      }
    }
    return false;
  };

  const translateTable = async (table: ContentTable) => {
    const tableConfig = tables.find(t => t.key === table);
    if (!tableConfig) return;

    setCurrentTable(table);
    setProgress(0);

    // Fetch all records
    const { data: records, error } = await supabase
      .from(table)
      .select('*');

    if (error || !records) {
      toast({
        title: 'Error',
        description: `Failed to fetch ${table}: ${error?.message}`,
        variant: 'destructive'
      });
      return;
    }

    // Filter records that need translation
    const needsWork = records.filter(r => needsTranslation(r, tableConfig.translationFields));
    
    const newStats: TranslationStats = {
      total: records.length,
      translated: 0,
      failed: 0,
      skipped: records.length - needsWork.length
    };

    if (needsWork.length === 0) {
      setStats(prev => ({ ...prev, [table]: newStats }));
      toast({
        title: `${tableConfig.label} Complete`,
        description: `All ${records.length} items already have translations.`
      });
      return;
    }

    // Process each record
    for (let i = 0; i < needsWork.length; i++) {
      const record = needsWork[i];
      setProgress(Math.round(((i + 1) / needsWork.length) * 100));

      try {
        const { data, error: translateError } = await supabase.functions.invoke('translate-content', {
          body: { table, id: record.id, mode: 'batch' }
        });

        if (translateError || !data?.success) {
          console.error(`Translation failed for ${table}/${record.id}:`, translateError || data?.error);
          newStats.failed++;
        } else {
          newStats.translated++;
        }
      } catch (err) {
        console.error(`Translation error for ${table}/${record.id}:`, err);
        newStats.failed++;
      }

      // Update stats in real-time
      setStats(prev => ({ ...prev, [table]: { ...newStats } }));

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    toast({
      title: `${tableConfig.label} Translation Complete`,
      description: `Translated: ${newStats.translated}, Failed: ${newStats.failed}, Skipped: ${newStats.skipped}`
    });
  };

  const runBatchTranslation = async () => {
    setIsRunning(true);
    
    for (const table of tables) {
      await translateTable(table.key);
    }

    setIsRunning(false);
    setCurrentTable(null);
    setProgress(0);

    toast({
      title: 'Batch Translation Complete',
      description: 'All content tables have been processed.'
    });
  };

  const translateSingleTable = async (table: ContentTable) => {
    setIsRunning(true);
    await translateTable(table);
    setIsRunning(false);
    setCurrentTable(null);
    setProgress(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Batch Translation Tool
        </CardTitle>
        <CardDescription>
          Translate existing content that's missing translations into Spanish, French, Vietnamese, and Portuguese.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress indicator */}
        {isRunning && currentTable && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Translating {tables.find(t => t.key === currentTable)?.label}...
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Table stats */}
        <div className="grid gap-4 md:grid-cols-2">
          {tables.map(table => {
            const tableStats = stats[table.key];
            const isActive = currentTable === table.key;
            
            return (
              <div 
                key={table.key} 
                className={`p-4 border rounded-lg space-y-3 ${isActive ? 'border-primary bg-primary/5' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{table.label}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => translateSingleTable(table.key)}
                    disabled={isRunning}
                  >
                    {isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {tableStats.total > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">
                      Total: {tableStats.total}
                    </Badge>
                    {tableStats.translated > 0 && (
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {tableStats.translated}
                      </Badge>
                    )}
                    {tableStats.failed > 0 && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {tableStats.failed}
                      </Badge>
                    )}
                    {tableStats.skipped > 0 && (
                      <Badge variant="outline">
                        Skipped: {tableStats.skipped}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Run all button */}
        <Button 
          onClick={runBatchTranslation} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Languages className="h-4 w-4 mr-2" />
              Translate All Content
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Note: This process may take several minutes depending on the amount of content. 
          Each item requires API calls for translation.
        </p>
      </CardContent>
    </Card>
  );
};
