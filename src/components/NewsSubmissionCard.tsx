
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
    <div className="border border-border rounded-lg p-3 md:p-4 shadow-sm w-full bg-card">
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 pr-2 flex-1">{submission.title}</h3>
          <Badge variant="outline" className="text-orange-600 border-orange-600 flex-shrink-0 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {t('admin.pending')}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap">{formatDate(submission.date_posted)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{submission.location}</span>
            </div>
          </div>
          
          {submission.Address && (
            <div className="flex items-start text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{t('forms.address')}:</span> 
                <span className="ml-1 break-words">{submission.Address}</span>
              </div>
            </div>
          )}
          
          {submission.villages && submission.villages.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{t('cards.villages')}:</span> 
              <span className="ml-1">{submission.villages.join(', ')}</span>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">{t('cards.source')}: {submission.source}</p>
          
          {submission.latitude && submission.longitude && (
            <p className="text-xs text-green-600">
              📍 {t('cards.geocoded')}: {submission.latitude}, {submission.longitude}
            </p>
          )}
        </div>
      </div>
      
      <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">{submission.content}</p>
      
      {selectedSubmission === submission.id ? (
        <div className="space-y-3 bg-muted/50 p-3 md:p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('admin.rejectionMessage')}
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              {t('admin.rejectionHelp')}
            </p>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t('admin.rejectionPlaceholder')}
              rows={3}
              className="resize-none text-xs md:text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => handleStatusUpdate('approved')}
              disabled={actionLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('admin.approve')}
            </Button>
            <Button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={actionLoading}
              variant="destructive"
              size="sm"
              className="flex-1 sm:flex-none"
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
              size="sm"
              className="flex-1 sm:flex-none"
            >
              {t('forms.cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setSelectedSubmission(submission.id)}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
          size="sm"
        >
          {t('admin.review')}
        </Button>
      )}
    </div>
  );
};
