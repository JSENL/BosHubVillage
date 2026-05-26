import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { richTextPlainText } from '@/lib/richText';

interface BusinessSubmissionCardProps {
  submission: BusinessSubmission;
  onUpdate: () => void;
}

export const BusinessSubmissionCard = ({ submission, onUpdate }: BusinessSubmissionCardProps) => {
  const { t } = useTranslation();
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
            {t('admin.approved')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            {t('admin.rejected')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="h-3 w-3 mr-1" />
            {t('admin.pending')}
          </Badge>
        );
    }
  };

  return (
    <div className="border border-border rounded-lg p-3 md:p-4 shadow-sm w-full bg-card">
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 pr-2 flex-1">{submission.title}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">{submission.business_type}</Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{submission.neighborhood}</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground truncate">{submission.address}</p>
          {submission.latitude && submission.longitude && (
            <p className="text-xs text-muted-foreground/70">
              {t('cards.coordinates')}: {Number(submission.latitude).toFixed(4)}, {Number(submission.longitude).toFixed(4)}
            </p>
          )}
        </div>
      </div>
      
      {submission.short_description && (
        <p className="text-muted-foreground mb-2 font-medium text-xs line-clamp-1">{submission.short_description}</p>
      )}
      <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">{richTextPlainText(submission.description)}</p>

      {submission.status === 'approved' && submission.is_owner && (
        <Button variant="secondary" disabled className="mt-2">
          {t('admin.submitterIsOwner')}
        </Button>
      )}

      {submission.admin_notes && (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{t('admin.adminNotes')}:</span> {submission.admin_notes}
          </p>
        </div>
      )}
      
      {submission.status === 'pending' && (
        selectedSubmission === submission.id ? (
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
        )
      )}
    </div>
  );
};