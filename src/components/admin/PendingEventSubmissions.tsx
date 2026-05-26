
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin,
  DollarSign,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatDateOnly } from '@/utils/common/dateUtils';
import { useEventSubmissionOperations } from '@/hooks/useEventSubmissionOperations';

interface PendingEventSubmissionsProps {
  submissions: any[];
  onUpdate: () => void;
}

export const PendingEventSubmissions = ({ submissions, onUpdate }: PendingEventSubmissionsProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { updateSubmissionStatus } = useEventSubmissionOperations();

  const formatDate = (dateString: string) => {
    return formatDateOnly(dateString, 'en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  const handleApprove = async (submissionId: string) => {
    setActionLoading(true);
    try {
      await updateSubmissionStatus(submissionId, 'approved', adminNotes);
      onUpdate();
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      toast.error('Failed to approve event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (submissionId: string) => {
    setActionLoading(true);
    try {
      await updateSubmissionStatus(submissionId, 'rejected', adminNotes || 'Rejected by admin');
      onUpdate();
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      toast.error('Failed to reject event');
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
        .from('event_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('Event submission deleted successfully');
      // Reset any selected submission state to clean up UI
      setSelectedSubmission(null);
      setAdminNotes('');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Clock className="h-5 w-5 mr-2 text-orange-600" />
          Pending Approvals ({pendingSubmissions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSubmissions.length === 0 ? (
          <div className="text-center p-8">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending submissions to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {pendingSubmissions.map((submission) => (
              <div key={submission.id} className="border border-gray-200 rounded-lg p-3 shadow-sm w-full">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{submission.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(submission.date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {submission.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {submission.price === 0 ? 'Free' : `$${submission.price}`}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {submission.category}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">{submission.description}</p>
                
                {selectedSubmission === submission.id ? (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Message / Admin Notes
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        If rejecting, please explain why to help the submitter understand what needs to be improved.
                      </p>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="For rejections: Please explain why this submission cannot be approved (e.g., incomplete information, incorrect category, duplicate event, etc.)&#10;&#10;For approvals: Add any optional notes or feedback."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(submission.id)}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(submission.id)}
                        disabled={actionLoading}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        disabled={actionLoading}
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setSelectedSubmission(submission.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Review
                    </Button>
                    <Button
                      onClick={() => handleDeleteSubmission(submission.id)}
                      disabled={actionLoading}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
