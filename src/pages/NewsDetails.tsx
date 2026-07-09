import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ExternalLink, ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { News } from '@/types/news';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import NewsComments from '@/components/NewsComments';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { useTranslation } from 'react-i18next';
import { LinkedContentSection } from '@/components/content/LinkedContentSection';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { DetailPageLoading } from '@/components/common/DetailPageLoading';
import { RichTextContent } from '@/components/RichTextContent';
import { richTextPlainText } from '@/lib/richText';
import { useSsrPrefetch } from '@/contexts/SsrPrefetchContext';
import { NewsSubmitterLine } from '@/components/news/NewsSubmitterLine';

const NewsDetails = () => {
  const { newsId } = useParams();
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const ssrPrefetch = useSsrPrefetch();
  const ssrNews =
    ssrPrefetch?.type === 'news' ? (ssrPrefetch.data as News) : null;

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', newsId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!newsId,
    initialData: ssrNews ?? undefined,
  });

  const resolvedNews = news ?? ssrNews;

  const metaDescription = resolvedNews
    ? richTextPlainText(resolvedNews.content || resolvedNews.title || '').slice(0, 160)
    : undefined;
  useDocumentHead(resolvedNews?.title, metaDescription, {
    path: newsId ? `/news/${newsId}` : undefined,
    imageUrl: resolvedNews?.image_url,
  });

  if (isLoading && !resolvedNews) {
    return <DetailPageLoading />;
  }

  if (error || !resolvedNews) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{t('pages.articleNotFound')}</h3>
            <p className="text-gray-600 mb-4">{t('pages.articleNotFoundDesc')}</p>
            <Link to="/">
              <Button>{t('pages.backToHome')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('pages.backToNews')}
            </Button>
          </Link>
          
          {isAdmin && (
            <Button asChild variant="outline">
              <Link to="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Link>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-3xl">{resolvedNews.title}</CardTitle>
              <BookmarkButton 
                itemType="news" 
                itemId={resolvedNews.id} 
                size="lg"
                showText={true}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(resolvedNews.date_posted).toLocaleDateString('en-US')}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{resolvedNews.location}</span>
              </div>
              
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                <span>{resolvedNews.source}</span>
              </div>
            </div>

            <NewsSubmitterLine article={resolvedNews} className="text-sm" />
          </CardHeader>
          
          <CardContent>
            {resolvedNews.image_url && (
              <div className="mb-6">
                <img 
                  src={resolvedNews.image_url} 
                  alt={resolvedNews.title} 
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
            )}
            <RichTextContent html={resolvedNews.content} className="leading-relaxed" />
          </CardContent>
        </Card>

        <div className="mt-8">
          <LinkedContentSection newsId={resolvedNews.id} />
        </div>

        <div className="mt-8">
          <NewsComments newsId={resolvedNews.id} />
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;