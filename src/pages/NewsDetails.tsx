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

const NewsDetails = () => {
  const { newsId } = useParams();
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();

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
    enabled: !!newsId
  });

  const metaDescription = news
    ? richTextPlainText(news.content || news.title || '').slice(0, 160)
    : undefined;
  useDocumentHead(news?.title, metaDescription);

  if (isLoading) {
    return <DetailPageLoading />;
  }

  if (error || !news) {
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
              <CardTitle className="text-3xl">{news.title}</CardTitle>
              <BookmarkButton 
                itemType="news" 
                itemId={news.id} 
                size="lg"
                showText={true}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(news.date_posted).toLocaleDateString('en-US')}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{news.location}</span>
              </div>
              
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                <span>{news.source}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {news.image_url && (
              <div className="mb-6">
                <img 
                  src={news.image_url} 
                  alt={news.title} 
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
            )}
            <RichTextContent html={news.content} className="leading-relaxed" />
          </CardContent>
        </Card>

        <div className="mt-8">
          <LinkedContentSection newsId={news.id} />
        </div>

        <div className="mt-8">
          <NewsComments newsId={news.id} />
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;