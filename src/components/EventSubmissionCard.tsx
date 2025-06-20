
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { EventSubmission } from '@/hooks/useEventSubmissions';
import { useEventSubmissionOperations } from '@/hooks/useEventSubmissionOperations';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin,
  DollarSign,
  Users
} from 'lucide-react';

interface EventSubmissionCardProps {
  submission: EventSubmission;
  onUpdate: () => void;
}

export const EventSubmissionCard = ({ submission, onUpdate }: EventSubmissionCardProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { updateSubmissionStatus } = useEventSubmissionOperations();

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    try {
      setActionLoading(true);
      await updateSubmissionStatus(submission.id, status, adminNotes);
      setSelectedSubmission(null);
      setAdminNotes('');
      onUpdate();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setActionLoading(false);
    }
  };

  const formatTimeRange = (startTime: string | null, endTime: string | null) => {
    if (!startTime && !endTime) return '';
    if (startTime && endTime) {
      return ` from ${startTime} to ${endTime}`;
    }
    return startTime ? ` at ${startTime}` : endTime ? ` until ${endTime}` : '';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{submission.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <Badge variant="secondary">{submission.category}</Badge>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(submission.date).toLocaleDateString()}
              {formatTimeRange(submission.start_time, submission.end_time)}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {submission.location}
            </div>
            {submission.price && submission.price > 0 && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                ${submission.price}
              </div>
            )}
            {submission.max_attendees && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Max: {submission.max_attendees}
              </div>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      </div>
      
      {submission.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">{submission.description}</p>
      )}
      
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
              onClick={() => handleStatusUpdate('approved')}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => handleStatusUpdate('rejected')}
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
  );
};
