
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalServiceSubmissions } from '@/hooks/useLocalServiceSubmissions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Building, 
  Calendar,
  User
} from 'lucide-react';
import { LocalServiceSubmission } from '@/types/localServices';

const AdminLocalServiceApproval = () => {
  const { data: submissions, isLoading, refetch } = useLocalServiceSubmissions();
  const { user } = useAuth();

  const handleApprove = async (submission: LocalServiceSubmission) => {
    try {
      // First, insert into the main local_services_nonprofits table
      const { error: insertError } = await supabase
        .from('local_services_nonprofits')
        .insert({
          name: submission.name,
          category: submission.category,
          address: submission.address,
          neighborhood: submission.neighborhood,
          village: submission.village,
          description: submission.description,
          latitude: submission.latitude,
          longitude: submission.longitude,
        });

      if (insertError) throw insertError;

      // Then update the submission status
      const { error: updateError } = await supabase
        .from('local_services_nonprofits_submissions')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      toast.success('Local service approved successfully!');
      refetch();
    } catch (error: any) {
      console.error('Error approving local service:', error);
      toast.error('Failed to approve local service: ' + error.message);
    }
  };

  const handleReject = async (submission: LocalServiceSubmission) => {
    try {
      const { error } = await supabase
        .from('local_services_nonprofits_submissions')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast.success('Local service rejected successfully!');
      refetch();
    } catch (error: any) {
      console.error('Error rejecting local service:', error);
      toast.error('Failed to reject local service: ' + error.message);
    }
  };

  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') || [];
  const reviewedSubmissions = submissions?.filter(s => s.status !== 'pending') || [];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading local service submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Local Service Submissions</h2>
        
        {pendingSubmissions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-500" />
              Pending Approval ({pendingSubmissions.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingSubmissions.map((submission) => (
                <Card key={submission.id} className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-start justify-between">
                      <span className="line-clamp-2">{submission.name}</span>
                      <Badge variant="outline" className="text-orange-600 border-orange-600 ml-2">
                        <Building className="h-3 w-3 mr-1" />
                        {submission.category}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p>{submission.address}</p>
                        <p className="text-xs text-gray-500">
                          {submission.neighborhood}
                          {submission.village && `, ${submission.village}`}
                        </p>
                      </div>
                    </div>
                    
                    {submission.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {submission.description}
                      </p>
                    )}
                    
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-3 border-t">
                      <Button
                        onClick={() => handleApprove(submission)}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(submission)}
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {reviewedSubmissions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recently Reviewed ({reviewedSubmissions.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviewedSubmissions.slice(0, 6).map((submission) => (
                <Card key={submission.id} className={`${
                  submission.status === 'approved' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-start justify-between">
                      <span className="line-clamp-2">{submission.name}</span>
                      <Badge 
                        variant={submission.status === 'approved' ? 'default' : 'destructive'}
                        className="ml-2"
                      >
                        {submission.status === 'approved' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {submission.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p>{submission.address}</p>
                        <p className="text-xs text-gray-500">
                          {submission.neighborhood}
                          {submission.village && `, ${submission.village}`}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Reviewed {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {submissions?.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-500">Local service submissions will appear here for review.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLocalServiceApproval;
