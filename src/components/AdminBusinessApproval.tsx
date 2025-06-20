
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessSubmission } from '@/types/submissions';
import { BusinessSubmissionCard } from '@/components/BusinessSubmissionCard';
import { 
  CheckCircle, 
  Clock,
  Building,
  Trash2,
  MapPin
} from 'lucide-react';

const AdminBusinessApproval = () => {
  const { isAdmin } = useAuth();
  const { data: businesses, refetch: refetchBusinesses } = useBusiness();
  const [submissions, setSubmissions] = useState<BusinessSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubmissions = async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('business_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status field is properly typed
      const typedData = (data || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setSubmissions(typedData);
    } catch (error: any) {
      console.error('Error fetching business submissions:', error);
      toast.error('Failed to load business submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('business')
        .delete()
        .eq('id', businessId);

      if (error) throw error;

      toast.success('Business deleted successfully');
      refetchBusinesses();
    } catch (error: any) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('business_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('Submission deleted successfully');
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    } finally {
      setActionLoading(false);
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
          <p>Loading business submissions...</p>
        </CardContent>
      </Card>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Building className="h-5 w-5 mr-2 text-purple-600" />
            Business Submissions ({pendingSubmissions.length} pending)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending business submissions to review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="relative">
                  <BusinessSubmissionCard
                    submission={submission}
                    onUpdate={fetchSubmissions}
                  />
                  <div className="absolute top-4 right-4">
                    <Button
                      onClick={() => handleDeleteSubmission(submission.id)}
                      disabled={actionLoading}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Published Businesses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Building className="h-5 w-5 mr-2 text-purple-600" />
            Published Businesses ({businesses?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!businesses || businesses.length === 0 ? (
            <div className="text-center p-8">
              <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Published Businesses</h3>
              <p className="text-gray-600">Published businesses will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Neighborhood</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{business.title}</div>
                        <div className="text-sm text-gray-500">{business.short_description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{business.business_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {business.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{business.neighborhood}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDeleteBusiness(business.id)}
                        disabled={actionLoading}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBusinessApproval;
