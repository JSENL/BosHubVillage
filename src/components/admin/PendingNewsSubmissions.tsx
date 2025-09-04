
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewsSubmissionCard } from '@/components/NewsSubmissionCard';
import { 
  CheckCircle, 
  Newspaper,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PendingNewsSubmissionsProps {
  submissions: any[];
  onUpdate: () => void;
}

export const PendingNewsSubmissions = ({ submissions, onUpdate }: PendingNewsSubmissionsProps) => {
  const [actionLoading, setActionLoading] = useState(false);
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('news_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('News submission deleted successfully');
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
          <Newspaper className="h-5 w-5 mr-2 text-purple-600" />
          News Submissions ({pendingSubmissions.length} pending)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSubmissions.length === 0 ? (
          <div className="text-center p-8">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending news submissions to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {pendingSubmissions.map((submission) => (
              <div key={submission.id} className="relative">
                <NewsSubmissionCard
                  submission={submission}
                  onUpdate={onUpdate}
                />
                <div className="absolute top-3 right-3">
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
