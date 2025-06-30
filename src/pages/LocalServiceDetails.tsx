
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const LocalResourceDetails = () => {
  const { serviceId } = useParams();
  const { user } = useAuth();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Loading resource details...</div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Resource not found</div>
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
      </div>
    </div>
  );
};

export default LocalResourceDetails;
