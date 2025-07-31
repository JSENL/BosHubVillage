
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { NewsSubmission } from '@/types/submissions';
import { useNewsSubmissionOperations } from '@/hooks/useNewsSubmissionOperations';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin,
  Building2
} from 'lucide-react';

interface NewsSubmissionCardProps {
  submission: NewsSubmission;
  onUpdate: () => void;
}

export const NewsSubmissionCard = ({ submission, onUpdate }: NewsSubmissionCardProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { updateSubmissionStatus, actionLoading } = useNewsSubmissionOperations();

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    try {
      await updateSubmissionStatus(submission.id, status, adminNotes);
      setSelectedSubmission(null);
      setAdminNotes('');
      onUpdate();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{submission.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(submission.date_posted).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {submission.location}
            </div>
          </div>
          {submission.Address && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="font-medium">Address:</span> {submission.Address}
            </div>
          )}
          {submission.villages && submission.villages.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span className="font-medium">Villages:</span> {submission.villages.join(', ')}
            </div>
          )}
          <p className="text-sm text-gray-600 mt-1">Source: {submission.source}</p>
          {submission.latitude && submission.longitude && (
            <p className="text-xs text-green-600 mt-1">
              📍 Geocoded: {submission.latitude}, {submission.longitude}
            </p>
          )}
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{submission.content}</p>
      
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
              placeholder="For rejections: Please explain why this submission cannot be approved (e.g., inappropriate content, inaccurate information, duplicate news, etc.)&#10;&#10;For approvals: Add any optional notes or feedback."
              rows={4}
              className="resize-none"
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
