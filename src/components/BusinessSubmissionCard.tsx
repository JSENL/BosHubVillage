import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BusinessSubmission } from '@/types/submissions';
import { useBusinessSubmissionOperations } from '@/hooks/useBusinessSubmissionOperations';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin
} from 'lucide-react';

interface BusinessSubmissionCardProps {
  submission: BusinessSubmission;
  onUpdate: () => void;
}

export const BusinessSubmissionCard = ({ submission, onUpdate }: BusinessSubmissionCardProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { updateSubmissionStatus, actionLoading } = useBusinessSubmissionOperations();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

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

  const getStatusBadge = () => {
    switch (submission.status) {
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 shadow-sm w-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900 line-clamp-2">{submission.title}</h3>
          <div className="flex flex-col gap-1 text-xs text-gray-600 mt-1">
            <Badge variant="secondary" className="w-fit text-xs">{submission.business_type}</Badge>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{submission.neighborhood}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1 truncate">{submission.address}</p>
          {submission.latitude && submission.longitude && (
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {Number(submission.latitude).toFixed(6)}, {Number(submission.longitude).toFixed(6)}
            </p>
          )}
        </div>
        {getStatusBadge()}
      </div>
      
      {submission.short_description && (
        <p className="text-gray-600 mb-2 font-medium text-xs line-clamp-1">{submission.short_description}</p>
      )}
      <p className="text-gray-600 mb-3 line-clamp-2 text-xs">{submission.description}</p>

      {submission.admin_notes && (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Admin Notes:</span> {submission.admin_notes}
          </p>
        </div>
      )}
      
      {submission.status === 'pending' && (
        selectedSubmission === submission.id ? (
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
                placeholder="For rejections: Please explain why this submission cannot be approved (e.g., incomplete information, incorrect category, duplicate listing, etc.)&#10;&#10;For approvals: Add any optional notes or feedback."
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
        )
      )}
    </div>
  );
};