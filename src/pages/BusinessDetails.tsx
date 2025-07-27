import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin, Building, Clock } from 'lucide-react';
import BusinessComments from '@/components/BusinessComments';

const BusinessDetails = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4" />
              <p>Loading business details...</p>
            </div>
          </div>
        </div>
      </>
    );
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
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">{business.title}</CardTitle>
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
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{business.description}</p>
              </div>

              {business.latitude && business.longitude && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <p className="text-sm text-gray-600">
                    Coordinates: {Number(business.latitude).toFixed(6)}, {Number(business.longitude).toFixed(6)}
                  </p>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Added {new Date(business.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

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