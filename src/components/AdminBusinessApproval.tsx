
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessSubmission } from '@/types/submissions';
import { BusinessSubmissionCard } from '@/components/BusinessSubmissionCard';
import { 
  CheckCircle, 
  Clock,
  Building
} from 'lucide-react';

const AdminBusinessApproval = () => {
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<BusinessSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('business_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status field is properly typed
      const typedData = (data || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setSubmissions(typedData);
    } catch (error: any) {
      console.error('Error fetching business submissions:', error);
      toast.error('Failed to load business submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading business submissions...</p>
        </CardContent>
      </Card>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

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
              <BusinessSubmissionCard
                key={submission.id}
                submission={submission}
                onUpdate={fetchSubmissions}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBusinessApproval;
