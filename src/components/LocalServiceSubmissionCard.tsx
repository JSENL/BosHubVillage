
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Building, Check, X, Clock } from 'lucide-react';
import { LocalResourceSubmission } from '@/types/localresources';
import { SubmissionStatusBadge } from '@/components/SubmissionStatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { uselocalresourcesubmissionOperations } from '@/hooks/useLocalServiceSubmissionOperations';
import { richTextPlainText } from '@/lib/richText';

interface localresourcesubmissionCardProps {
  submission: LocalResourceSubmission;
  onUpdate: () => void;
}

const localresourcesubmissionCard = ({ submission, onUpdate }: localresourcesubmissionCardProps) => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { updateSubmissionStatus, actionLoading } = uselocalresourcesubmissionOperations();

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
    } catch {
      // Toast handled in hook
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
            {submission.name}
          </CardTitle>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant="secondary" className="flex-shrink-0 text-xs">
              <Building className="h-3 w-3 mr-1" />
              {submission.category}
            </Badge>
            <SubmissionStatusBadge status={submission.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-2">
        <div className="flex items-start text-gray-600">
          <MapPin className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="truncate">{submission.address}</p>
            <p className="text-xs text-gray-500">
              {submission.neighborhood}
              {submission.village && `, ${submission.village}`}
            </p>
          </div>
        </div>
        
        {submission.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {richTextPlainText(submission.description)}
          </p>
        )}
        
        <div className="pt-1 border-t">
          <p className="text-xs text-gray-500">
            {t('admin.submittedOn')} {formatDate(submission.created_at)}
          </p>
        </div>

        {isAdmin && submission.status === 'pending' && (
          selectedSubmission === submission.id ? (
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
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {t('admin.approve')}
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={actionLoading}
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('admin.reject')}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setAdminNotes('');
                  }}
                  size="sm"
                  variant="outline"
                >
                  {t('forms.cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2 pt-3 border-t">
              <Button
                onClick={() => setSelectedSubmission(submission.id)}
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {t('admin.review')}
              </Button>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default localresourcesubmissionCard;
