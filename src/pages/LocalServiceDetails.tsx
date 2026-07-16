import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, ExternalLink, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CommentForm } from '@/components/comments/CommentForm';
import { GenericCommentsList } from '@/components/comments/GenericCommentsList';
import { useLocalResourceComments } from '@/hooks/useLocalResourceComments';
import { Navigation } from '@/components/Navigation';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { LinkedNewsSection } from '@/components/content/LinkedNewsSection';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { DetailPageLoading } from '@/components/common/DetailPageLoading';
import { RichTextContent } from '@/components/RichTextContent';
import { richTextPlainText } from '@/lib/richText';
import { ContentHeroImageEditor } from '@/components/content/ContentHeroImageEditor';
import { useSsrPrefetch } from '@/contexts/SsrPrefetchContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

const LocalResourceDetails = () => {
  const { serviceId } = useParams();
  const { user, isAdmin } = useAuth();
  const ssrPrefetch = useSsrPrefetch();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const ssrResource =
    ssrPrefetch?.type === 'local_resource' ? ssrPrefetch.data : null;
  
  // For local resources, only admins can edit links (no owner concept)
  const canEditLinks = isAdmin;

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
    initialData: ssrResource ?? undefined,
  });

  const resolvedResource = resource ?? ssrResource;

  useEffect(() => {
    if (resolvedResource?.id) {
      addToRecentlyViewed({
        itemType: 'local_service',
        itemId: String(resolvedResource.id),
      });
    }
  }, [addToRecentlyViewed, resolvedResource?.id]);

  const metaDescription = resolvedResource
    ? richTextPlainText(
        String(resolvedResource.description || resolvedResource.name || '')
      ).slice(0, 160)
    : undefined;
  useDocumentHead(
    resolvedResource ? String(resolvedResource.name) : undefined,
    metaDescription,
    {
      path: serviceId ? `/local-resource/${serviceId}` : undefined,
      imageUrl: (resolvedResource?.image_url as string | null) ?? null,
    }
  );

  const { 
    comments, 
    isLoading: commentsLoading, 
    addComment 
  } = useLocalResourceComments(serviceId as string);

  if (isLoading && !resolvedResource) {
    return <DetailPageLoading />;
  }

  if (!resolvedResource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Service Not Found</h3>
            <p className="text-gray-600">The local resource you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-8 px-4">
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <Button asChild variant="outline">
              <Link to="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Link>
            </Button>
          </div>
        )}

        <ContentHeroImageEditor
          table="local_resources"
          recordId={String(resolvedResource.id)}
          title={String(resolvedResource.name)}
          imageUrl={(resolvedResource.image_url as string | null) ?? null}
          canEdit={!!isAdmin}
          invalidateQueryKeys={[['local-resource-details', serviceId], ['local-resources']]}
          emptyStateHint="Admins can upload a hero image for this local resource."
        />
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl">{String(resolvedResource.name)}</CardTitle>
                  <BookmarkButton 
                    itemType="local_service" 
                    itemId={String(resolvedResource.id)} 
                    size="lg"
                    showText={true}
                  />
                </div>
                <Badge variant="secondary">
                  <Building className="h-3 w-3 mr-1" />
                  {String(resolvedResource.category)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{String(resolvedResource.address)}</span>
            </div>

            {resolvedResource.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <RichTextContent html={String(resolvedResource.description)} />
              </div>
            )}

            {resolvedResource.website_link && (
              <div>
                <a
                  href={String(resolvedResource.website_link).startsWith('http') ? String(resolvedResource.website_link) : `https://${resolvedResource.website_link}`}
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

        <div className="mt-8">
          <LinkedNewsSection 
            contentType="local_service"
            contentId={serviceId!}
            canEdit={canEditLinks}
          />
        </div>

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

export default LocalResourceDetails;