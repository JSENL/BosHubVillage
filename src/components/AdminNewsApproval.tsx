
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNews } from '@/hooks/useNews';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NewsSubmission } from '@/types/submissions';
import { Clock } from 'lucide-react';
import { PendingNewsSubmissions } from '@/components/admin/PendingNewsSubmissions';
import { PublishedNewsTable } from '@/components/admin/PublishedNewsTable';

const AdminNewsApproval = () => {
  const { isAdmin } = useAuth();
  const { data: news, refetch: refetchNews } = useNews();
  const [submissions, setSubmissions] = useState<NewsSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('news_submissions')
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
      console.error('Error fetching news submissions:', error);
      toast.error('Failed to load news submissions');
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
          <p>Loading news submissions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PendingNewsSubmissions 
        submissions={submissions} 
        onUpdate={fetchSubmissions} 
      />
      <PublishedNewsTable 
        news={news || []} 
        onUpdate={refetchNews} 
      />
    </div>
  );
};

export default AdminNewsApproval;
