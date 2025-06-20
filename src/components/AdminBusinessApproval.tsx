
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessSubmission } from '@/types/submissions';
import { Clock } from 'lucide-react';
import { PendingBusinessSubmissions } from '@/components/admin/PendingBusinessSubmissions';
import { PublishedBusinessesTable } from '@/components/admin/PublishedBusinessesTable';

const AdminBusinessApproval = () => {
  const { isAdmin } = useAuth();
  const { data: businesses, refetch: refetchBusinesses } = useBusiness();
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

  return (
    <div className="space-y-6">
      <PendingBusinessSubmissions 
        submissions={submissions} 
        onUpdate={fetchSubmissions} 
      />
      <PublishedBusinessesTable 
        businesses={businesses || []} 
        onUpdate={refetchBusinesses} 
      />
    </div>
  );
};

export default AdminBusinessApproval;
