import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(news.map(n => n.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
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
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news article');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} news article(s)? This action cannot be undone.`)) {
      return;
    }

    setBulkDeleting(true);
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      toast.success(`${selectedIds.size} news article(s) deleted successfully`);
      setSelectedIds(new Set());
      onUpdate();
    } catch (error: any) {
      console.error('Error bulk deleting news:', error);
      toast.error('Failed to delete news articles');
    } finally {
      setBulkDeleting(false);
    }
  };

  const allSelected = news.length > 0 && news.every(n => selectedIds.has(n.id));
  const someSelected = selectedIds.size > 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2 text-purple-600" />
              Published News ({news?.length || 0})
            </div>
            {someSelected && (
              <Button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
              </Button>
            )}
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
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
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
                      <Checkbox
                        checked={selectedIds.has(article.id)}
                        onCheckedChange={(checked) => handleSelectOne(article.id, !!checked)}
                        aria-label={`Select ${article.title}`}
                      />
                    </TableCell>
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
