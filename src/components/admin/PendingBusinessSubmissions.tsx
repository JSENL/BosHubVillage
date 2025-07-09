
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BusinessSubmissionCard } from '@/components/BusinessSubmissionCard';
import { 
  CheckCircle, 
  Building,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSubmission } from '@/types/submissions';

interface PendingBusinessSubmissionsProps {
  submissions: BusinessSubmission[];
  onUpdate: () => void;
}

export const PendingBusinessSubmissions = ({ submissions, onUpdate }: PendingBusinessSubmissionsProps) => {
  const [actionLoading, setActionLoading] = useState(false);
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('business_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('Submission deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Building className="h-5 w-5 mr-2 text-purple-600" />
          Business Submissions ({pendingSubmissions.length} pending)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSubmissions.length === 0 ? (
          <div className="text-center p-8">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending business submissions to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSubmissions.map((submission) => (
              <div key={submission.id} className="relative">
                <BusinessSubmissionCard
                  submission={submission}
                  onUpdate={onUpdate}
                />
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={() => handleDeleteSubmission(submission.id)}
                    disabled={actionLoading}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
