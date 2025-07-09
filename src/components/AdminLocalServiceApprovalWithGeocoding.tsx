
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalServices } from '@/hooks/useLocalServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LocalResourceSubmission } from '@/types/localServices';
import { Clock, Heart } from 'lucide-react';
import { GeocodeAllLocalServicesButton } from '@/components/GeocodeAllLocalServicesButton';
import { DeleteAllLocalResourcesButton } from '@/components/admin/DeleteAllLocalResourcesButton';
import { PublishedLocalResourcesTable } from '@/components/admin/PublishedLocalResourcesTable';
import LocalServiceSubmissionCard from '@/components/LocalServiceSubmissionCard';

const AdminLocalResourceApprovalWithGeocoding = () => {
  const { isAdmin } = useAuth();
  const { data: localResources, refetch: refetchLocalResources } = useLocalServices();
  const [submissions, setSubmissions] = useState<LocalResourceSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('local_resources_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setSubmissions(typedData);
    } catch (error: any) {
      console.error('Error fetching local resource submissions:', error);
      toast.error('Failed to load local resource submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading local resource submissions...</p>
        </CardContent>
      </Card>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Local Resources Management</h2>
        <div className="flex space-x-2">
          <GeocodeAllLocalServicesButton />
          <DeleteAllLocalResourcesButton 
            localResourceCount={localResources?.length || 0}
            onUpdate={refetchLocalResources}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Heart className="h-5 w-5 mr-2 text-purple-600" />
            Local Resource Submissions ({pendingSubmissions.length} pending)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending local resource submissions to review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <LocalServiceSubmissionCard
                  key={submission.id}
                  submission={submission}
                  onUpdate={fetchSubmissions}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PublishedLocalResourcesTable 
        localResources={localResources || []} 
        onUpdate={refetchLocalResources} 
      />
    </div>
  );
};

export default AdminLocalResourceApprovalWithGeocoding;
