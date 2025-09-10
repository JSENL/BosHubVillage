
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    if (!startTime && !endTime) return '';
    if (startTime && endTime) {
      return ` from ${formatTime(startTime)} to ${formatTime(endTime)}`;
    }
    return startTime ? ` at ${formatTime(startTime)}` : endTime ? ` until ${formatTime(endTime)}` : '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="border border-border rounded-lg p-3 md:p-4 shadow-sm w-full bg-card">
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 pr-2">{submission.title}</h3>
            <Badge variant="outline" className="text-orange-600 border-orange-600 flex-shrink-0 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {t('admin.pending')}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">{submission.category}</Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="whitespace-nowrap">{formatDate(submission.date)}</span>
                <span className="hidden sm:inline">{formatTimeRange(submission.start_time, submission.end_time)}</span>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{submission.location}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {submission.price && submission.price > 0 && (
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  <span>${submission.price}</span>
                </div>
              )}
              {submission.max_attendees && (
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{t('cards.maxAttendees')}: </span>
                  <span>{submission.max_attendees}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {submission.description && (
        <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">{submission.description}</p>
      )}
      
      {selectedSubmission === submission.id ? (
        <div className="space-y-3 bg-muted/50 p-3 md:p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('admin.adminNotesOptional')}
            </label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t('admin.adminNotesPlaceholder')}
              rows={3}
              className="text-xs md:text-sm"
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
