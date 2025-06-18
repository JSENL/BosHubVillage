
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Business } from '@/types/business';
import { Link } from 'react-router-dom';

const BusinessDetails = () => {
  const { businessId } = useParams();
  const { user } = useAuth();

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      return data as Business;
    },
    enabled: !!businessId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Loading business details...</div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Business not found</div>
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
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {business.title}
                </CardTitle>
                <Badge variant="secondary" className="mb-2">
                  <Building className="h-3 w-3 mr-1" />
                  {business.business_type}
                </Badge>
              </div>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {business.address}, {business.neighborhood}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {business.short_description && (
                <p className="text-lg text-gray-700 font-medium">
                  {business.short_description}
                </p>
              )}
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {business.description}
                </p>
              </div>
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

export default BusinessDetails;
