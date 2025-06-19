
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessSubmission } from '@/types/submissions';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin,
  Building
} from 'lucide-react';

const AdminBusinessApproval = () => {
  const { user, isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<BusinessSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
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

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected') => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('business_submissions')
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`Business ${status} successfully!`);
      setSelectedSubmission(null);
      setAdminNotes('');
      fetchSubmissions();
    } catch (error: any) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} business:`, error);
      toast.error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} business`);
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
              <div key={submission.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{submission.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <Badge variant="secondary">{submission.business_type}</Badge>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {submission.neighborhood}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{submission.address}</p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
                
                {submission.short_description && (
                  <p className="text-gray-600 mb-2 font-medium">{submission.short_description}</p>
                )}
                <p className="text-gray-600 mb-4 line-clamp-3">{submission.description}</p>
                
                {selectedSubmission === submission.id ? (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes (Optional)
                      </label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add any notes for the submitter..."
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                        disabled={actionLoading}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedSubmission(null);
                          setAdminNotes('');
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setSelectedSubmission(submission.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Review
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBusinessApproval;
