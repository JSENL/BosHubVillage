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
    enabled: !!serviceId,
  });

  const {
    comments,
    isLoading: commentsLoading,
    addComment,
    replyToComment,
    deleteComment,
    isAddingComment
  } = useLocalResourceComments(serviceId!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Loading service details...</div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="max-w-4xl mx-auto space-y-6 p-4">

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {resource.name}
                </CardTitle>
                <Badge variant="secondary" className="mb-2">
                  <Building className="h-3 w-3 mr-1" />
                  {resource.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {resource.address}, {resource.neighborhood}
              {resource.village && ` - ${resource.village}`}
            </div>

            {/* Website Link */}
            {resource.website_link && (
              <div className="mb-4">
                <a
                  href={resource.website_link.startsWith('http') ? resource.website_link : `https://${resource.website_link}`}
                  className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resource.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Comments & Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <CommentForm
                user={user}
                onSubmitComment={addComment}
              />
            )}
            
            <GenericCommentsList
              comments={comments}
              loading={commentsLoading}
              user={user}
              isAdmin={isAdmin}
              onDeleteComment={deleteComment}
              onReplyToComment={replyToComment}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocalServiceDetails;