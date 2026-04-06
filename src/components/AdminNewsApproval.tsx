import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useNews } from '@/hooks/useNews';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NewsSubmission } from '@/types/submissions';
import { Clock, ChevronDown } from 'lucide-react';
import { PendingNewsSubmissions } from '@/components/admin/PendingNewsSubmissions';
import { PublishedNewsTable } from '@/components/admin/PublishedNewsTable';
import { cn } from '@/lib/utils';

const AdminNewsApproval = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [publishedOpen, setPublishedOpen] = useState(false);
  const [publishedRequested, setPublishedRequested] = useState(false);
  const {
    data: publishedNews,
    refetch: refetchPublished,
    isPending: publishedPending,
    isError: publishedQueryError,
    error: publishedQueryErrorObj,
  } = useNews({ enabled: publishedRequested });
  const [submissions, setSubmissions] = useState<NewsSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('news_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status field is properly typed
      const typedData = (data || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setSubmissions(typedData);
    } catch (error: any) {
      console.error('Error fetching news submissions:', error);
      toast.error(t('admin.failedLoadCultureSubmissions', 'Failed to load culture submissions'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>{t('admin.loadingCultureSubmissions', 'Loading culture submissions...')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PendingNewsSubmissions
        submissions={submissions}
        onUpdate={fetchSubmissions}
      />

      <Collapsible
        open={publishedOpen}
        onOpenChange={(open) => {
          setPublishedOpen(open);
          if (open) setPublishedRequested(true);
        }}
      >
        <Card>
          <CardContent className="p-4">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between font-medium"
              >
                {t(
                  'admin.publishedCultureSection',
                  'Published culture articles'
                )}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 opacity-70 transition-transform',
                    publishedOpen && 'rotate-180'
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              {publishedRequested && publishedPending && (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Clock className="h-8 w-8 animate-spin mb-3 text-purple-600" />
                  <p>{t('admin.loadingPublishedCulture', 'Loading published articles…')}</p>
                </div>
              )}
              {publishedRequested && !publishedPending && publishedQueryError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  {publishedQueryErrorObj?.message ||
                    t('admin.failedLoadPublishedCulture', 'Failed to load published articles.')}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => void refetchPublished()}
                  >
                    {t('common.retry', 'Retry')}
                  </Button>
                </div>
              )}
              {publishedRequested && !publishedPending && !publishedQueryError && (
                <PublishedNewsTable
                  news={publishedNews ?? []}
                  onUpdate={() => void refetchPublished()}
                />
              )}
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default AdminNewsApproval;
