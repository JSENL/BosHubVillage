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

const BusinessDetails = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { ownedBusinesses } = useBusinessOwnership();
  
  // Check if user owns this business
  const isOwner = ownedBusinesses?.some(b => b.id === businessId) || false;

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
  });

  const metaDescription = business
    ? richTextPlainText(business.short_description || business.description || '').slice(0, 160)
    : undefined;
  useDocumentHead(business?.title, metaDescription);

  if (isLoading) {
    return <DetailPageLoading />;
  }

  if (error || !business) {
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

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-3xl">{business.title}</CardTitle>
                    <BookmarkButton 
                      itemType="business" 
                      itemId={business.id} 
                      size="lg"
                      showText={true}
                    />
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="secondary">
                      <Building className="h-3 w-3 mr-1" />
                      {business.business_type}
                    </Badge>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {business.neighborhood}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{business.address}</span>
              </div>

              {business.short_description && (
                <p className="text-lg text-gray-700 font-medium">
                  {business.short_description}
                </p>
              )}

              {/* Website Link */}
              {business.website_link && (
                <div className="mb-4">
                  <a
                    href={business.website_link.startsWith('http') ? business.website_link : `https://${business.website_link}`}
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
                <RichTextContent html={business.description} />
              </div>


              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Added on {new Date(business.created_at).toLocaleDateString('en-US')}</span>
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