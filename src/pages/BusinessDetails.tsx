import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Building, Clock, ExternalLink, Settings } from 'lucide-react';
import BusinessComments from '@/components/BusinessComments';
import BusinessMessage from '@/components/BusinessMessage';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { LinkedNewsSection } from '@/components/content/LinkedNewsSection';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessOwnership } from '@/hooks/useBusinessOwnership';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { DetailPageLoading } from '@/components/common/DetailPageLoading';
import { RichTextContent } from '@/components/RichTextContent';
import { richTextPlainText } from '@/lib/richText';
import { ContentHeroImageEditor } from '@/components/content/ContentHeroImageEditor';
import { BusinessStructuredData } from '@/components/seo/StructuredData';
import { useSsrPrefetch } from '@/contexts/SsrPrefetchContext';

const BusinessDetails = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const ssrPrefetch = useSsrPrefetch();
  const ssrBusiness = ssrPrefetch?.type === 'business' ? ssrPrefetch.data : null;
  const { user, isAdmin } = useAuth();
  const { ownedBusinesses } = useBusinessOwnership();
  
  // Check if user owns this business
  const isOwner = ownedBusinesses?.some(b => b.id === businessId) || false;
  const canEditCover = isOwner || isAdmin;

  const { data: business, isLoading, error } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      if (!businessId) throw new Error('Business ID is required');
      
      const { data, error } = await supabase
        .from('business')
        .select('*')
        .eq('id', businessId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Business not found');
      
      return data as Business;
    },
    enabled: !!businessId,
    initialData: ssrBusiness ?? undefined,
  });

  const resolvedBusiness = business ?? ssrBusiness;

  const metaDescription = resolvedBusiness
    ? richTextPlainText(
        resolvedBusiness.short_description || resolvedBusiness.description || ''
      ).slice(0, 160)
    : undefined;
  useDocumentHead(resolvedBusiness?.title, metaDescription, {
    path: businessId ? `/business/${businessId}` : undefined,
    imageUrl: resolvedBusiness?.image_url,
  });

  if (isLoading && !resolvedBusiness) {
    return <DetailPageLoading />;
  }

  if (error || !resolvedBusiness) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Business Not Found</h3>
                <p className="text-gray-600 mb-4">The business you're looking for doesn't exist.</p>
                <Button onClick={() => navigate('/')}>Go Home</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BusinessStructuredData
        business={{
          id: resolvedBusiness.id,
          title: resolvedBusiness.title,
          description: resolvedBusiness.description,
          address: resolvedBusiness.address,
          neighborhood: resolvedBusiness.neighborhood,
          business_type: resolvedBusiness.business_type,
          website_link: resolvedBusiness.website_link,
          image_url: resolvedBusiness.image_url,
        }}
      />
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
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
            table="business"
            recordId={resolvedBusiness.id}
            title={resolvedBusiness.title}
            imageUrl={resolvedBusiness.image_url}
            canEdit={canEditCover}
            invalidateQueryKeys={[['business', businessId]]}
            emptyStateHint="Business owners and admins can upload a hero image for this listing."
          />

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-3xl">{resolvedBusiness.title}</CardTitle>
                    <BookmarkButton 
                      itemType="business" 
                      itemId={resolvedBusiness.id} 
                      size="lg"
                      showText={true}
                    />
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="secondary">
                      <Building className="h-3 w-3 mr-1" />
                      {resolvedBusiness.business_type}
                    </Badge>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {resolvedBusiness.neighborhood}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{resolvedBusiness.address}</span>
              </div>

              {resolvedBusiness.short_description && (
                <p className="text-lg text-gray-700 font-medium">
                  {resolvedBusiness.short_description}
                </p>
              )}

              {/* Website Link */}
              {resolvedBusiness.website_link && (
                <div className="mb-4">
                  <a
                    href={resolvedBusiness.website_link.startsWith('http') ? resolvedBusiness.website_link : `https://${resolvedBusiness.website_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <RichTextContent html={resolvedBusiness.description} />
              </div>


              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Added on {new Date(resolvedBusiness.created_at).toLocaleDateString('en-US')}</span>
              </div>

              <div className="mt-4">
                <BusinessMessage businessId={businessId!} />
              </div>
            </CardContent>
          </Card>

          {/* Related culture section */}
          <div className="mt-6">
            <LinkedNewsSection 
              contentType="business" 
              contentId={businessId!}
              canEdit={isOwner || isAdmin}
            />
          </div>

          <Card className="mt-6">
            <CardContent className="p-6">
              <BusinessComments businessId={businessId!} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BusinessDetails;