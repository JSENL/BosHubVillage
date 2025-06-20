import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNews } from '@/hooks/useNews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NewsSubmission } from '@/types/submissions';
import { NewsSubmissionCard } from '@/components/NewsSubmissionCard';
import { 
  CheckCircle, 
  Clock,
  Newspaper,
  Trash2,
  MapPin,
  Calendar,
  Edit
} from 'lucide-react';
import { EditNewsDialog } from '@/components/admin/EditNewsDialog';

const AdminNewsApproval = () => {
  const { isAdmin } = useAuth();
  const { data: news, refetch: refetchNews } = useNews();
  const [submissions, setSubmissions] = useState<NewsSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);

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

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId);

      if (error) throw error;

      toast.success('News article deleted successfully');
      refetchNews();
    } catch (error: any) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news article');
    } finally {
      setActionLoading(false);
    }
  };

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

      toast.success('Submission deleted successfully');
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    } finally {
      setActionLoading(false);
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

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Submissions */}
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
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="relative">
                  <NewsSubmissionCard
                    submission={submission}
                    onUpdate={fetchSubmissions}
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

      {/* Published News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Newspaper className="h-5 w-5 mr-2 text-purple-600" />
            Published News ({news?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!news || news.length === 0 ? (
            <div className="text-center p-8">
              <Newspaper className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Published News</h3>
              <p className="text-gray-600">Published news articles will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {article.content}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{article.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {article.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(article.date_posted).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingNews(article)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteNews(article.id)}
                          disabled={actionLoading}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit News Dialog */}
      {editingNews && (
        <EditNewsDialog
          news={editingNews}
          open={!!editingNews}
          onOpenChange={(open) => !open && setEditingNews(null)}
          onUpdate={refetchNews}
        />
      )}
    </div>
  );
};

export default AdminNewsApproval;
