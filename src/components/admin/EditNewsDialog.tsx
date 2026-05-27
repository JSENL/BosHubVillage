
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { isRichTextEmpty, normalizeRichTextForStorage } from '@/lib/richText';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { News } from '@/types/news';
import { AdminDialogHeroEditor } from '@/components/admin/AdminDialogHeroEditor';

interface EditNewsDialogProps {
  news: News;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const EditNewsDialog = ({ news, open, onOpenChange, onUpdate }: EditNewsDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    news.image_url ?? null
  );
  const [formData, setFormData] = useState({
    title: news.title,
    content: news.content,
    source: news.source,
    location: news.location,
    date_posted: news.date_posted,
  });

  useEffect(() => {
    if (open) {
      setCoverImageUrl(news.image_url ?? null);
      setFormData({
        title: news.title,
        content: news.content,
        source: news.source,
        location: news.location,
        date_posted: news.date_posted,
      });
    }
  }, [open, news.id, news.title, news.content, news.source, news.location, news.date_posted, news.image_url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = normalizeRichTextForStorage(formData.content);
    if (isRichTextEmpty(content)) {
      toast.error('Content is required');
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase
        .from('news')
        .update({
          title: formData.title,
          content,
          source: formData.source,
          location: formData.location,
          date_posted: formData.date_posted,
          image_url: coverImageUrl || null,
        })
        .eq('id', news.id);

      if (error) throw error;

      toast.success('News article updated successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating news:', error);
      toast.error('Failed to update news article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Culture Article</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <AdminDialogHeroEditor
            table="news"
            recordId={news.id}
            title={formData.title || news.title}
            imageUrl={coverImageUrl}
            onImageUrlChange={setCoverImageUrl}
            onPersisted={onUpdate}
          />
          
          <div>
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              id="content"
              placeholder="Article body shown on the culture detail page"
              value={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              className="mt-1"
              minHeight="200px"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Rich text formatting appears on the public culture article page.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date_posted">Date Posted</Label>
            <Input
              id="date_posted"
              type="date"
              value={formData.date_posted}
              onChange={(e) => setFormData({ ...formData, date_posted: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Article'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
