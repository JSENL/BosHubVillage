
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { updateSubmissionStatus, actionLoading } = useNewsSubmissionOperations();

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

  return (
    <div className="border border-gray-200 rounded-lg p-3 shadow-sm w-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900 line-clamp-2">{submission.title}</h3>
          <div className="flex flex-col gap-1 text-xs text-gray-600 mt-1">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(submission.date_posted)}
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{submission.location}</span>
            </div>
          </div>
          {submission.Address && (
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <Building2 className="h-3 w-3 mr-1" />
              <span className="font-medium">{t('forms.address')}:</span> 
              <span className="truncate ml-1">{submission.Address}</span>
            </div>
          )}
          {submission.villages && submission.villages.length > 0 && (
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <span className="font-medium">{t('cards.villages')}:</span> 
              <span className="truncate ml-1">{submission.villages.join(', ')}</span>
            </div>
          )}
          <p className="text-xs text-gray-600 mt-1">{t('cards.source')}: {submission.source}</p>
          {submission.latitude && submission.longitude && (
            <p className="text-xs text-green-600 mt-1">
              📍 {t('cards.geocoded')}: {submission.latitude}, {submission.longitude}
            </p>
          )}
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          <Clock className="h-3 w-3 mr-1" />
          {t('admin.pending')}
        </Badge>
      </div>
      
      <p className="text-gray-600 mb-3 line-clamp-2 text-xs">{submission.content}</p>
      
      {selectedSubmission === submission.id ? (
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.rejectionMessage')}
            </label>
            <p className="text-xs text-gray-500 mb-2">
              {t('admin.rejectionHelp')}
            </p>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t('admin.rejectionPlaceholder')}
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
              {t('admin.approve')}
            </Button>
            <Button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={actionLoading}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {t('admin.reject')}
            </Button>
            <Button
              onClick={() => {
                setSelectedSubmission(null);
                setAdminNotes('');
              }}
              variant="outline"
            >
              {t('forms.cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setSelectedSubmission(submission.id)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {t('admin.review')}
        </Button>
      )}
    </div>
  );
};
