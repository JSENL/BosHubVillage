
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

const NewsDetails = () => {
  const { newsId } = useParams();
  const { user } = useAuth();

  const { data: news, isLoading } = useQuery({
    queryKey: ['news', newsId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error) throw error;
      return data as News;
    },
    enabled: !!newsId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Loading news article...</div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">News article not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
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
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
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

        {/* Comments section would go here */}
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Comments functionality coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsDetails;
