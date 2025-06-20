import { useState } from 'react';
import { useEventSubmissions } from '@/hooks/useEventSubmissions';
import { useEvents } from '@/hooks/useEvents';
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
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin,
  DollarSign,
  Users,
  MessageSquare,
  Trash2,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { EditEventDialog } from '@/components/admin/EditEventDialog';

const AdminEventApproval = () => {
  const { submissions, loading, updateSubmissionStatus } = useEventSubmissions();
  const { events, fetchEvents } = useEvents();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const reviewedSubmissions = submissions.filter(s => s.status !== 'pending');

  const handleApprove = async (submissionId: string) => {
    setActionLoading(true);
    try {
      await updateSubmissionStatus(submissionId, 'approved', adminNotes);
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
      await updateSubmissionStatus(submissionId, 'rejected', adminNotes);
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      toast.error('Failed to reject event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
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

      toast.success('Submission deleted successfully');
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading submissions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Submissions */}
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
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{submission.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(submission.date).toLocaleDateString()}
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

      {/* Published Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Published Events ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center p-8">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Published Events</h3>
              <p className="text-gray-600">Published events will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingEvent(event)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={actionLoading}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recently Reviewed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <MessageSquare className="h-5 w-5 mr-2" />
            Recently Reviewed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewedSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600">Reviewed submissions will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewedSubmissions.slice(0, 10).map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.title}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {submission.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(submission.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(submission.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {submission.admin_notes || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        disabled={actionLoading}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
          onUpdate={fetchEvents}
        />
      )}
    </div>
  );
};

export default AdminEventApproval;
