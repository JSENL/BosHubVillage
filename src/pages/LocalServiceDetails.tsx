import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CommentForm } from '@/components/comments/CommentForm';
import { GenericCommentsList } from '@/components/comments/GenericCommentsList';
import { useLocalResourceComments } from '@/hooks/useLocalResourceComments';
import { Navigation } from '@/components/Navigation';

const LocalServiceDetails = () => {
  const { serviceId } = useParams();
  const { user, isAdmin } = useAuth();

  const { data: resource, isLoading } = useQuery({
    queryKey: ['local-resource-details', serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_resources')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!serviceId
  });

  const { 
    comments, 
    isLoading: commentsLoading, 
    addComment 
  } = useLocalResourceComments(serviceId as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Service Not Found</h3>
            <p className="text-gray-600">The local service you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{resource.name}</CardTitle>
              <Badge variant="secondary">
                <Building className="h-3 w-3 mr-1" />
                {resource.category}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{resource.address}</span>
            </div>

            {resource.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700">{resource.description}</p>
              </div>
            )}

            {resource.website_link && (
              <div>
                <a
                  href={resource.website_link.startsWith('http') ? resource.website_link : `https://${resource.website_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {user && (
          <div className="mt-8">
            <CommentForm 
              user={user}
              onSubmitComment={(content, rating) => addComment(content, rating)}
            />
          </div>
        )}

        <div className="mt-6">
          <GenericCommentsList 
            comments={comments || []}
            loading={commentsLoading}
            user={user}
            isAdmin={isAdmin}
            onDeleteComment={async () => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default LocalServiceDetails;