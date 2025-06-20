
import { useState } from 'react';
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
import { 
  Newspaper,
  Trash2,
  MapPin,
  Calendar,
  Edit
} from 'lucide-react';
import { News } from '@/types/news';
import { EditNewsDialog } from '@/components/admin/EditNewsDialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PublishedNewsTableProps {
  news: News[];
  onUpdate: () => void;
}

export const PublishedNewsTable = ({ news, onUpdate }: PublishedNewsTableProps) => {
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news article');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
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

      {editingNews && (
        <EditNewsDialog
          news={editingNews}
          open={!!editingNews}
          onOpenChange={(open) => !open && setEditingNews(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};
