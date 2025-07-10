
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { News } from '@/types/news';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import NewsComments from '@/components/NewsComments';

const NewsDetails = () => {
  const { newsId } = useParams();
  const { user } = useAuth();

  console.log('NewsDetails - newsId:', newsId);

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', newsId],
    queryFn: async () => {
      console.log('Fetching news with ID:', newsId);
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
      
      console.log('Fetched news data:', data);
      
      if (!data) {
        console.log('No news found with ID:', newsId);
        return null;
      }
      
      // Parse villages field safely - handle both string and JSON formats
      let parsedVillages = null;
      if (data.villages) {
        try {
          // If it's already an array, use it as is
          if (Array.isArray(data.villages)) {
            parsedVillages = data.villages;
          } else if (typeof data.villages === 'string') {
            // Try to parse as JSON first
            try {
              parsedVillages = JSON.parse(data.villages);
            } catch {
              // If JSON parsing fails, treat as comma-separated string
              parsedVillages = data.villages.split(',').map(v => v.trim());
            }
          }
        } catch (error) {
          console.warn('Could not parse villages field:', error);
          parsedVillages = null;
        }
      }
      
      const newsWithParsedVillages = {
        ...data,
        villages: parsedVillages
      };
      
      return newsWithParsedVillages as News;
    },
    enabled: !!newsId,
  });

  console.log('NewsDetails - news:', news);
  console.log('NewsDetails - isLoading:', isLoading);
  console.log('NewsDetails - error:', error);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600">Error loading news article: {error.message}</p>
            <Link to="/news-page">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">News article not found</p>
            <p className="text-gray-500 text-sm mt-2">The article you're looking for doesn't exist or may have been removed.</p>
            <Link to="/news-page">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/news-page">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {news.title}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(news.date_posted), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {news.location}
              </div>
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                {news.source}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {news.content}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Badge variant="outline">
                Source: {news.source}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {user && (
          <Card>
            <CardContent className="p-8">
              <NewsComments newsId={news.id} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewsDetails;
