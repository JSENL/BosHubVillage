
import { useState } from 'react';
import { useEventSubmissions, EventSubmission } from '@/hooks/useEventSubmissions';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  DollarSign,
  Users,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

const AdminEventApproval = () => {
  const { submissions, loading, updateSubmissionStatus } = useEventSubmissions();
  const { isAdmin } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<EventSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <XCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </CardContent>
      </Card>
    );
  }

  const handleApproveEvent = async (submissionId: string) => {
    try {
      await updateSubmissionStatus(submissionId, 'approved', adminNotes);
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleRejectEvent = async (submissionId: string) => {
    if (!adminNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    try {
      await updateSubmissionStatus(submissionId, 'rejected', adminNotes);
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const reviewedSubmissions = submissions.filter(s => s.status !== 'pending');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Event Approval Dashboard
          </CardTitle>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Pending: {pendingSubmissions.length}</span>
            <span>Total Submissions: {submissions.length}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Pending Submissions */}
      {pendingSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-yellow-600 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Approval ({pendingSubmissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.title}</div>
                        <div className="text-sm text-gray-500">{submission.description?.substring(0, 60)}...</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{submission.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(submission.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {submission.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(submission.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Reviewed Submissions */}
      {reviewedSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-600">
              Reviewed Submissions ({reviewedSubmissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewedSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="font-medium">{submission.title}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(submission.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(submission.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {submission.admin_notes || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-xl">Review Event Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedSubmission.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedSubmission.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(selectedSubmission.date).toLocaleDateString()}
                    {selectedSubmission.time && ` at ${selectedSubmission.time}`}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedSubmission.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${selectedSubmission.price}
                  </div>
                  {selectedSubmission.max_attendees && (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      Max {selectedSubmission.max_attendees} attendees
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="adminNotes" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Admin Notes
                </Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add notes about your decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleApproveEvent(selectedSubmission.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleRejectEvent(selectedSubmission.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(null);
                    setAdminNotes('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {submissions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
            <p className="text-gray-600">Event submissions will appear here for review.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminEventApproval;
